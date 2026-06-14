import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPE_COLORS, STATUS_COLORS } from '../constants/colors';
import { Content, LibraryEntry, ContentStatus, RootStackParamList } from '../types';
import { useLibraryStore } from '../store/libraryStore';
import { useAuth } from '../hooks/useAuth';
import TypeBadge from '../components/TypeBadge';
import ProgressBar from '../components/ProgressBar';

type Route = RouteProp<RootStackParamList, 'Detail'>;
const { width, height } = Dimensions.get('window');

const STATUS_OPTIONS: { key: ContentStatus; label: string; icon: string }[] = [
  { key: 'watching', label: 'En cours (Anime)', icon: '▶️' },
  { key: 'reading', label: 'En lecture', icon: '📖' },
  { key: 'completed', label: 'Terminé', icon: '✅' },
  { key: 'plan_to_watch', label: 'À voir / Lire', icon: '🔖' },
  { key: 'on_hold', label: 'En pause', icon: '⏸️' },
  { key: 'dropped', label: 'Abandonné', icon: '❌' },
];

export default function DetailScreen() {
  const nav = useNavigation();
  const { params } = useRoute<Route>();
  const { user } = useAuth();
  const { entries, addEntry, removeEntry, incrementProgress, updateEntry } = useLibraryStore();

  const content = params.content as Content | LibraryEntry;
  const isLibEntry = 'progress' in content;

  const existingEntry = entries.find(
    (e) =>
      e.mal_id === (content as Content).mal_id ||
      e.mangadex_id === (content as Content).mangadex_id
  );

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const typeColor = TYPE_COLORS[content.type] ?? COLORS.primary;

  const handleAdd = (status: ContentStatus) => {
    if (!user) return;
    addEntry({
      user_id: user.id,
      mal_id: (content as Content).mal_id,
      mangadex_id: (content as Content).mangadex_id,
      type: content.type,
      title: content.title,
      cover_image: content.cover_image,
      status,
      progress: 0,
      total: content.total_episodes ?? content.total_chapters,
      genres: content.genres,
    });
    setShowStatusModal(false);
  };

  const handleRemove = () => {
    if (!existingEntry) return;
    Alert.alert('Supprimer', 'Retirer de ta bibliothèque ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => { removeEntry(existingEntry.id); nav.goBack(); },
      },
    ]);
  };

  const handleScore = (score: number) => {
    if (!existingEntry) return;
    updateEntry(existingEntry.id, existingEntry.progress, score, existingEntry.status);
    setShowScoreModal(false);
  };

  const synopsis = (content as Content).synopsis ?? '';
  const total = (content as Content).total_episodes ?? (content as Content).total_chapters;
  const progress = existingEntry?.progress ?? 0;

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Cover */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: content.cover_image }}
            style={styles.cover}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', COLORS.background]}
            style={styles.coverGradient}
          />
          <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          {/* Title & Type */}
          <View style={styles.titleRow}>
            <TypeBadge type={content.type} />
          </View>
          <Text style={styles.title}>{content.title}</Text>
          {(content as Content).year && (
            <Text style={styles.meta}>{(content as Content).year}</Text>
          )}
          {((content as Content).studio || (content as Content).author) && (
            <Text style={styles.meta}>
              {(content as Content).studio ?? (content as Content).author}
            </Text>
          )}

          {/* Score & genres */}
          {(content as Content).score != null && (
            <View style={styles.scoreRow}>
              <Text style={styles.score}>⭐ {(content as Content).score?.toFixed(1)}</Text>
            </View>
          )}

          {(content.genres ?? []).length > 0 && (
            <View style={styles.genreRow}>
              {(content.genres ?? []).slice(0, 5).map((g) => (
                <View key={g} style={styles.genreTag}>
                  <Text style={styles.genreText}>{g}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Progress (si dans bibliothèque) */}
          {existingEntry && (
            <View style={[styles.progressBox, { borderColor: `${typeColor}44` }]}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>
                  Progression — {existingEntry.progress}{total ? ` / ${total}` : ''}
                </Text>
                <TouchableOpacity
                  style={[styles.plusBtn, { backgroundColor: typeColor }]}
                  onPress={() => incrementProgress(existingEntry.id)}
                >
                  <Text style={styles.plusText}>+1</Text>
                </TouchableOpacity>
              </View>
              <ProgressBar
                progress={existingEntry.progress}
                total={total}
                color={typeColor}
                height={6}
              />
              <View style={styles.statusScoreRow}>
                <TouchableOpacity
                  style={[styles.statusPill, { borderColor: STATUS_COLORS[existingEntry.status] ?? COLORS.border }]}
                  onPress={() => setShowStatusModal(true)}
                >
                  <Text style={[styles.statusPillText, { color: STATUS_COLORS[existingEntry.status] }]}>
                    {STATUS_OPTIONS.find((s) => s.key === existingEntry.status)?.label ?? existingEntry.status}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.scoreBtn}
                  onPress={() => setShowScoreModal(true)}
                >
                  <Text style={styles.scoreBtnText}>
                    {existingEntry.score ? `⭐ ${existingEntry.score}/10` : '⭐ Noter'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            {!existingEntry ? (
              <TouchableOpacity
                style={[styles.addBtn, { backgroundColor: typeColor }]}
                onPress={() => setShowStatusModal(true)}
              >
                <Text style={styles.addBtnText}>+ Ajouter à ma bibliothèque</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.removeBtn} onPress={handleRemove}>
                <Text style={styles.removeBtnText}>Retirer de la bibliothèque</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Synopsis */}
          {synopsis.length > 0 && (
            <View style={styles.synopsisBox}>
              <Text style={styles.synopsisTitle}>Synopsis</Text>
              <Text style={styles.synopsis}>{synopsis}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal statut */}
      <Modal visible={showStatusModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowStatusModal(false)}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Choisir un statut</Text>
            {STATUS_OPTIONS.map((s) => (
              <TouchableOpacity
                key={s.key}
                style={styles.modalOption}
                onPress={() => {
                  if (existingEntry) {
                    updateEntry(existingEntry.id, existingEntry.progress, existingEntry.score, s.key);
                    setShowStatusModal(false);
                  } else {
                    handleAdd(s.key);
                  }
                }}
              >
                <Text style={styles.modalOptionIcon}>{s.icon}</Text>
                <Text style={styles.modalOptionText}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal note */}
      <Modal visible={showScoreModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowScoreModal(false)}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Ta note</Text>
            <View style={styles.scoreGrid}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <TouchableOpacity
                  key={n}
                  style={[
                    styles.scoreOption,
                    existingEntry?.score === n && { backgroundColor: COLORS.gold },
                  ]}
                  onPress={() => handleScore(n)}
                >
                  <Text
                    style={[
                      styles.scoreOptionText,
                      existingEntry?.score === n && { color: COLORS.background },
                    ]}
                  >
                    {n}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  coverContainer: { position: 'relative' },
  cover: { width, height: height * 0.45, backgroundColor: COLORS.surface2 },
  coverGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: 20,
    backgroundColor: 'rgba(10,10,15,0.7)',
    borderRadius: 12,
    padding: 10,
  },
  backIcon: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
  body: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  titleRow: { marginBottom: 8 },
  title: { color: COLORS.textPrimary, fontSize: 24, fontWeight: '800', lineHeight: 30, marginBottom: 4 },
  meta: { color: COLORS.textSecondary, fontSize: 13, marginBottom: 2 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  score: { color: COLORS.gold, fontSize: 16, fontWeight: '700' },
  genreRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  genreTag: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  genreText: { color: COLORS.textSecondary, fontSize: 12 },
  progressBox: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    gap: 10,
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { color: COLORS.textSecondary, fontSize: 13 },
  plusBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8 },
  plusText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  statusScoreRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  statusPill: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: 'center',
  },
  statusPillText: { fontSize: 12, fontWeight: '600' },
  scoreBtn: {
    backgroundColor: `${COLORS.gold}22`,
    borderWidth: 1,
    borderColor: `${COLORS.gold}55`,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  scoreBtnText: { color: COLORS.gold, fontSize: 12, fontWeight: '600' },
  actions: { marginTop: 20 },
  addBtn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  removeBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  removeBtnText: { color: COLORS.error, fontWeight: '600', fontSize: 15 },
  synopsisBox: { marginTop: 24 },
  synopsisTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700', marginBottom: 8 },
  synopsis: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 22 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.surface2,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 14,
  },
  modalOptionIcon: { fontSize: 20 },
  modalOptionText: { color: COLORS.textPrimary, fontSize: 15 },
  scoreGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  scoreOption: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scoreOptionText: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700' },
});
