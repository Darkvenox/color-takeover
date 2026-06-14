import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Content, LibraryEntry } from '../types';
import { COLORS, TYPE_COLORS } from '../constants/colors';
import TypeBadge from './TypeBadge';
import ProgressBar from './ProgressBar';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface Props {
  item: Content | LibraryEntry;
  onPress: () => void;
  showProgress?: boolean;
}

export default function ContentCard({ item, onPress, showProgress }: Props) {
  const typeColor = TYPE_COLORS[item.type] ?? COLORS.primary;
  const isLibraryEntry = 'progress' in item;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.cover_image }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
        <LinearGradient
          colors={['transparent', 'rgba(10,10,15,0.95)']}
          style={styles.gradient}
        />
        <View style={styles.badgeContainer}>
          <TypeBadge type={item.type} small />
        </View>
        {isLibraryEntry && (item as LibraryEntry).score != null && (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>⭐ {(item as LibraryEntry).score}</Text>
          </View>
        )}
      </View>
      <View style={[styles.footer, { borderTopColor: `${typeColor}44` }]}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        {showProgress && isLibraryEntry && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {(item as LibraryEntry).progress}
              {(item as LibraryEntry).total ? ` / ${(item as LibraryEntry).total}` : ''}
            </Text>
            <ProgressBar
              progress={(item as LibraryEntry).progress}
              total={(item as LibraryEntry).total}
              color={typeColor}
              height={3}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.4,
    backgroundColor: COLORS.surface2,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  scoreContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(10,10,15,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  scoreText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '600',
  },
  footer: {
    padding: 10,
    borderTopWidth: 1,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  progressContainer: {
    marginTop: 6,
    gap: 4,
  },
  progressText: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
});
