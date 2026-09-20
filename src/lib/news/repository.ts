// src/lib/news/repository.ts
import type { SupabaseClient } from '@supabase/supabase-js';
import { NewsPost } from '../../types/data_models';
import { getSupabaseClient } from '../supabase/client';

/**
 * @description Data Access Object (DAO) boundary for all news content.
 * Components must never talk to Supabase directly - they only use this repository,
 * so the storage mechanism can change without touching the UI.
 */

export interface NewsPage {
  posts: NewsPost[];
  totalCount: number;
}

export interface INewsRepository {
  /** Published posts, newest first, for the given 1-based page. */
  listPublished(page: number, limit: number): Promise<NewsPage>;
  /** A single published post by id, or `null` when it is missing/not published. */
  getById(id: string): Promise<NewsPost | null>;
}

/** Raw row shape of the `posts` table (snake_case columns). */
export interface PostRow {
  id?: string;
  uuid?: string;
  slug?: string;
  title: string;
  excerpt?: string | null;
  summary?: string | null;
  body_html?: string | null;
  published_date?: string | null;
  publishedDate?: string | null;
  tags?: string[] | string | null;
  image_url_references?: string[] | null;
  mainImageReference?: string | null;
  published?: boolean;
}

/**
 * Maps a raw database row into the application's `NewsPost` model.
 * Exported so the transformation can be unit tested without a live database.
 */
export function mapRowToNewsPost(row: PostRow): NewsPost {
  const tags = Array.isArray(row.tags) ? row.tags : row.tags ? [String(row.tags)] : [];

  const images = Array.isArray(row.image_url_references)
    ? row.image_url_references
    : row.mainImageReference
      ? [row.mainImageReference]
      : [];

  return {
    id: row.id ?? row.uuid ?? row.slug ?? '',
    title: row.title,
    summary: row.summary ?? row.excerpt ?? '',
    bodyHtml: row.body_html ?? undefined,
    publishedDate: row.published_date ?? row.publishedDate ?? '',
    tags,
    imageUrlReferences: images,
  };
}

/**
 * Supabase-backed implementation. When no client is configured the feed is
 * (deliberately) empty rather than crashing the app.
 */
export class SupabaseNewsRepository implements INewsRepository {
  constructor(private readonly client: SupabaseClient | null) {}

  async listPublished(page: number, limit: number): Promise<NewsPage> {
    if (!this.client) {
      return { posts: [], totalCount: 0 };
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.client
      .from('posts')
      .select('*', { count: 'exact' })
      .eq('published', true)
      .order('published_date', { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(`Failed to load news posts: ${error.message}`);
    }

    return {
      posts: (data ?? []).map((row) => mapRowToNewsPost(row as PostRow)),
      totalCount: count ?? 0,
    };
  }

  async getById(id: string): Promise<NewsPost | null> {
    if (!this.client) {
      return null;
    }

    const { data, error } = await this.client
      .from('posts')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to load news post ${id}: ${error.message}`);
    }

    return data ? mapRowToNewsPost(data as PostRow) : null;
  }
}

/** Shared repository instance used by the application. */
export const newsRepository: INewsRepository = new SupabaseNewsRepository(getSupabaseClient());
