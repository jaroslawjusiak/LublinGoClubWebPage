// src/lib/supabase/auth.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabaseClient } from './client';

interface AuthState {
  /** The signed-in user, or null when anonymous. */
  user: User | null;
  /** Whether the user is an allowlisted admin (UX only; RLS is the boundary). */
  isAdmin: boolean;
  /** True while the initial session is being resolved. */
  loading: boolean;
  /** False when Supabase env vars are missing (dev without a project). */
  ready: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const client = useMemo(() => getSupabaseClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(() => Boolean(client));
  // Admin result is keyed by user id so it never leaks between accounts.
  const [adminState, setAdminState] = useState<{ userId: string; value: boolean } | null>(null);

  useEffect(() => {
    if (!client) return;

    let active = true;
    client.auth.getSession().then(({ data }) => {
      if (active) {
        setUser(data.session?.user ?? null);
        setLoading(false);
      }
    });

    const { data } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [client]);

  useEffect(() => {
    if (!client || !user) return;

    let active = true;
    client.rpc('is_admin').then(({ data, error }) => {
      if (active && !error) setAdminState({ userId: user.id, value: Boolean(data) });
    });

    return () => {
      active = false;
    };
  }, [client, user]);

  const isAdmin =
    adminState !== null && user !== null && adminState.userId === user.id && adminState.value;

  const signInWithGoogle = async () => {
    if (!client) return;
    await client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/admin` },
    });
  };

  const signOut = async () => {
    if (!client) return;
    await client.auth.signOut();
  };

  const value = useMemo<AuthState>(
    () => ({ user, isAdmin, loading, ready: Boolean(client), signInWithGoogle, signOut }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, isAdmin, loading, client],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
