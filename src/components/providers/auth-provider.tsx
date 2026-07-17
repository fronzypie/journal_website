"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session, User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthContextValue = {
  loading: boolean;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name?: string,
  ) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updateProfile: (fullName: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  user: User | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  useEffect(() => {
    let isMounted = true;

    async function initializeSession() {
      const result = await supabase.auth.getSession();
      const currentSession = result.data.session;

      if (!isMounted) {
        return;
      }

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    }

    void initializeSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) {
        return;
      }

      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function signIn(email: string, password: string) {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setSession(data.session);
    setUser(data.user ?? null);
    setLoading(false);

    return { error: error?.message ?? null };
  }

  async function signUp(email: string, password: string, name?: string) {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name ?? "",
        },
      },
    });

    if (!error) {
      setSession(data.session);
      setUser(data.user ?? null);
    }

    setLoading(false);

    return {
      error: error?.message ?? null,
      needsConfirmation: !data.session,
    };
  }

  async function signOut() {
    setLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setLoading(false);
    router.push("/login");
  }

  async function resetPassword(email: string) {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    return { error: error?.message ?? null };
  }

  async function updateProfile(fullName: string) {
    setLoading(true);

    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
      },
    });

    if (!error) {
      setUser(data.user ?? null);
      setSession((current) =>
        current && data.user
          ? {
              ...current,
              user: data.user,
            }
          : current,
      );
    }

    setLoading(false);
    return { error: error?.message ?? null };
  }

  async function updatePassword(password: string) {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    return { error: error?.message ?? null };
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      loading,
      session,
      signIn,
      signOut,
      signUp,
      resetPassword,
      updateProfile,
      updatePassword,
      user,
    }),
    [loading, session, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
