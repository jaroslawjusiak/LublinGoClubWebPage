import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseClient } from '../supabase/client';
import { initialLessons } from '../../data/lessons';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
  thumbnailUrl: string;
  language: 'pl' | 'en' | 'uk';
  pageCount: number | null;
}
export type LessonInput = Omit<Lesson, 'id'>;
export interface LessonRow {
  id: string;
  title: string;
  description: string;
  pdf_url: string;
  thumbnail_url: string;
  language: 'pl' | 'en' | 'uk';
  page_count: number | null;
}
export function mapLesson(row: LessonRow): Lesson {
  if (
    !row.id ||
    !row.title?.trim() ||
    !row.description?.trim() ||
    !row.pdf_url ||
    !row.thumbnail_url ||
    !['pl', 'en', 'uk'].includes(row.language)
  ) {
    throw new Error('Invalid lesson metadata.');
  }
  for (const url of [row.pdf_url, row.thumbnail_url]) {
    if (!url.startsWith('/assets/lekcje/') && !/^https?:\/\//.test(url))
      throw new Error('Invalid lesson URL.');
  }
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    pdfUrl: row.pdf_url,
    thumbnailUrl: row.thumbnail_url,
    language: row.language,
    pageCount: row.page_count,
  };
}
export class SupabaseLessonsRepository {
  constructor(private readonly client: SupabaseClient | null) {}
  async list(): Promise<Lesson[]> {
    if (!this.client) return initialLessons;
    const { data, error } = await this.client
      .from('lessons')
      .select('*')
      .order('created_at', { ascending: false })
      .order('id', { ascending: true });
    if (error) throw new Error(`Failed to load lessons: ${error.message}`);
    return (data ?? []).map((row) => mapLesson(row as LessonRow));
  }
  async find(id: string): Promise<Lesson | null> {
    if (!this.client) throw new Error('Supabase is not configured.');
    const { data, error } = await this.client
      .from('lessons')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new Error(`Could not verify lesson: ${error.message}`);
    return data ? mapLesson(data as LessonRow) : null;
  }
  async update(id: string, input: LessonInput): Promise<Lesson> {
    if (!this.client) throw new Error('Supabase is not configured.');
    const { data, error } = await this.client
      .from('lessons')
      .update({
        title: input.title,
        description: input.description,
        pdf_url: input.pdfUrl,
        thumbnail_url: input.thumbnailUrl,
        language: input.language,
        page_count: input.pageCount,
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(`Failed to update lesson: ${error.message}`);
    return mapLesson(data as LessonRow);
  }
  async remove(id: string): Promise<void> {
    if (!this.client) throw new Error('Supabase is not configured.');
    const { error } = await this.client.from('lessons').delete().eq('id', id);
    if (error) throw new Error(`Failed to delete lesson: ${error.message}`);
  }
  async create(input: LessonInput, id = crypto.randomUUID()): Promise<Lesson> {
    if (!this.client) throw new Error('Supabase is not configured.');
    const { data, error } = await this.client
      .from('lessons')
      .insert({
        id,
        title: input.title,
        description: input.description,
        pdf_url: input.pdfUrl,
        thumbnail_url: input.thumbnailUrl,
        language: input.language,
        page_count: input.pageCount,
      })
      .select()
      .single();
    if (error) throw new Error(`Failed to create lesson: ${error.message}`);
    return mapLesson(data as LessonRow);
  }
}
export const lessonsRepository = new SupabaseLessonsRepository(getSupabaseClient());
