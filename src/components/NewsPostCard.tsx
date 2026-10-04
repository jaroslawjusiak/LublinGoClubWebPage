// src/components/NewsPostCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, SmartImage } from './primitives';
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
    <article className="min-w-0 h-full flex flex-col border-t border-border pt-6 [overflow-wrap:anywhere]">
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <time dateTime={post.publishedAt} className="text-sm text-muted-text">
          {formattedDate}
        </time>
        {post.tag ? (
          <span className="text-xs font-semibold uppercase text-accent">
            {t(tagLabelKey[post.tag])}
          </span>
        ) : null}
      </div>

      <h3 className="text-h3 font-sans font-semibold mb-3 text-ink">{post.title}</h3>

      {post.body ? (
        <p className="text-muted-text mb-5 flex-grow whitespace-pre-line">{post.body}</p>
      ) : null}

      {post.images.length > 0 ? (
        <div className={`grid gap-2 mb-4 ${post.images.length > 1 ? 'grid-cols-2' : ''}`}>
          {post.images.map((image) => (
            <a
              key={image.url}
              href={image.url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={image.alt || t('aktualnosci:open_image')}
              className="block min-w-0 aspect-video rounded-lg overflow-hidden bg-sand"
            >
              <SmartImage src={image.url} alt={image.alt} width={640} height={360} />
            </a>
          ))}
        </div>
      ) : null}

      {post.externalUrl ? (
        <div className="mt-auto">
          <Button href={post.externalUrl} external variant="secondary" className="w-full">
            {t('aktualnosci:external_link')}
          </Button>
        </div>
      ) : null}
    </article>
  );
};

export default NewsPostCard;
