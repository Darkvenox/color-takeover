import { Content, ContentType } from '../types';

const JIKAN_BASE = 'https://api.jikan.moe/v4';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url);
    if (res.status === 429) {
      await delay(1000 * (i + 1));
      continue;
    }
    return res;
  }
  throw new Error('Too many retries');
}

function mapAnime(item: Record<string, unknown>): Content {
  const images = item.images as Record<string, Record<string, string>>;
  const titles = item.titles as { type: string; title: string }[] | undefined;
  const genres = (item.genres as { name: string }[] | undefined) ?? [];

  return {
    id: `anime_${item.mal_id}`,
    mal_id: item.mal_id as number,
    type: 'anime',
    title: item.title as string,
    title_fr: titles?.find((t) => t.type === 'French')?.title,
    cover_image: images?.jpg?.large_image_url ?? images?.jpg?.image_url ?? '',
    synopsis: item.synopsis as string | undefined,
    genres: genres.map((g) => g.name),
    score: item.score as number | undefined,
    total_episodes: item.episodes as number | undefined,
    status_publication: item.status as string | undefined,
    year: item.year as number | undefined,
    studio: ((item.studios as { name: string }[] | undefined) ?? [])[0]?.name,
  };
}

function mapManga(item: Record<string, unknown>): Content {
  const images = item.images as Record<string, Record<string, string>>;
  const genres = (item.genres as { name: string }[] | undefined) ?? [];

  return {
    id: `manga_${item.mal_id}`,
    mal_id: item.mal_id as number,
    type: 'manga',
    title: item.title as string,
    cover_image: images?.jpg?.large_image_url ?? images?.jpg?.image_url ?? '',
    synopsis: item.synopsis as string | undefined,
    genres: genres.map((g) => g.name),
    score: item.score as number | undefined,
    total_chapters: item.chapters as number | undefined,
    status_publication: item.status as string | undefined,
    year: (item.published as { prop?: { from?: { year?: number } } })?.prop?.from?.year,
    author: ((item.authors as { name: string }[] | undefined) ?? [])[0]?.name,
  };
}

export const searchAnime = async (query: string): Promise<Content[]> => {
  const res = await fetchWithRetry(
    `${JIKAN_BASE}/anime?q=${encodeURIComponent(query)}&limit=20&sfw=true`
  );
  const json = await res.json();
  return (json.data ?? []).map(mapAnime);
};

export const searchManga = async (query: string): Promise<Content[]> => {
  const res = await fetchWithRetry(
    `${JIKAN_BASE}/manga?q=${encodeURIComponent(query)}&limit=20&sfw=true`
  );
  const json = await res.json();
  return (json.data ?? []).map(mapManga);
};

export const getTopAnime = async (): Promise<Content[]> => {
  const res = await fetchWithRetry(`${JIKAN_BASE}/top/anime?limit=10`);
  const json = await res.json();
  return (json.data ?? []).map(mapAnime);
};

export const getTopManga = async (): Promise<Content[]> => {
  const res = await fetchWithRetry(`${JIKAN_BASE}/top/manga?limit=10`);
  const json = await res.json();
  return (json.data ?? []).map(mapManga);
};

export const getSeasonalAnime = async (): Promise<Content[]> => {
  const res = await fetchWithRetry(`${JIKAN_BASE}/seasons/now?limit=10`);
  const json = await res.json();
  return (json.data ?? []).map(mapAnime);
};

export const getAnimeById = async (malId: number): Promise<Content | null> => {
  const res = await fetchWithRetry(`${JIKAN_BASE}/anime/${malId}`);
  const json = await res.json();
  return json.data ? mapAnime(json.data) : null;
};

export const getMangaById = async (malId: number): Promise<Content | null> => {
  const res = await fetchWithRetry(`${JIKAN_BASE}/manga/${malId}`);
  const json = await res.json();
  return json.data ? mapManga(json.data) : null;
};

export const searchByType = async (
  query: string,
  type: ContentType
): Promise<Content[]> => {
  if (type === 'anime') return searchAnime(query);
  if (type === 'manga') return searchManga(query);
  return [];
};
