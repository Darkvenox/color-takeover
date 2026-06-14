import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, TYPE_COLORS, STATUS_COLORS } from '../constants/colors';
import { ContentType, ContentStatus, LibraryEntry, RootStackParamList } from '../types';
import { useLibraryStore } from '../store/libraryStore';
import ContentCard from '../components/ContentCard';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const TYPE_FILTERS: { key: ContentType | 'all'; label: string }[] = [
  { key: 'all', label: 'Tout' },
  { key: 'anime', label: 'Anime' },
  { key: 'manga', label: 'Manga' },
  { key: 'webtoon', label: 'Webtoon' },
  { key: 'light_novel', label: 'Light Novel' },
];

const STATUS_FILTERS: { key: ContentStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'watching', label: 'En cours' },
  { key: 'reading', label: 'En lecture' },
  { key: 'completed', label: 'Terminé' },
  { key: 'plan_to_watch', label: 'À voir' },
  { key: 'on_hold', label: 'En pause' },
  { key: 'dropped', label: 'Abandonné' },
];

export default function LibraryScreen() {
  const nav = useNavigation<Nav>();
  const { entries } = useLibraryStore();
  const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all');

  const filtered = entries.filter((e) => {
    const matchType = typeFilter === 'all' || e.type === typeFilter;
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchType && matchStatus;
  });

  const typeColor =
    typeFilter !== 'all' ? TYPE_COLORS[typeFilter] : COLORS.primary;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Ma Bibliothèque</Text>
        <Text style={styles.count}>{filtered.length} œuvres</Text>
      </View>

      {/* Type filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {TYPE_FILTERS.map((f) => {
          const active = typeFilter === f.key;
          const color = f.key !== 'all' ? TYPE_COLORS[f.key as ContentType] : COLORS.primary;
          return (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.filterBtn,
                active && { backgroundColor: `${color}22`, borderColor: color },
              ]}
              onPress={() => setTypeFilter(f.key as ContentType | 'all')}
            >
              <Text style={[styles.filterText, active && { color }]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Status filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {STATUS_FILTERS.map((f) => {
          const active = statusFilter === f.key;
          const color =
            f.key !== 'all' ? STATUS_COLORS[f.key as ContentStatus] : COLORS.textSecondary;
          return (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.statusBtn,
                active && { backgroundColor: `${color}22`, borderColor: `${color}88` },
              ]}
              onPress={() => setStatusFilter(f.key as ContentStatus | 'all')}
            >
              <Text style={[styles.statusText, active && { color }]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyTitle}>Bibliothèque vide</Text>
          <Text style={styles.emptySubtitle}>
            Recherche des œuvres et ajoute-les à ta bibliothèque
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ContentCard
              item={item}
              onPress={() => nav.navigate('Detail', { content: item })}
              showProgress
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 12,
  },
  title: { color: COLORS.textPrimary, fontSize: 28, fontWeight: '800' },
  count: { color: COLORS.textSecondary, fontSize: 14 },
  filterRow: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 10,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '500' },
  statusBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusText: { color: COLORS.textMuted, fontSize: 12, fontWeight: '500' },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  row: { justifyContent: 'space-between' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingBottom: 80,
  },
  emptyIcon: { fontSize: 56 },
  emptyTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
  emptySubtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
