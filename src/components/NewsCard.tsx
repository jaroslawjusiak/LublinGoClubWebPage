// src/components/NewsCard.tsx
import React from 'react';
import { NewsPost } from '../types/data_models';
import { Card, Button } from './primitives';

interface NewsCardProps {
  post: NewsPost;
}

/**
 * @component NewsCard
 * @description Displays a summary of a single news post using the shared primitives.
 */
const NewsCard: React.FC<NewsCardProps> = ({ post }) => (
  <Card className="h-full flex flex-col">
    <div className="flex-shrink-0 mb-4">
      <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded overflow-hidden">
        <span className="text-sm text-gray-500">
          Miniatura: {post.imageUrlReferences[0] ?? 'brak'}
        </span>
      </div>
    </div>
    <div className="flex flex-col flex-grow">
      <h3 className="text-2xl font-semibold mb-2 text-ink">{post.title}</h3>
      <p className="text-muted-text mb-4 flex-grow">{post.summary}</p>

      <div className="flex flex-wrap items-center text-sm text-muted-text mb-4">
        <span>Opublikowano: {new Date(post.publishedDate).toLocaleDateString('pl-PL')}</span>
        {post.tags.length > 0 ? <span className="mx-3">|</span> : null}
        {post.tags.map((tag) => (
          <span key={tag} className="inline-block bg-gray-100 text-xs px-2 py-1 rounded-full mr-2 mb-1">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-border">
        <Button to={`/aktualnosci/${post.id}`} variant="secondary" className="w-full">
          Czytaj więcej
        </Button>
      </div>
    </div>
  </Card>
);

export default NewsCard;
