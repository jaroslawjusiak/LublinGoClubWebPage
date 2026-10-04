// src/components/admin/PostList.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../primitives';
import type { NewsPost, PostTag } from '../../types/data_models';

const tagLabelKey: Record<PostTag, string> = {
  spotkanie: 'aktualnosci:tag_spotkanie',
  turniej: 'aktualnosci:tag_turniej',
  wydarzenie: 'aktualnosci:tag_wydarzenie',
};

interface PostListProps {
  posts: NewsPost[];
  onNew: () => void;
  onEdit: (post: NewsPost) => void;
}

/** Admin list of posts (newest first) with an edit action and a "new post" CTA. */
const PostList: React.FC<PostListProps> = ({ posts, onNew, onEdit }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language ?? 'pl';

  return (
    <div className="min-w-0 [overflow-wrap:anywhere]">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <Button onClick={onNew} variant="primary">
          {t('admin:new_post')}
        </Button>
      </div>

      {posts.length === 0 ? (
        <p className="rounded-xl bg-sand p-5 text-muted-text">{t('admin:list_empty')}</p>
      ) : (
        <ul className="divide-y divide-border border border-border bg-surface rounded-xl">
          {posts.map((post) => (
            <li
              key={post.id}
              className="p-5 flex min-w-0 flex-col sm:flex-row sm:items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                  <p className="text-sm text-muted-text">
                    {new Date(post.publishedAt).toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <span
                    className={`text-xs font-semibold uppercase ${
                      post.published ? 'text-green-700' : 'text-amber-700'
                    }`}
                  >
                    {post.published ? t('admin:status_published') : t('admin:status_draft')}
                  </span>
                </div>
                <h2 className="text-body font-sans font-semibold text-ink">{post.title}</h2>
                {post.tag ? (
                  <span className="text-xs font-semibold uppercase text-accent">
                    {t(tagLabelKey[post.tag])}
                  </span>
                ) : null}
              </div>
              <Button onClick={() => onEdit(post)} variant="secondary">
                {t('admin:edit')}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostList;
