from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import json
import math
import re
import time
from threading import Lock

from fastapi import HTTPException

from app.core.config import settings

YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"
YOUTUBE_VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos"
_MAX_CACHE_ENTRIES = 256
_search_cache: dict[tuple[str, str, int], tuple[float, list[dict[str, Any]]]] = {}
_cache_lock = Lock()


def _words(value: str) -> set[str]:
    ignored = {"a", "an", "and", "for", "how", "in", "of", "the", "to", "with"}
    return {
        word for word in re.findall(r"[a-z0-9]+", value.casefold())
        if len(word) > 2 and word not in ignored
    }


def _score_video(video: dict[str, Any], topic: str) -> float:
    topic_words = _words(topic)
    title = video.get("title", "").casefold()
    description = video.get("description", "").casefold()
    title_words = _words(title)
    description_words = _words(description)
    score = 0.0

    if topic.casefold().strip() in title:
        score += 100
    if topic_words:
        score += 60 * len(topic_words & title_words) / len(topic_words)
        score += 20 * len(topic_words & description_words) / len(topic_words)

    instructional_terms = {"form", "tutorial", "technique", "how", "proper", "workout"}
    score += 12 * len(instructional_terms & (title_words | description_words))

    for field, multiplier, limit in (
        ("view_count", 2, 20),
        ("like_count", 2, 15),
        ("comment_count", 1, 8),
    ):
        value = video.get(field, 0)
        score += min(math.log10(max(value, 1)) * multiplier, limit)
    return score


def search_videos(
    query: str,
    max_results: int = 5,
    topic: str | None = None,
) -> list[dict[str, Any]]:
    """Search YouTube, inspect candidates, and rank them by topic relevance."""
    result_limit = min(max_results, 10)
    topic = topic or query
    cache_key = (query.strip().casefold(), topic.strip().casefold(), result_limit)
    now = time.monotonic()
    with _cache_lock:
        cached = _search_cache.get(cache_key)
        if cached and cached[0] > now:
            return cached[1]

    if not settings.YOUTUBE_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="YouTube integration is not configured. Set YOUTUBE_API_KEY.",
        )

    search_params = urlencode(
        {
            "part": "snippet",
            "q": query,
            "type": "video",
            "maxResults": result_limit,
            "safeSearch": "strict",
            "key": settings.YOUTUBE_API_KEY,
        }
    )

    try:
        with urlopen(Request(f"{YOUTUBE_SEARCH_URL}?{search_params}"), timeout=10) as response:
            payload = json.load(response)
    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail="YouTube could not be reached.",
        ) from error

    videos = [
        {
            "id": 0,
            "youtube_id": item["id"]["videoId"],
            "title": item["snippet"].get("title"),
            "description": item["snippet"].get("description", ""),
            "thumbnail_url": item["snippet"].get("thumbnails", {}).get("high", {}).get("url"),
            "channel_name": item["snippet"].get("channelTitle"),
            "duration_seconds": None,
            "category": "fitness",
        }
        for item in payload.get("items", [])
        if item.get("id", {}).get("videoId")
    ]

    if videos:
        video_params = urlencode(
            {
                "part": "statistics",
                "id": ",".join(video["youtube_id"] for video in videos),
                "key": settings.YOUTUBE_API_KEY,
            }
        )
        try:
            with urlopen(Request(f"{YOUTUBE_VIDEOS_URL}?{video_params}"), timeout=10) as response:
                details = json.load(response).get("items", [])
        except Exception as error:
            raise HTTPException(status_code=502, detail="YouTube video details could not be reached.") from error

        statistics = {
            item["id"]: item.get("statistics", {})
            for item in details
        }
        for video in videos:
            stats = statistics.get(video["youtube_id"], {})
            video["view_count"] = int(stats.get("viewCount", 0))
            video["like_count"] = int(stats.get("likeCount", 0))
            video["comment_count"] = int(stats.get("commentCount", 0))
            video["relevance_score"] = _score_video(video, topic)

        matching_videos = [
            video for video in videos
            if _words(topic) & (_words(video["title"]) | _words(video["description"]))
        ]
        videos = matching_videos or videos
        videos.sort(key=lambda video: video["relevance_score"], reverse=True)

    with _cache_lock:
        expired_keys = [key for key, value in _search_cache.items() if value[0] <= now]
        for key in expired_keys:
            del _search_cache[key]
        if len(_search_cache) >= _MAX_CACHE_ENTRIES:
            oldest_key = min(_search_cache, key=lambda key: _search_cache[key][0])
            del _search_cache[oldest_key]
        _search_cache[cache_key] = (
            now + max(settings.YOUTUBE_CACHE_TTL_SECONDS, 0),
            videos,
        )
    return videos


def find_exercise_video(exercise_name: str) -> dict[str, Any] | None:
    videos = search_videos(
        f'"{exercise_name}" exercise proper form tutorial',
        max_results=10,
        topic=exercise_name,
    )
    return videos[0] if videos else None
