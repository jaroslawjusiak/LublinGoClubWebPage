import React from 'react';
import { Card } from './primitives';
import { NewsPost } from '../types/data_models';

/**
 * @description Displays a single news post summary card.
 */
const NewsPostCard: React.FC<{ post: NewsPost }> = ({ post }) => {
  const image = post.imageUrlReferences[0];
  const tag = post.tags[0];

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition duration-300">
      <div className="flex gap-4">
        <div className="w-28 h-28 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
          {image ? (
            <img src={image} alt="" className="w-full h-full object-cover" loading="lazy" />
          ) : null}
        </div>
        <div>
          {tag ? <span className="text-xs font-semibold uppercase text-kaya">{tag}</span> : null}
          <h3 className="text-xl font-bold leading-snug mb-2">{post.title}</h3>
          <p className="text-muted-text text-sm mb-3">{post.summary}</p>
          <span className="text-sm font-medium text-kaya">Czytaj dalej →</span>
        </div>
      </div>
    </Card>
  );
};

export default NewsPostCard;
