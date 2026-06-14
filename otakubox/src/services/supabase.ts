import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const signUp = async (email: string, password: string, username: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const upsertLibraryEntry = async (entry: Record<string, unknown>) => {
  const { data, error } = await supabase
    .from('library_entries')
    .upsert(entry, { onConflict: 'user_id,mal_id,type' })
    .select()
    .single();
  return { data, error };
};

export const getLibraryEntries = async (userId: string) => {
  const { data, error } = await supabase
    .from('library_entries')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  return { data, error };
};

export const deleteLibraryEntry = async (entryId: string) => {
  const { error } = await supabase.from('library_entries').delete().eq('id', entryId);
  return { error };
};

export const updateProgress = async (
  entryId: string,
  progress: number,
  score?: number,
  status?: string
) => {
  const updates: Record<string, unknown> = { progress, updated_at: new Date().toISOString() };
  if (score !== undefined) updates.score = score;
  if (status !== undefined) updates.status = status;

  const { data, error } = await supabase
    .from('library_entries')
    .update(updates)
    .eq('id', entryId)
    .select()
    .single();
  return { data, error };
};
