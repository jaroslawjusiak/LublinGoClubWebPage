// src/components/NewsFeed.tsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NewsPostCard from './NewsPostCard';
import { newsRepository } from '../lib/news/repository';
import type { NewsPost } from '../types/data_models';

type FeedState =
  | { status: 'loading' }
  | { status: 'unconfigured' }
  | { status: 'error' }
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
      .catch(() => {
        if (active) {
          setState({ status: 'error' });
        }
      });

    return () => {
      active = false;
    };
  }, [limit]);

  if (state.status === 'loading') {
    return (
      <p
        role="status"
        className="rounded-xl bg-sand/50 p-6 text-muted-text [overflow-wrap:anywhere]"
      >
        {t('aktualnosci:loading')}
      </p>
    );
  }

  if (state.status === 'unconfigured') {
    return (
      <p
        role="status"
        className="rounded-xl bg-sand/50 p-6 text-muted-text [overflow-wrap:anywhere]"
      >
        {t('aktualnosci:unconfigured')}
      </p>
    );
  }

  if (state.status === 'error') {
    return (
      <div
        className="bg-red-50 border border-red-700 text-red-800 p-6 rounded-xl [overflow-wrap:anywhere]"
        role="alert"
      >
        <p>{t('aktualnosci:error')}</p>
      </div>
    );
  }

  if (state.posts.length === 0) {
    return (
      <p
        role="status"
        className="rounded-xl bg-sand/50 p-6 text-muted-text [overflow-wrap:anywhere]"
      >
        {t('aktualnosci:empty')}
      </p>
    );
  }

  return (
    <div className="grid min-w-0 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {state.posts.map((post) => (
        <NewsPostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default NewsFeed;
