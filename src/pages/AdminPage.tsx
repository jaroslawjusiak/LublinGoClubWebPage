// src/pages/AdminPage.tsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Section, Container, Button } from '../components/primitives';
import PostList from '../components/admin/PostList';
import PostForm from '../components/admin/PostForm';
import { newsRepository } from '../lib/news/repository';
import { useAuth } from '../lib/supabase/auth';
import type { NewsPost } from '../types/data_models';

/**
 * Protected admin area (hidden from public navigation). Anonymous users see a
 * sign-in prompt, authenticated non-admins see a denial, and allowlisted admins
 * get the post list + form. RLS remains the real authorization boundary.
 */
const AdminPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAdmin, loading, ready, signInWithGoogle, signOut } = useAuth();

  const [posts, setPosts] = useState<NewsPost[] | null>(null);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [editing, setEditing] = useState<NewsPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!user || !isAdmin) return;

    let active = true;
    newsRepository
      .listAll()
      .then((result) => {
        if (active) {
          setPosts(result);
          setPostsError(null);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setPostsError(err instanceof Error ? err.message : t('admin:list_error'));
        }
      });

    return () => {
      active = false;
    };
  }, [user, isAdmin, reloadKey, t]);

  const handleFormDone = () => {
    setEditing(null);
    setCreating(false);
    setPosts(null);
    setReloadKey((key) => key + 1);
  };

  const retryList = () => {
    setPosts(null);
    setPostsError(null);
    setReloadKey((key) => key + 1);
  };

  return (
    <Section id="admin">
      <Container className="max-w-3xl">
        {!ready ? (
          <p className="text-muted-text">{t('admin:unconfigured')}</p>
        ) : loading ? (
          <p className="text-muted-text">{t('admin:loading')}</p>
        ) : !user ? (
          <div className="text-center py-10">
            <h1 className="text-2xl font-bold mb-4 text-ink">{t('admin:title')}</h1>
            <p className="text-muted-text mb-6">{t('admin:sign_in_prompt')}</p>
            <Button onClick={() => void signInWithGoogle()} variant="primary" className="px-6 py-3">
              {t('admin:sign_in')}
            </Button>
          </div>
        ) : !isAdmin ? (
          <div className="text-center py-10">
            <h1 className="text-2xl font-bold mb-4 text-ink">{t('admin:title')}</h1>
            <p className="text-muted-text mb-6">{t('admin:not_authorized')}</p>
            <Button onClick={() => void signOut()} variant="secondary" className="px-6 py-3">
              {t('admin:sign_out')}
            </Button>
          </div>
        ) : creating || editing ? (
          <PostForm initial={editing ?? undefined} onDone={handleFormDone} />
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <Button onClick={() => void signOut()} variant="secondary" className="py-2 px-4">
                {t('admin:sign_out')}
              </Button>
            </div>

            {postsError ? (
              <div role="alert" className="text-red-700">
                <p>{postsError}</p>
                <Button onClick={retryList} variant="secondary" className="mt-3 py-2 px-4">
                  {t('admin:retry')}
                </Button>
              </div>
            ) : posts === null ? (
              <p className="text-muted-text">{t('admin:loading')}</p>
            ) : (
              <PostList
                posts={posts}
                onNew={() => setCreating(true)}
                onEdit={(post) => setEditing(post)}
              />
            )}
          </>
        )}
      </Container>
    </Section>
  );
};

export default AdminPage;
