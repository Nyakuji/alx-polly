'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

// Define our custom user profile type
export type UserProfile = {
  id: string;
  email?: string;
  role: string | null;
  full_name: string | null;
};

type AuthContextType = {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChange is called on initialization, so we don't need getInitialSession
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          // Custom claims are in app_metadata
          role: session.user.app_metadata?.role || 'user',
          full_name: session.user.app_metadata?.full_name || null,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    // Pass the full_name in the options.
    // A database trigger will use this to create the user's profile.
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    // The onAuthStateChange listener will handle setting the user and session state if the user is logged in.
    // Since the user is redirected to the login page, we don't need to refresh the session here.
    // They will get a fresh session with claims upon logging in.
    return { error };
  };
  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in...');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('Supabase signIn error:', error);
      return { error };
    }

    if (data.session) {
      console.log('Supabase signIn success, session found. Returning no error.');
      return { error: null };
    }

    console.warn('Supabase signIn returned no error, but also no session. This is an unexpected state.');
    return { error: { message: 'Login failed: No session returned.', name: 'LoginError' } as any };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = {
    session,
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
