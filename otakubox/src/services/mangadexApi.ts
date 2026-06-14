import { Content } from '../types';

const MANGADEX_BASE = 'https://api.mangadex.org';
const COVER_BASE = 'https://uploads.mangadex.org/covers';

interface MangaDexManga {
  id: string;
  attributes: {
    title: Record<string, string>;
    description: Record<string, string>;
    status: string;
    year?: number;
    tags: { attributes: { name: Record<string, string> } }[];
    lastChapter?: string;
  };
  relationships: { type: string; id: string; attributes?: { fileName?: string } }[];
}

function mapMangaDex(item: MangaDexManga): Content {
  const title =
    item.attributes.title['fr'] ??
    item.attributes.title['en'] ??
    Object.values(item.attributes.title)[0] ??
    'Titre inconnu';

  const coverRel = item.relationships.find((r) => r.type === 'cover_art');
  const coverFile = coverRel?.attributes?.fileName;
  const cover = coverFile
    ? `${COVER_BASE}/${item.id}/${coverFile}.256.jpg`
    : 'https://via.placeholder.com/256x360/12121a/6366f1?text=No+Cover';

  const genres = item.attributes.tags
    .filter((t) => t.attributes.name['en'])
    .map((t) => t.attributes.name['en'] ?? t.attributes.name['fr'] ?? '');

  return {
    id: `webtoon_${item.id}`,
    mangadex_id: item.id,
    type: 'webtoon',
    title,
    title_fr: item.attributes.title['fr'],
    cover_image: cover,
    synopsis: item.attributes.description['fr'] ?? item.attributes.description['en'],
    genres,
    total_chapters: item.attributes.lastChapter
      ? parseInt(item.attributes.lastChapter, 10) || undefined
      : undefined,
    status_publication: item.attributes.status,
    year: item.attributes.year,
  };
}

export const searchWebtoon = async (query: string): Promise<Content[]> => {
  const params = new URLSearchParams({
    title: query,
    limit: '20',
    'includes[]': 'cover_art',
    'contentRating[]': 'safe',
    'contentRating[]': 'suggestive',
  });

  const res = await fetch(`${MANGADEX_BASE}/manga?${params}`);
  const json = await res.json();
  return (json.data ?? []).map(mapMangaDex);
};

export const searchLightNovel = async (query: string): Promise<Content[]> => {
  const params = new URLSearchParams({
    title: query,
    limit: '20',
    'includes[]': 'cover_art',
    'contentRating[]': 'safe',
    'originalLanguage[]': 'ja',
  });

  const res = await fetch(`${MANGADEX_BASE}/manga?${params}`);
  const json = await res.json();
  return (json.data ?? []).map((item: MangaDexManga) => ({
    ...mapMangaDex(item),
    id: `lightnovel_${item.id}`,
    type: 'light_novel' as const,
  }));
};

export const getPopularWebtoons = async (): Promise<Content[]> => {
  const params = new URLSearchParams({
    limit: '10',
    'includes[]': 'cover_art',
    order: 'rating',
    'contentRating[]': 'safe',
  });

  const res = await fetch(`${MANGADEX_BASE}/manga?${params}`);
  const json = await res.json();
  return (json.data ?? []).map(mapMangaDex);
};
