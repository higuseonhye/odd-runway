import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getSupabase } from "../lib/supabase";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  userId: string | null;
  loading: boolean;
  supabaseConfigured: boolean;
  signOut: () => Promise<void>;
  signInWithOtp: (email: string) => Promise<{ error: Error | null }>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function ensureProfile(user: User): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.from("profiles").upsert(
    { id: user.id, email: user.email ?? null, updated_at: new Date().toISOString() },
    { onConflict: "id" }
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabaseConfigured = Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  );
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(supabaseConfigured);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setLoading(false);
      return;
    }

    void sb.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setLoading(false);
      if (s?.user) void ensureProfile(s.user);
    });

    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) void ensureProfile(s.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    const sb = getSupabase();
    if (sb) await sb.auth.signOut();
  }, []);

  const signInWithOtp = useCallback(async (email: string) => {
    const sb = getSupabase();
    if (!sb) return { error: new Error("Supabase not configured") };
    const { error } = await sb.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    return { error: error ? new Error(error.message) : null };
  }, []);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    const sb = getSupabase();
    if (!sb) return { error: new Error("Supabase not configured") };
    const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
    return { error: error ? new Error(error.message) : null };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const sb = getSupabase();
    if (!sb) return { error: new Error("Supabase not configured") };
    const { error } = await sb.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    return { error: error ? new Error(error.message) : null };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      userId: session?.user?.id ?? null,
      loading,
      supabaseConfigured,
      signOut,
      signInWithOtp,
      signInWithPassword,
      signUp,
    }),
    [
      session,
      loading,
      supabaseConfigured,
      signOut,
      signInWithOtp,
      signInWithPassword,
      signUp,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
