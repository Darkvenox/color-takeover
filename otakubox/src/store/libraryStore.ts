import { create } from 'zustand';
import { LibraryEntry, ContentType, ContentStatus, UserStats } from '../types';
import {
  getLibraryEntries,
  upsertLibraryEntry,
  deleteLibraryEntry,
  updateProgress,
} from '../services/supabase';

interface LibraryState {
  entries: LibraryEntry[];
  isLoading: boolean;
  error: string | null;
  fetchEntries: (userId: string) => Promise<void>;
  addEntry: (entry: Omit<LibraryEntry, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  removeEntry: (entryId: string) => Promise<void>;
  incrementProgress: (entryId: string) => Promise<void>;
  updateEntry: (entryId: string, progress: number, score?: number, status?: ContentStatus) => Promise<void>;
  getStats: () => UserStats;
  getEntriesByType: (type: ContentType) => LibraryEntry[];
  getEntriesByStatus: (status: ContentStatus) => LibraryEntry[];
  getInProgress: () => LibraryEntry[];
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  entries: [],
  isLoading: false,
  error: null,

  fetchEntries: async (userId: string) => {
    set({ isLoading: true, error: null });
    const { data, error } = await getLibraryEntries(userId);
    if (error) {
      set({ error: error.message, isLoading: false });
    } else {
      set({ entries: (data as LibraryEntry[]) ?? [], isLoading: false });
    }
  },

  addEntry: async (entryData) => {
    const now = new Date().toISOString();
    const { data, error } = await upsertLibraryEntry({
      ...entryData,
      created_at: now,
      updated_at: now,
    });
    if (!error && data) {
      const newEntry = data as LibraryEntry;
      set((state) => ({
        entries: [
          newEntry,
          ...state.entries.filter((e) => e.id !== newEntry.id),
        ],
      }));
    }
  },

  removeEntry: async (entryId: string) => {
    const { error } = await deleteLibraryEntry(entryId);
    if (!error) {
      set((state) => ({
        entries: state.entries.filter((e) => e.id !== entryId),
      }));
    }
  },

  incrementProgress: async (entryId: string) => {
    const entry = get().entries.find((e) => e.id === entryId);
    if (!entry) return;

    const newProgress = entry.progress + 1;
    const isCompleted = entry.total && newProgress >= entry.total;
    const newStatus: ContentStatus = isCompleted ? 'completed' : entry.status;

    const { data, error } = await updateProgress(entryId, newProgress, undefined, newStatus);
    if (!error && data) {
      set((state) => ({
        entries: state.entries.map((e) =>
          e.id === entryId ? (data as LibraryEntry) : e
        ),
      }));
    }
  },

  updateEntry: async (entryId, progress, score, status) => {
    const { data, error } = await updateProgress(entryId, progress, score, status);
    if (!error && data) {
      set((state) => ({
        entries: state.entries.map((e) =>
          e.id === entryId ? (data as LibraryEntry) : e
        ),
      }));
    }
  },

  getStats: (): UserStats => {
    const entries = get().entries;
    const completed = entries.filter((e) => e.status === 'completed');
    const scored = entries.filter((e) => e.score != null && e.score > 0);
    const avgScore =
      scored.length > 0
        ? scored.reduce((sum, e) => sum + (e.score ?? 0), 0) / scored.length
        : 0;

    const genreCount: Record<string, number> = {};
    entries.forEach((e) => {
      (e.genres ?? []).forEach((g) => {
        genreCount[g] = (genreCount[g] ?? 0) + 1;
      });
    });
    const top_genres = Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([genre, count]) => ({ genre, count }));

    return {
      total_anime: entries.filter((e) => e.type === 'anime').length,
      total_manga: entries.filter((e) => e.type === 'manga').length,
      total_webtoon: entries.filter((e) => e.type === 'webtoon').length,
      total_light_novel: entries.filter((e) => e.type === 'light_novel').length,
      episodes_watched: entries
        .filter((e) => e.type === 'anime')
        .reduce((sum, e) => sum + e.progress, 0),
      chapters_read: entries
        .filter((e) => e.type !== 'anime')
        .reduce((sum, e) => sum + e.progress, 0),
      average_score: Math.round(avgScore * 10) / 10,
      top_genres,
      completed_count: completed.length,
    };
  },

  getEntriesByType: (type) => get().entries.filter((e) => e.type === type),

  getEntriesByStatus: (status) => get().entries.filter((e) => e.status === status),

  getInProgress: () =>
    get().entries.filter((e) => e.status === 'watching' || e.status === 'reading'),
}));
