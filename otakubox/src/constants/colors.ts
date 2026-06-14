export const COLORS = {
  background: '#0a0a0f',
  surface: '#12121a',
  surface2: '#1a1a2e',
  surface3: '#16213e',
  border: '#1e1e2e',

  anime: '#f97316',
  manga: '#a855f7',
  webtoon: '#06b6d4',
  lightNovel: '#22c55e',

  primary: '#6366f1',
  primaryLight: '#818cf8',

  white: '#ffffff',
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#475569',

  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',

  gold: '#fbbf24',
  silver: '#94a3b8',
} as const;

export const TYPE_COLORS: Record<string, string> = {
  anime: COLORS.anime,
  manga: COLORS.manga,
  webtoon: COLORS.webtoon,
  light_novel: COLORS.lightNovel,
};

export const STATUS_COLORS: Record<string, string> = {
  watching: COLORS.primary,
  reading: COLORS.primary,
  completed: COLORS.success,
  plan_to_watch: COLORS.textSecondary,
  on_hold: COLORS.warning,
  dropped: COLORS.error,
};
