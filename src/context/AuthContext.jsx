import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { useLanguage } from '../i18n/LanguageContext';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authDiagnosticError, setAuthDiagnosticError] = useState(null);
  const { setLanguage } = useLanguage();

  useEffect(() => {
    // Check initial auth session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('[AuthContext] getSession Error:', error);
      }
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[AuthContext] Auth State Change:', event, session?.user?.id);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        setAuthDiagnosticError(null);
        fetchProfile(currentUser.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data);
        if (data.preferred_language) {
          setLanguage(data.preferred_language);
        }
      }
    } catch (err) {
      console.warn('[AuthContext] Fetch profile warning:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedFields) => {
    if (!user) return { success: false, error: 'User not logged in' };
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, email: user.email, ...updatedFields, updated_at: new Date().toISOString() })
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      if (data.preferred_language) {
        setLanguage(data.preferred_language);
      }
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Google OAuth Login with full diagnostic error logging
  const signInWithGoogle = async () => {
    setAuthDiagnosticError(null);
    try {
      const currentOrigin = window.location.origin;
      console.log('[AuthContext] Initiating Google OAuth from origin:', currentOrigin);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${currentOrigin}/settings`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        console.error('[Google OAuth Full Error Object]:', error);
        
        let diagnosticMsg = `Google Sign-In failed: ${error.message}.`;
        if (error.message.includes('redirect') || error.status === 400) {
          diagnosticMsg += `\n\n[Fix Guide]:\n1. Ensure Authorized Redirect URI in Google Cloud Console matches: https://<project-ref>.supabase.co/auth/v1/callback\n2. Ensure Authorized JavaScript Origin includes: ${currentOrigin}\n3. Set Site URL in Supabase Dashboard to match your deployed Vercel domain.`;
        }
        setAuthDiagnosticError(diagnosticMsg);
        return { success: false, error: diagnosticMsg, rawError: error };
      }

      return { success: true, data };
    } catch (err) {
      console.error('[Google OAuth Exception]:', err);
      const msg = `Exception during Google Login: ${err.message || 'Unknown network error'}`;
      setAuthDiagnosticError(msg);
      return { success: false, error: msg, rawError: err };
    }
  };

  // Magic Link Fallback Login
  const signInWithMagicLink = async (email) => {
    setAuthDiagnosticError(null);
    try {
      const currentOrigin = window.location.origin;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${currentOrigin}/settings`
        }
      });
      if (error) {
        console.error('[Magic Link Error]:', error);
        throw error;
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Logout
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setAuthDiagnosticError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        authDiagnosticError,
        signInWithGoogle,
        signInWithMagicLink,
        signOut,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
