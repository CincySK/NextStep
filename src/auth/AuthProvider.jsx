import { createContext, useEffect, useMemo, useState } from "react";
import { migrateAnonymousProgressToUser } from "./dataMigration";
import { clearActiveUserId, setActiveUserId } from "./storageScope";
import { isSupabaseConfigured, supabase } from "./supabaseClient";
import { hasGuestData, isGuestMode, startGuestMode, stopGuestMode } from "./GuestSessionManager";
import { clearGuestProgress, migrateGuestProgressToUser } from "../session/ProgressMigrationService";
import { clearSelectedRole, getSelectedRole, setSelectedRole } from "./roleSession";

const AuthContext = createContext(null);

function mapAuthError(error, fallback) {
  if (!error) return fallback;
  const msg = String(error.message ?? error);
  if (/invalid login credentials/i.test(msg)) return "The email or password is incorrect.";
  if (/user already registered/i.test(msg)) return "An account with this email already exists.";
  if (/password/i.test(msg) && /at least/i.test(msg)) return "Password must be at least 8 characters.";
  return fallback ?? msg;
}

function normalizeRole(value) {
  return value === "teacher" ? "teacher" : "student";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [guestMode, setGuestMode] = useState(() => isGuestMode());
  const [selectedRole, setSelectedRoleState] = useState(() => getSelectedRole());

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
        setGuestMode(false);
        stopGuestMode();
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
        setGuestMode(false);
        stopGuestMode();
      } else {
        clearActiveUserId();
      }
    });

    return () => {
      cancelled = true;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const userRole = normalizeRole(
    user?.user_metadata?.role
    ?? user?.app_metadata?.role
    ?? selectedRole
  );

  async function signUp({ email, password, displayName, role = "student", migrateGuestProgress = true }) {
    if (!supabase) throw new Error("Auth provider is not configured.");
    const normalizedRole = normalizeRole(role || selectedRole || "student");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName, role: normalizedRole }
      }
    });
    if (error) throw new Error(mapAuthError(error, "Could not create account."));
    const authedUserId = data?.session?.user?.id;
    if (authedUserId) {
      if (guestMode && hasGuestData()) {
        if (migrateGuestProgress) migrateGuestProgressToUser(authedUserId);
        clearGuestProgress();
      }
      setActiveUserId(authedUserId);
      migrateAnonymousProgressToUser(authedUserId);
      setGuestMode(false);
      stopGuestMode();
    }
    setSelectedRole(normalizedRole);
    setSelectedRoleState(normalizedRole);
    return data;
  }

  async function signIn({ email, password, role = "", migrateGuestProgress = true }) {
    if (!supabase) throw new Error("Auth provider is not configured.");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(mapAuthError(error, "Could not sign in."));
    const metadataRole = data?.user?.user_metadata?.role ?? data?.user?.app_metadata?.role ?? "";
    const requestedRole = normalizeRole(role || selectedRole || "student");
    let accountRole = normalizeRole(metadataRole || "student");
    if (!metadataRole) {
      await supabase.auth.updateUser({
        data: {
          ...data?.user?.user_metadata,
          role: requestedRole
        }
      });
      accountRole = requestedRole;
    }
    if (requestedRole && accountRole !== requestedRole) {
      await supabase.auth.signOut();
      throw new Error(`This account is configured as ${accountRole}. Please continue as ${accountRole}.`);
    }
    if (data?.user?.id) {
      if (guestMode && hasGuestData()) {
        if (migrateGuestProgress) migrateGuestProgressToUser(data.user.id);
        clearGuestProgress();
      }
      setActiveUserId(data.user.id);
      migrateAnonymousProgressToUser(data.user.id);
      setGuestMode(false);
      stopGuestMode();
    }
    setSelectedRole(accountRole);
    setSelectedRoleState(accountRole);
    return data;
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    clearActiveUserId();
    setGuestMode(false);
    stopGuestMode();
    clearSelectedRole();
    setSelectedRoleState("");
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

  function enableGuestMode() {
    startGuestMode();
    setGuestMode(true);
    if (!selectedRole) {
      setSelectedRole("student");
      setSelectedRoleState("student");
    }
  }

  function disableGuestMode() {
    stopGuestMode();
    setGuestMode(false);
  }

  function chooseRole(role) {
    const normalizedRole = normalizeRole(role);
    setSelectedRole(normalizedRole);
    setSelectedRoleState(normalizedRole);
  }

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      authError,
      isAuthenticated: Boolean(user),
      isGuestMode: guestMode,
      isConfigured: isSupabaseConfigured,
      userRole,
      selectedRole,
      chooseRole,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updateDisplayName,
      enableGuestMode,
      disableGuestMode
    }),
    [authError, guestMode, loading, selectedRole, session, user, userRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
