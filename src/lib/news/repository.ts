// src/lib/news/repository.ts
import type { SupabaseClient } from '@supabase/supabase-js';
import type { NewsPost, PostTag } from '../../types/data_models';
import { getSupabaseClient } from '../supabase/client';

/**
 * Data access boundary for news content. Components never talk to Supabase
 * directly — they consume typed `NewsPost` objects through this repository.
 */

export interface NewsPage {
  posts: NewsPost[];
  totalCount: number;
}

/**
 * `listPublished` distinguishes a missing Supabase configuration (dev without
 * env vars) from a real, but empty, published feed.
 */
export type NewsListResult =
  | { status: 'ok'; page: NewsPage }
  | { status: 'unconfigured' };

/** Fields an admin provides when creating or editing a post. */
export interface NewsPostInput {
  title: string;
  body: string;
  publishedAt: string;
  tag?: PostTag;
  images: string[];
  externalUrl?: string;
}

export interface INewsRepository {
  /** Published posts, newest first, for the given 1-based page. */
  listPublished(page: number, limit: number): Promise<NewsListResult>;
  /** All posts (RLS lets admins see unpublished drafts too), newest first. */
  listAll(): Promise<NewsPost[]>;
  /** Create and immediately publish a post. */
  create(input: NewsPostInput): Promise<NewsPost>;
  /** Update a post. */
  update(id: string, input: NewsPostInput): Promise<NewsPost>;
  /** Delete a post. */
  remove(id: string): Promise<void>;
}

/**
 * The single, concrete row shape of the `posts` table (snake_case columns).
 * This is the one contract the migration must match; the mapper does not accept
 * speculative aliases (uuid/slug, excerpt, publishedDate, mainImageReference…).
 */
export interface PostRow {
  id: string;
  title: string;
  body: string | null;
  tag: string | null;
  image_urls: string[] | null;
  external_url: string | null;
  published_at: string;
  published: boolean;
}

const ALLOWED_TAGS: readonly PostTag[] = ['spotkanie', 'turniej', 'wydarzenie'];

/**
 * Maps a raw database row into the `NewsPost` model, failing loudly on invalid
 * data instead of silently producing empty ids or dates.
 */
export function mapRowToNewsPost(row: PostRow): NewsPost {
  if (!row.id) {
    throw new Error('News post is missing an id.');
  }
  if (!row.title) {
    throw new Error('News post is missing a title.');
  }
  if (!row.published_at) {
    throw new Error(`News post "${row.title}" is missing a published date.`);
  }

  let tag: PostTag | undefined;
  if (row.tag) {
    if (!ALLOWED_TAGS.includes(row.tag as PostTag)) {
      throw new Error(`News post "${row.title}" has an unknown tag "${row.tag}".`);
    }
    tag = row.tag as PostTag;
  }

  return {
    id: row.id,
    title: row.title,
    body: row.body ?? '',
    publishedAt: row.published_at,
    tag,
    images: row.image_urls ?? [],
    externalUrl: row.external_url ?? undefined,
  };
}

/** Builds the insert/update row from the admin input (always published). */
function toRow(input: NewsPostInput): Omit<PostRow, 'id'> {
  return {
    title: input.title,
    body: input.body || null,
    tag: input.tag ?? null,
    image_urls: input.images,
    external_url: input.externalUrl ?? null,
    published_at: input.publishedAt,
    published: true,
  };
}

/**
 * Supabase-backed implementation. When no client is configured, public reads
 * return `{ status: 'unconfigured' }`; admin mutations fail with a clear error.
 * RLS is the actual authorization boundary — these methods never decide
 * permissions themselves.
 */
export class SupabaseNewsRepository implements INewsRepository {
  constructor(private readonly client: SupabaseClient | null) {}

  private requireClient(): SupabaseClient {
    if (!this.client) {
      throw new Error('Supabase is not configured.');
    }
    return this.client;
  }

  async listPublished(page: number, limit: number): Promise<NewsListResult> {
    if (!this.client) {
      return { status: 'unconfigured' };
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.client
      .from('posts')
      .select('*', { count: 'exact' })
      .eq('published', true)
      .order('published_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(`Failed to load news posts: ${error.message}`);
    }

    return {
      status: 'ok',
      page: {
        posts: (data ?? []).map((row) => mapRowToNewsPost(row as PostRow)),
        totalCount: count ?? 0,
      },
    };
  }

  async listAll(): Promise<NewsPost[]> {
    const client = this.requireClient();

    const { data, error } = await client
      .from('posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to load news posts: ${error.message}`);
    }

    return (data ?? []).map((row) => mapRowToNewsPost(row as PostRow));
  }

  async create(input: NewsPostInput): Promise<NewsPost> {
    const client = this.requireClient();

    const { data, error } = await client
      .from('posts')
      .insert(toRow(input))
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create news post: ${error.message}`);
    }

    return mapRowToNewsPost(data as PostRow);
  }

  async update(id: string, input: NewsPostInput): Promise<NewsPost> {
    const client = this.requireClient();

    const { data, error } = await client
      .from('posts')
      .update(toRow(input))
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update news post: ${error.message}`);
    }

    return mapRowToNewsPost(data as PostRow);
  }

  async remove(id: string): Promise<void> {
    const client = this.requireClient();

    const { error } = await client.from('posts').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete news post: ${error.message}`);
    }
  }
}

/** Shared repository instance used by the application. */
export const newsRepository: INewsRepository = new SupabaseNewsRepository(getSupabaseClient());
