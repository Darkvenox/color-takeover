import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ContentType } from '../types';
import { TYPE_COLORS } from '../constants/colors';

const TYPE_LABELS: Record<ContentType, string> = {
  anime: 'Anime',
  manga: 'Manga',
  webtoon: 'Webtoon',
  light_novel: 'Light Novel',
};

interface Props {
  type: ContentType;
  small?: boolean;
}

export default function TypeBadge({ type, small }: Props) {
  const color = TYPE_COLORS[type] ?? '#6366f1';
  return (
    <View style={[styles.badge, { backgroundColor: `${color}22`, borderColor: `${color}66` }, small && styles.small]}>
      <Text style={[styles.text, { color }, small && styles.smallText]}>
        {TYPE_LABELS[type]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  small: {
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  smallText: {
    fontSize: 10,
  },
});
