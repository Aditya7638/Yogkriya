import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Search, PlayCircle } from 'lucide-react';
import { exercisesApi } from '../api';
import { YouTubeEmbed, LoadingPage, EmptyState } from '../components/ui';

interface SearchVideo {
  youtube_id: string;
  title?: string;
  thumbnail_url?: string;
  channel_name?: string;
  view_count?: number;
  like_count?: number;
  relevance_score?: number;
}

export default function VideoSearch() {
  const [searchParams] = useSearchParams();
  const initialTopic = searchParams.get('topic')?.trim() || '';
  const [input, setInput] = useState(initialTopic);
  const [topic, setTopic] = useState(initialTopic.length >= 2 ? initialTopic : '');

  const { data: videos = [], isLoading, isError } = useQuery<SearchVideo[]>({
    queryKey: ['video-search', topic],
    queryFn: () => exercisesApi.videoSearch(topic, 10),
    enabled: topic.length >= 2,
    retry: false,
  });

  const submit = () => {
    const nextTopic = input.trim();
    if (nextTopic.length >= 2) setTopic(nextTopic);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="page-container py-12 max-w-5xl">
      <div className="max-w-2xl mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
            <PlayCircle size={20} />
          </div>
          <h1 className="section-title">Find an Exercise Video</h1>
        </div>
        <p className="text-stone-500 dark:text-stone-400">
          Search by topic. The backend checks several YouTube results and ranks them by exercise relevance and engagement.
        </p>
      </div>

      <div role="search" className="flex flex-col sm:flex-row gap-3 max-w-2xl mb-10">
        <label htmlFor="video-topic" className="sr-only">Exercise topic</label>
        <div className="relative flex-1">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            id="video-topic"
            value={input}
            onChange={event => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Try push-up, deadlift, or yoga breathing"
            className="input pl-10"
            autoComplete="off"
          />
        </div>
        <button
          type="button"
          onClick={event => {
            event.preventDefault();
            submit();
          }}
          disabled={input.trim().length < 2}
          className="btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Search size={16} /> Search videos
        </button>
      </div>

      {isLoading && <LoadingPage />}
      {isError && (
        <EmptyState
          icon={<PlayCircle size={24} className="text-red-400" />}
          title="Video search is unavailable"
          description="Check that the backend has a valid YouTube API key and try again."
        />
      )}
      {!isLoading && !isError && topic && !videos.length && (
        <EmptyState
          icon={<Search size={24} className="text-stone-400" />}
          title="No matching videos found"
          description="Try a more specific exercise name."
        />
      )}

      {!!videos.length && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {videos.map(video => (
            <article key={video.youtube_id} className="card overflow-hidden">
              <YouTubeEmbed youtubeId={video.youtube_id} title={video.title || topic} />
              <div className="p-5">
                <h2 className="font-semibold text-stone-900 dark:text-stone-100 leading-snug">
                  {video.title}
                </h2>
                {video.channel_name && <p className="text-sm text-stone-500 mt-2">{video.channel_name}</p>}
                <div className="flex gap-3 mt-3 text-xs text-stone-400">
                  {video.view_count !== undefined && <span>{video.view_count.toLocaleString()} views</span>}
                  {video.like_count !== undefined && <span>{video.like_count.toLocaleString()} likes</span>}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}