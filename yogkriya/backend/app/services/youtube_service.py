from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import json

from fastapi import HTTPException

from app.core.config import settings

YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"


def search_videos(query: str, max_results: int = 5) -> list[dict[str, Any]]:
    """Search YouTube for exercise videos without exposing the API key to clients."""
    if not settings.YOUTUBE_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="YouTube integration is not configured. Set YOUTUBE_API_KEY.",
        )

    params = urlencode(
        {
            "part": "snippet",
            "q": query,
            "type": "video",
            "maxResults": min(max_results, 10),
            "safeSearch": "strict",
            "key": settings.YOUTUBE_API_KEY,
        }
    )
    request = Request(
        f"{YOUTUBE_SEARCH_URL}?{params}",
        headers={"Accept": "application/json"},
    )

    try:
        with urlopen(request, timeout=10) as response:
            payload = json.load(response)
    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail="YouTube could not be reached.",
        ) from error

    return [
        {
            "id": 0,
            "youtube_id": item["id"]["videoId"],
            "title": item["snippet"].get("title"),
            "thumbnail_url": item["snippet"].get("thumbnails", {}).get("high", {}).get("url"),
            "channel_name": item["snippet"].get("channelTitle"),
            "category": "fitness",
        }
        for item in payload.get("items", [])
        if item.get("id", {}).get("videoId")
    ]


def find_exercise_video(exercise_name: str) -> dict[str, Any] | None:
    videos = search_videos(f'"{exercise_name}" exercise proper form tutorial', max_results=1)
    return videos[0] if videos else None
