import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { useLibraryStore } from '../store/libraryStore';
import { useAuth } from '../hooks/useAuth';
import { Content, RootStackParamList } from '../types';
import { getSeasonalAnime, getTopManga } from '../services/jikanApi';
import ContentCard from '../components/ContentCard';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function HomeScreen() {
  const nav = useNavigation<Nav>();
  const { user, profile } = useAuth();
  const { entries, fetchEntries, getStats, getInProgress } = useLibraryStore();
  const [seasonal, setSeasonal] = useState<Content[]>([]);
  const [topManga, setTopManga] = useState<Content[]>([]);
  const [loadingTrends, setLoadingTrends] = useState(true);

  useEffect(() => {
    if (user) fetchEntries(user.id);
  }, [user]);

  useEffect(() => {
    Promise.all([getSeasonalAnime(), getTopManga()])
      .then(([s, m]) => {
        setSeasonal(s.slice(0, 6));
        setTopManga(m.slice(0, 6));
      })
      .finally(() => setLoadingTrends(false));
  }, []);

  const stats = getStats();
  const inProgress = getInProgress().slice(0, 6);
  const username = profile?.username ?? user?.email?.split('@')[0] ?? 'Otaku';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[COLORS.surface3, COLORS.background]}
          style={styles.header}
        >
          <View>
            <Text style={styles.greeting}>Bienvenue,</Text>
            <Text style={styles.username}>{username} 👋</Text>
          </View>
          <View style={styles.premiumBadge}>
            {profile?.is_premium ? (
              <Text style={styles.premiumText}>✨ Premium</Text>
            ) : (
              <TouchableOpacity style={styles.upgradeBadge}>
                <Text style={styles.upgradeText}>Passer Premium</Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>

        {/* Stats rapides */}
        <View style={styles.statsRow}>
          <StatChip label="Épisodes" value={stats.episodes_watched} color={COLORS.anime} />
          <StatChip label="Chapitres" value={stats.chapters_read} color={COLORS.manga} />
          <StatChip label="Score moy." value={stats.average_score > 0 ? stats.average_score.toFixed(1) : '—'} color={COLORS.primary} />
          <StatChip label="Terminés" value={stats.completed_count} color={COLORS.success} />
        </View>

        {/* En cours */}
        {inProgress.length > 0 && (
          <Section title="En cours" onMore={() => {}}>
            <FlatList
              horizontal
              data={inProgress}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <View style={styles.horizontalCard}>
                  <ContentCard
                    item={item}
                    onPress={() => nav.navigate('Detail', { content: item })}
                    showProgress
                  />
                </View>
              )}
            />
          </Section>
        )}

        {/* Tendances Anime */}
        <Section title="Anime de la saison" onMore={() => {}}>
          {loadingTrends ? (
            <ActivityIndicator color={COLORS.anime} style={styles.loader} />
          ) : (
            <FlatList
              horizontal
              data={seasonal}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <View style={styles.horizontalCard}>
                  <ContentCard
                    item={item}
                    onPress={() => nav.navigate('Detail', { content: item })}
                  />
                </View>
              )}
            />
          )}
        </Section>

        {/* Top Manga */}
        <Section title="Top Manga" onMore={() => {}}>
          {loadingTrends ? (
            <ActivityIndicator color={COLORS.manga} style={styles.loader} />
          ) : (
            <FlatList
              horizontal
              data={topManga}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <View style={styles.horizontalCard}>
                  <ContentCard
                    item={item}
                    onPress={() => nav.navigate('Detail', { content: item })}
                  />
                </View>
              )}
            />
          )}
        </Section>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatChip({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <View style={[styles.chip, { borderColor: `${color}44` }]}>
      <Text style={[styles.chipValue, { color }]}>{value}</Text>
      <Text style={styles.chipLabel}>{label}</Text>
    </View>
  );
}

function Section({
  title,
  children,
  onMore,
}: {
  title: string;
  children: React.ReactNode;
  onMore?: () => void;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {onMore && (
          <TouchableOpacity onPress={onMore}>
            <Text style={styles.seeAll}>Voir tout →</Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  greeting: { color: COLORS.textSecondary, fontSize: 14 },
  username: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '700', marginTop: 2 },
  premiumBadge: {},
  premiumText: { color: COLORS.gold, fontSize: 13, fontWeight: '600' },
  upgradeBadge: {
    backgroundColor: `${COLORS.primary}22`,
    borderWidth: 1,
    borderColor: `${COLORS.primary}66`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  upgradeText: { color: COLORS.primaryLight, fontSize: 12, fontWeight: '600' },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  chipValue: { fontSize: 16, fontWeight: '700' },
  chipLabel: { color: COLORS.textSecondary, fontSize: 10, marginTop: 2 },
  section: { marginTop: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: { color: COLORS.textPrimary, fontSize: 17, fontWeight: '700' },
  seeAll: { color: COLORS.primary, fontSize: 13 },
  horizontalList: { paddingHorizontal: 16, gap: 10 },
  horizontalCard: { width: 130 },
  loader: { marginVertical: 40 },
  bottomPad: { height: 100 },
});
