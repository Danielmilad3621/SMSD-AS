import { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAllowed: boolean | null;
}

interface UseAuthReturn extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  checkAllowlist: (email: string) => Promise<boolean>;
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAllowed: null,
  });

  // Check if user is in allowlist via RPC function
  const checkAllowlist = useCallback(async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('is_user_allowed', {
        user_email: email,
      });

      if (error) {
        console.error('Allowlist check failed:', error);
        return false;
      }

      return data === true;
    } catch (err) {
      console.error('Allowlist check error:', err);
      return false;
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
        }));

        // Check allowlist when user signs in
        if (event === 'SIGNED_IN' && session?.user?.email) {
          const allowed = await checkAllowlist(session.user.email);
          setState(prev => ({ ...prev, isAllowed: allowed }));
          
          if (!allowed) {
            // Immediately sign out if not allowed
            await supabase.auth.signOut();
          }
        }

        if (event === 'SIGNED_OUT') {
          setState(prev => ({ ...prev, isAllowed: null }));
        }
      }
    );

    // THEN get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: false,
      }));

      if (session?.user?.email) {
        const allowed = await checkAllowlist(session.user.email);
        setState(prev => ({ ...prev, isAllowed: allowed }));
        
        if (!allowed) {
          await supabase.auth.signOut();
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkAllowlist]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    checkAllowlist,
  };
}
