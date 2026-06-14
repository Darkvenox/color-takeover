import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPE_COLORS } from '../constants/colors';
import { useLibraryStore } from '../store/libraryStore';
import { ContentType } from '../types';

const { width } = Dimensions.get('window');

const TYPE_CONFIG: { key: ContentType; label: string; statKey: 'total_anime' | 'total_manga' | 'total_webtoon' | 'total_light_novel'; icon: string }[] = [
  { key: 'anime', label: 'Anime', statKey: 'total_anime', icon: '🎬' },
  { key: 'manga', label: 'Manga', statKey: 'total_manga', icon: '📕' },
  { key: 'webtoon', label: 'Webtoon', statKey: 'total_webtoon', icon: '📱' },
  { key: 'light_novel', label: 'Light Novel', statKey: 'total_light_novel', icon: '📖' },
];

export default function StatsScreen() {
  const { getStats, entries } = useLibraryStore();
  const stats = getStats();

  const totalAll =
    stats.total_anime + stats.total_manga + stats.total_webtoon + stats.total_light_novel;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Mes Statistiques</Text>

        {/* Héros */}
        <LinearGradient
          colors={[COLORS.surface3, COLORS.surface2]}
          style={styles.heroCard}
        >
          <View style={styles.heroRow}>
            <HeroStat
              value={stats.episodes_watched}
              label="Épisodes vus"
              color={COLORS.anime}
            />
            <View style={styles.heroDivider} />
            <HeroStat
              value={stats.chapters_read}
              label="Chapitres lus"
              color={COLORS.manga}
            />
            <View style={styles.heroDivider} />
            <HeroStat
              value={stats.average_score > 0 ? stats.average_score.toFixed(1) : '—'}
              label="Score moyen"
              color={COLORS.gold}
            />
          </View>
          <View style={[styles.heroDivider, { width: '90%', height: 1, marginVertical: 16 }]} />
          <View style={styles.heroRow}>
            <HeroStat value={totalAll} label="Total œuvres" color={COLORS.primary} />
            <View style={styles.heroDivider} />
            <HeroStat value={stats.completed_count} label="Terminées" color={COLORS.success} />
            <View style={styles.heroDivider} />
            <HeroStat
              value={totalAll > 0 ? `${Math.round((stats.completed_count / totalAll) * 100)}%` : '0%'}
              label="Taux complétion"
              color={COLORS.primaryLight}
            />
          </View>
        </LinearGradient>

        {/* Répartition par type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Répartition par type</Text>
          {TYPE_CONFIG.map(({ key, label, statKey, icon }) => {
            const count = stats[statKey];
            const pct = totalAll > 0 ? (count / totalAll) * 100 : 0;
            const color = TYPE_COLORS[key];
            return (
              <View key={key} style={styles.typeRow}>
                <Text style={styles.typeIcon}>{icon}</Text>
                <View style={styles.typeInfo}>
                  <View style={styles.typeLabelRow}>
                    <Text style={[styles.typeLabel, { color }]}>{label}</Text>
                    <Text style={styles.typeCount}>{count} œuvres</Text>
                  </View>
                  <View style={styles.typeBarTrack}>
                    <View
                      style={[
                        styles.typeBarFill,
                        { width: `${pct}%`, backgroundColor: color },
                      ]}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Top genres */}
        {stats.top_genres.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Genres</Text>
            {stats.top_genres.map(({ genre, count }, idx) => (
              <View key={genre} style={styles.genreRow}>
                <View
                  style={[
                    styles.genreRank,
                    idx === 0 && { backgroundColor: `${COLORS.gold}22` },
                  ]}
                >
                  <Text style={[styles.genreRankText, idx === 0 && { color: COLORS.gold }]}>
                    #{idx + 1}
                  </Text>
                </View>
                <Text style={styles.genreName}>{genre}</Text>
                <View style={styles.genreBar}>
                  <View
                    style={[
                      styles.genreBarFill,
                      {
                        width: `${(count / (stats.top_genres[0]?.count ?? 1)) * 100}%`,
                        backgroundColor: COLORS.primary,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.genreCount}>{count}</Text>
              </View>
            ))}
          </View>
        )}

        {entries.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyText}>
              Tes statistiques apparaîtront quand tu auras ajouté des œuvres à ta bibliothèque.
            </Text>
          </View>
        )}

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

function HeroStat({ value, label, color }: { value: number | string; label: string; color: string }) {
  return (
    <View style={styles.heroStat}>
      <Text style={[styles.heroValue, { color }]}>{value}</Text>
      <Text style={styles.heroLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  title: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 16,
  },
  heroCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  heroRow: { flexDirection: 'row', alignItems: 'center' },
  heroStat: { flex: 1, alignItems: 'center', gap: 4 },
  heroValue: { fontSize: 26, fontWeight: '800' },
  heroLabel: { color: COLORS.textSecondary, fontSize: 11, textAlign: 'center' },
  heroDivider: { width: 1, height: 40, backgroundColor: COLORS.border },
  section: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  typeIcon: { fontSize: 20, width: 28 },
  typeInfo: { flex: 1, gap: 6 },
  typeLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  typeLabel: { fontSize: 14, fontWeight: '600' },
  typeCount: { color: COLORS.textSecondary, fontSize: 13 },
  typeBarTrack: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 99,
    overflow: 'hidden',
  },
  typeBarFill: { height: 6, borderRadius: 99 },
  genreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  genreRank: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genreRankText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '700' },
  genreName: { color: COLORS.textPrimary, fontSize: 14, flex: 1 },
  genreBar: {
    width: 80,
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 99,
    overflow: 'hidden',
  },
  genreBarFill: { height: 6, borderRadius: 99 },
  genreCount: { color: COLORS.textSecondary, fontSize: 13, width: 24, textAlign: 'right' },
  empty: { alignItems: 'center', padding: 40, gap: 12 },
  emptyIcon: { fontSize: 52 },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
  },
  bottomPad: { height: 100 },
});
