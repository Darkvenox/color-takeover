import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, TYPE_COLORS } from '../constants/colors';
import { Content, ContentType, RootStackParamList } from '../types';
import SearchBar from '../components/SearchBar';
import ContentCard from '../components/ContentCard';
import { searchAnime, searchManga } from '../services/jikanApi';
import { searchWebtoon, searchLightNovel } from '../services/mangadexApi';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const TYPES: { key: ContentType; label: string }[] = [
  { key: 'anime', label: 'Anime' },
  { key: 'manga', label: 'Manga' },
  { key: 'webtoon', label: 'Webtoon' },
  { key: 'light_novel', label: 'Light Novel' },
];

export default function SearchScreen() {
  const nav = useNavigation<Nav>();
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState<ContentType>('anime');
  const [results, setResults] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(
    async (q: string, type: ContentType) => {
      if (q.trim().length < 2) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        let data: Content[] = [];
        if (type === 'anime') data = await searchAnime(q);
        else if (type === 'manga') data = await searchManga(q);
        else if (type === 'webtoon') data = await searchWebtoon(q);
        else if (type === 'light_novel') data = await searchLightNovel(q);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleQueryChange = (text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(text, activeType), 600);
  };

  const handleTypeChange = (type: ContentType) => {
    setActiveType(type);
    if (query.trim().length >= 2) search(query, type);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Recherche</Text>
        <SearchBar
          value={query}
          onChangeText={handleQueryChange}
          placeholder="Titre d'anime, manga, webtoon..."
          onClear={() => { setQuery(''); setResults([]); }}
        />
        <View style={styles.typeRow}>
          {TYPES.map((t) => {
            const color = TYPE_COLORS[t.key];
            const active = activeType === t.key;
            return (
              <TouchableOpacity
                key={t.key}
                style={[
                  styles.typeBtn,
                  active && { backgroundColor: `${color}22`, borderColor: color },
                ]}
                onPress={() => handleTypeChange(t.key)}
              >
                <Text style={[styles.typeBtnText, active && { color }]}>{t.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {isLoading && (
        <ActivityIndicator
          color={TYPE_COLORS[activeType]}
          style={styles.loader}
          size="large"
        />
      )}

      {!isLoading && results.length === 0 && query.length >= 2 && (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>Aucun résultat pour "{query}"</Text>
        </View>
      )}

      {!isLoading && results.length === 0 && query.length < 2 && (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>✨</Text>
          <Text style={styles.emptyText}>Tape au moins 2 caractères pour rechercher</Text>
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ContentCard
            item={item}
            onPress={() => nav.navigate('Detail', { content: item })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeBtnText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  loader: {
    marginTop: 60,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingBottom: 80,
  },
  emptyIcon: { fontSize: 48 },
  emptyText: { color: COLORS.textSecondary, fontSize: 15, textAlign: 'center', paddingHorizontal: 40 },
});
