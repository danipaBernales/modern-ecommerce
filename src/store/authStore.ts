import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  username: string;
  full_name?: string | null;
  address?: string | null;
  phone?: string | null;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  checkUser: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any | null, data: any | null }>;
  signOut: () => Promise<void>;
  fetchUserProfile: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  setProfile: (profile) => set({ profile }),
  checkUser: async () => {
    try {
      // Get the current session instead of just the user
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        set({ user: null, profile: null, loading: false });
        return;
      }
      
      // If we have a session, get the user
      if (sessionData?.session) {
        const { data: userData } = await supabase.auth.getUser();
        set({ user: userData.user, loading: false });
        
        // If user exists, fetch their profile
        if (userData.user) {
          await get().fetchUserProfile(userData.user.id);
        }
      } else {
        set({ user: null, profile: null, loading: false });
      }
    } catch (error) {
      console.error('Error checking user:', error);
      set({ user: null, profile: null, loading: false });
    }
  },
  fetchUserProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      if (data) {
        set({ profile: data as UserProfile });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  },
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error && data?.user) {
        set({ user: data.user, loading: false });
        // Fetch user profile after successful sign in
        await get().fetchUserProfile(data.user.id);
      }
      
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  },
  signUp: async (email, password, username) => {
    try {
      // First check if username is already taken
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .limit(1);
        
      if (checkError) {
        console.error('Error checking username:', checkError);
        return { error: checkError, data: null };
      }
      
      if (existingUsers && existingUsers.length > 0) {
        return { 
          error: { message: 'Username is already taken. Please choose another one.' }, 
          data: null 
        };
      }
      
      // If username is available, proceed with signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          }
        }
      });
      
      if (!error && data?.user) {
        // The profile will be created automatically by the database trigger
        setTimeout(async () => {
          await get().fetchUserProfile(data.user!.id);
        }, 500);
        
        set({ 
          user: data.user,
          loading: false 
        });
      }
      
      return { error, data };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error, data: null };
    }
  },
  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, profile: null });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },
}));
