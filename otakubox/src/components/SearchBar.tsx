import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export default function SearchBar({ value, onChangeText, placeholder, onClear }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? 'Rechercher...'}
        placeholderTextColor={COLORS.textMuted}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && onClear && (
        <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
          <Text style={styles.clearIcon}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  icon: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
    padding: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearIcon: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
});
