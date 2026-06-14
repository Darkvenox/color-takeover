import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { useAuth } from '../hooks/useAuth';
import { signOut } from '../services/supabase';

export default function ProfileScreen() {
  const { user, profile } = useAuth();
  const [notifEnabled, setNotifEnabled] = useState(true);

  const handleSignOut = () => {
    Alert.alert('Déconnexion', 'Es-tu sûr de vouloir te déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnexion',
        style: 'destructive',
        onPress: () => signOut(),
      },
    ]);
  };

  const username = profile?.username ?? user?.email?.split('@')[0] ?? 'Otaku';
  const initial = username[0]?.toUpperCase() ?? 'O';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar & nom */}
        <LinearGradient
          colors={[COLORS.surface3, COLORS.background]}
          style={styles.heroSection}
        >
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.anime]}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{initial}</Text>
            </LinearGradient>
          </View>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {profile?.is_premium ? (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>✨ Membre Premium</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.upgradeBtn}>
              <LinearGradient
                colors={[COLORS.primary, '#8b5cf6']}
                style={styles.upgradeBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.upgradeBtnText}>Passer à Premium — 2,99€/mois</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </LinearGradient>

        {/* Premium avantages */}
        {!profile?.is_premium && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Avantages Premium ✨</Text>
            {[
              '✅ Sans publicité',
              '✅ Notifications de sorties',
              '✅ Statistiques avancées',
              '✅ Synchronisation multi-appareils',
              '✅ Thèmes exclusifs',
            ].map((benefit) => (
              <Text key={benefit} style={styles.benefit}>
                {benefit}
              </Text>
            ))}
          </View>
        )}

        {/* Paramètres */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Paramètres</Text>

          <SettingRow
            icon="🔔"
            label="Notifications de rappel"
            right={
              <Switch
                value={notifEnabled}
                onValueChange={setNotifEnabled}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={notifEnabled ? '#fff' : COLORS.textMuted}
              />
            }
          />
          <SettingRow icon="🌙" label="Thème sombre" right={<Text style={styles.settingValue}>Activé</Text>} />
          <SettingRow icon="🌍" label="Langue" right={<Text style={styles.settingValue}>Français</Text>} />
        </View>

        {/* Compte */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Compte</Text>
          <SettingRow icon="📧" label="Email" right={<Text style={styles.settingValue} numberOfLines={1}>{user?.email}</Text>} />
          <SettingRow icon="🔒" label="Changer le mot de passe" right={<Text style={styles.arrow}>→</Text>} />
          <SettingRow icon="🗑️" label="Supprimer mon compte" right={<Text style={[styles.arrow, { color: COLORS.error }]}>→</Text>} />
        </View>

        {/* Infos app */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>À propos</Text>
          <SettingRow icon="📱" label="Version" right={<Text style={styles.settingValue}>1.0.0</Text>} />
          <SettingRow icon="📄" label="Politique de confidentialité" right={<Text style={styles.arrow}>→</Text>} />
          <SettingRow icon="📋" label="Conditions d'utilisation" right={<Text style={styles.arrow}>→</Text>} />
        </View>

        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Se déconnecter</Text>
        </TouchableOpacity>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({
  icon,
  label,
  right,
}: {
  icon: string;
  label: string;
  right: React.ReactNode;
}) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingIcon}>{icon}</Text>
      <Text style={styles.settingLabel}>{label}</Text>
      <View style={styles.settingRight}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  heroSection: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 28,
    paddingHorizontal: 20,
    gap: 8,
  },
  avatarContainer: { marginBottom: 4 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 36, fontWeight: '800' },
  username: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '700' },
  email: { color: COLORS.textSecondary, fontSize: 14 },
  premiumBadge: {
    backgroundColor: `${COLORS.gold}22`,
    borderWidth: 1,
    borderColor: `${COLORS.gold}55`,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  premiumText: { color: COLORS.gold, fontWeight: '600', fontSize: 13 },
  upgradeBtn: { marginTop: 8, borderRadius: 12, overflow: 'hidden', width: '100%' },
  upgradeBtnGradient: { paddingVertical: 14, alignItems: 'center' },
  upgradeBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  benefit: { color: COLORS.textSecondary, fontSize: 14, paddingVertical: 3 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  settingIcon: { fontSize: 18, width: 26 },
  settingLabel: { flex: 1, color: COLORS.textPrimary, fontSize: 14 },
  settingRight: { alignItems: 'flex-end' },
  settingValue: { color: COLORS.textSecondary, fontSize: 13 },
  arrow: { color: COLORS.textMuted, fontSize: 16 },
  signOutBtn: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  signOutText: { color: COLORS.error, fontWeight: '600', fontSize: 15 },
  bottomPad: { height: 100 },
});
