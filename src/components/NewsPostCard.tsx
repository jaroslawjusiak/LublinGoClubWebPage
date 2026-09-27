// src/components/NewsPostCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button, SmartImage } from './primitives';
import type { NewsPost, PostTag } from '../types/data_models';

const tagLabelKey: Record<PostTag, string> = {
  spotkanie: 'aktualnosci:tag_spotkanie',
  turniej: 'aktualnosci:tag_turniej',
  wydarzenie: 'aktualnosci:tag_wydarzenie',
};

/**
 * The single news card used by both the Home preview and the `/aktualnosci`
 * feed. It renders the full post (date, tag, title, body, images, optional
 * link) with no decorative "read more" that leads nowhere.
 */
const NewsPostCard: React.FC<{ post: NewsPost }> = ({ post }) => {
  const { t, i18n } = useTranslation();

  const locale = i18n.resolvedLanguage ?? i18n.language ?? 'pl';
  const formattedDate = new Date(post.publishedAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="h-full flex flex-col">
      <div className="mb-2 flex items-center gap-2">
        <time dateTime={post.publishedAt} className="text-sm text-muted-text">
          {formattedDate}
        </time>
        {post.tag ? (
          <span className="text-xs font-semibold uppercase text-kaya">
            {t(tagLabelKey[post.tag])}
          </span>
        ) : null}
      </div>

      <h3 className="text-xl font-bold leading-snug mb-2 text-ink">{post.title}</h3>

      {post.body ? <p className="text-muted-text mb-4 flex-grow">{post.body}</p> : null}

      {post.images.length > 0 ? (
        <div className={`grid gap-2 mb-4 ${post.images.length > 1 ? 'grid-cols-2' : ''}`}>
          {post.images.map((url) => (
            <div key={url} className="aspect-video rounded overflow-hidden bg-gray-200">
              <SmartImage src={url} alt="" width={640} height={360} />
            </div>
          ))}
        </div>
      ) : null}

      {post.externalUrl ? (
        <div className="mt-auto">
          <Button href={post.externalUrl} external variant="secondary" className="w-full py-2">
            {t('aktualnosci:external_link')}
          </Button>
        </div>
      ) : null}
    </Card>
  );
};

export default NewsPostCard;
