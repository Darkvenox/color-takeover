import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { signIn } from '../../services/supabase';
import { AuthStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const nav = useNavigation<Nav>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Erreur', 'Remplis tous les champs.');
      return;
    }
    setIsLoading(true);
    const { error } = await signIn(email.trim(), password);
    setIsLoading(false);
    if (error) Alert.alert('Connexion échouée', error.message);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoArea}>
            <LinearGradient
              colors={[COLORS.anime, COLORS.primary]}
              style={styles.logoCircle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.logoText}>O</Text>
            </LinearGradient>
            <Text style={styles.appName}>OtakuBox</Text>
            <Text style={styles.tagline}>Ton univers japonais & coréen</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>Connexion</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="ton@email.com"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mot de passe</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LinearGradient
                colors={[COLORS.anime, COLORS.primary]}
                style={styles.loginBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginBtnText}>Se connecter</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => nav.navigate('Register')}
            >
              <Text style={styles.registerLinkText}>
                Pas encore de compte ?{' '}
                <Text style={{ color: COLORS.anime, fontWeight: '700' }}>S'inscrire</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  kav: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  logoArea: { alignItems: 'center', marginBottom: 40, gap: 8 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  logoText: { color: '#fff', fontSize: 40, fontWeight: '900' },
  appName: { color: COLORS.textPrimary, fontSize: 32, fontWeight: '900' },
  tagline: { color: COLORS.textSecondary, fontSize: 14 },
  form: { gap: 16 },
  formTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  inputContainer: { gap: 6 },
  inputLabel: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '500' },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: COLORS.textPrimary,
    fontSize: 15,
  },
  loginBtn: { borderRadius: 12, overflow: 'hidden', marginTop: 8 },
  loginBtnGradient: { paddingVertical: 15, alignItems: 'center' },
  loginBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  registerLink: { alignItems: 'center', paddingVertical: 8 },
  registerLinkText: { color: COLORS.textSecondary, fontSize: 14 },
});
