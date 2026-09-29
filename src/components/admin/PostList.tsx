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
    <div>
      <div className="flex justify-between items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-ink">{t('admin:title')}</h2>
        <Button onClick={onNew} variant="primary" className="py-2 px-4">
          {t('admin:new_post')}
        </Button>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-text">{t('admin:list_empty')}</p>
      ) : (
        <ul className="divide-y divide-border border border-border rounded-lg">
          {posts.map((post) => (
            <li key={post.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
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
                <h3 className="font-semibold text-ink truncate">{post.title}</h3>
                {post.tag ? (
                  <span className="text-xs font-semibold uppercase text-kaya">
                    {t(tagLabelKey[post.tag])}
                  </span>
                ) : null}
              </div>
              <Button onClick={() => onEdit(post)} variant="secondary" className="py-2 px-4">
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
