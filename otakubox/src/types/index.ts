export type ContentType = 'anime' | 'manga' | 'webtoon' | 'light_novel';

export type ContentStatus =
  | 'watching'
  | 'reading'
  | 'completed'
  | 'plan_to_watch'
  | 'on_hold'
  | 'dropped';

export interface Content {
  id: string;
  mal_id?: number;
  mangadex_id?: string;
  type: ContentType;
  title: string;
  title_fr?: string;
  cover_image: string;
  synopsis?: string;
  genres?: string[];
  score?: number;
  total_episodes?: number;
  total_chapters?: number;
  status_publication?: string;
  year?: number;
  studio?: string;
  author?: string;
}

export interface LibraryEntry {
  id: string;
  user_id: string;
  content_id?: string;
  mal_id?: number;
  mangadex_id?: string;
  type: ContentType;
  title: string;
  cover_image: string;
  status: ContentStatus;
  progress: number;
  total?: number;
  score?: number;
  notes?: string;
  genres?: string[];
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  total_anime: number;
  total_manga: number;
  total_webtoon: number;
  total_light_novel: number;
  episodes_watched: number;
  chapters_read: number;
  average_score: number;
  top_genres: { genre: string; count: number }[];
  completed_count: number;
}

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  is_premium: boolean;
  premium_until?: string;
  created_at: string;
}

export interface SearchResult extends Content {}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Detail: { content: Content | LibraryEntry };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Library: undefined;
  Stats: undefined;
  Profile: undefined;
};
