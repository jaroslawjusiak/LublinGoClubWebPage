// src/components/NewsFeed.tsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NewsPostCard from './NewsPostCard';
import { newsRepository } from '../lib/news/repository';
import type { NewsPost } from '../types/data_models';

type FeedState =
  | { status: 'loading' }
  | { status: 'unconfigured' }
  | { status: 'error'; message: string }
  | { status: 'ready'; posts: NewsPost[] };

const DEFAULT_LIMIT = 50;

/**
 * The one news feed implementation shared by the Home preview and the
 * `/aktualnosci` page. It owns the loading / unconfigured / error / empty /
 * ready states so both places behave identically.
 */
const NewsFeed: React.FC<{ limit?: number }> = ({ limit }) => {
  const { t } = useTranslation();
  const [state, setState] = useState<FeedState>({ status: 'loading' });

  useEffect(() => {
    let active = true;

    newsRepository
      .listPublished(1, limit ?? DEFAULT_LIMIT)
      .then((result) => {
        if (!active) return;
        setState(
          result.status === 'unconfigured'
            ? { status: 'unconfigured' }
            : { status: 'ready', posts: result.page.posts },
        );
      })
      .catch((cause: unknown) => {
        if (active) {
          setState({
            status: 'error',
            message: cause instanceof Error ? cause.message : t('aktualnosci:error'),
          });
        }
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  if (state.status === 'loading') {
    return <p className="text-center py-10 text-lg text-muted-text">{t('aktualnosci:loading')}</p>;
  }

  if (state.status === 'unconfigured') {
    return (
      <p className="text-center py-10 text-lg text-muted-text">{t('aktualnosci:unconfigured')}</p>
    );
  }

  if (state.status === 'error') {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto"
        role="alert"
      >
        <p>{state.message}</p>
      </div>
    );
  }

  if (state.posts.length === 0) {
    return <p className="text-center py-10 text-lg text-muted-text">{t('aktualnosci:empty')}</p>;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {state.posts.map((post) => (
        <NewsPostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default NewsFeed;
