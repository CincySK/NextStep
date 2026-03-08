import { createContext, useEffect, useMemo, useState } from "react";
import { migrateAnonymousProgressToUser } from "./dataMigration";
import { clearActiveUserId, setActiveUserId } from "./storageScope";
import { isSupabaseConfigured, supabase } from "./supabaseClient";

const AuthContext = createContext(null);

function mapAuthError(error, fallback) {
  if (!error) return fallback;
  const msg = String(error.message ?? error);
  if (/invalid login credentials/i.test(msg)) return "The email or password is incorrect.";
  if (/user already registered/i.test(msg)) return "An account with this email already exists.";
  if (/password/i.test(msg) && /at least/i.test(msg)) return "Password must be at least 8 characters.";
  return fallback ?? msg;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      setAuthError("Authentication is not configured. Add Supabase environment variables.");
      return;
    }

    let cancelled = false;

    supabase.auth.getSession().then(({ data, error }) => {
      if (cancelled) return;
      if (error) {
        setAuthError(mapAuthError(error, "Could not initialize authentication."));
      }
      const nextSession = data?.session ?? null;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user?.id) {
        setActiveUserId(nextSession.user.id);
        migrateAnonymousProgressToUser(nextSession.user.id);
      } else {
        clearActiveUserId();
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user?.id) {
        setActiveUserId(nextSession.user.id);
        migrateAnonymousProgressToUser(nextSession.user.id);
      } else {
        clearActiveUserId();
      }
    });

    return () => {
      cancelled = true;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  async function signUp({ email, password, displayName }) {
    if (!supabase) throw new Error("Auth provider is not configured.");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName }
      }
    });
    if (error) throw new Error(mapAuthError(error, "Could not create account."));
    const authedUserId = data?.session?.user?.id;
    if (authedUserId) {
      setActiveUserId(authedUserId);
      migrateAnonymousProgressToUser(authedUserId);
    }
    return data;
  }

  async function signIn({ email, password }) {
    if (!supabase) throw new Error("Auth provider is not configured.");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(mapAuthError(error, "Could not sign in."));
    if (data?.user?.id) {
      setActiveUserId(data.user.id);
      migrateAnonymousProgressToUser(data.user.id);
    }
    return data;
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    clearActiveUserId();
  }

  async function resetPassword(email) {
    if (!supabase) throw new Error("Auth provider is not configured.");
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw new Error(mapAuthError(error, "Could not send reset link."));
  }

  async function updateDisplayName(displayName) {
    if (!supabase) throw new Error("Auth provider is not configured.");
    const { data, error } = await supabase.auth.updateUser({
      data: { display_name: displayName }
    });
    if (error) throw new Error(mapAuthError(error, "Could not update profile."));
    return data;
  }

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      authError,
      isAuthenticated: Boolean(user),
      isConfigured: isSupabaseConfigured,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updateDisplayName
    }),
    [authError, loading, session, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
