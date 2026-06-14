import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

interface Props {
  progress: number;
  total?: number;
  color?: string;
  height?: number;
}

export default function ProgressBar({ progress, total, color = COLORS.primary, height = 4 }: Props) {
  const pct = total && total > 0 ? Math.min((progress / total) * 100, 100) : 0;

  return (
    <View style={[styles.track, { height }]}>
      <View
        style={[
          styles.fill,
          { width: total ? `${pct}%` : 0, backgroundColor: color, height },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: COLORS.border,
    borderRadius: 99,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 99,
  },
});
