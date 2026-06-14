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
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { signUp } from '../../services/supabase';
import { AuthStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const nav = useNavigation<Nav>();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password || !confirm) {
      Alert.alert('Erreur', 'Remplis tous les champs.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit faire au moins 6 caractères.');
      return;
    }
    setIsLoading(true);
    const { error } = await signUp(email.trim(), password, username.trim());
    setIsLoading(false);
    if (error) {
      Alert.alert('Inscription échouée', error.message);
    } else {
      Alert.alert(
        'Vérifie ton email',
        'Un lien de confirmation t\'a été envoyé. Clique dessus pour activer ton compte.',
        [{ text: 'OK', onPress: () => nav.navigate('Login') }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => nav.goBack()} style={styles.backBtn}>
                <Text style={styles.backText}>← Retour</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Créer un compte</Text>
              <Text style={styles.subtitle}>Rejoins la communauté OtakuBox</Text>
            </View>

            <View style={styles.form}>
              <Field label="Pseudo" value={username} onChange={setUsername} placeholder="TonPseudo" />
              <Field label="Email" value={email} onChange={setEmail} placeholder="ton@email.com" keyboard="email-address" />
              <Field label="Mot de passe" value={password} onChange={setPassword} placeholder="••••••••" secure />
              <Field label="Confirmer le mot de passe" value={confirm} onChange={setConfirm} placeholder="••••••••" secure />

              <TouchableOpacity
                style={styles.registerBtn}
                onPress={handleRegister}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={[COLORS.anime, COLORS.primary]}
                  style={styles.registerBtnGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.registerBtnText}>Créer mon compte</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.terms}>
                En t'inscrivant tu acceptes nos{' '}
                <Text style={{ color: COLORS.primary }}>conditions d'utilisation</Text> et notre{' '}
                <Text style={{ color: COLORS.primary }}>politique de confidentialité</Text>.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  secure,
  keyboard,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  secure?: boolean;
  keyboard?: 'email-address' | 'default';
}) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        secureTextEntry={secure}
        keyboardType={keyboard ?? 'default'}
        autoCapitalize={keyboard === 'email-address' ? 'none' : 'words'}
        autoComplete={keyboard === 'email-address' ? 'email' : 'off'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  kav: { flex: 1 },
  scroll: { flexGrow: 1 },
  content: { flex: 1, paddingHorizontal: 28, paddingTop: 20, paddingBottom: 40 },
  header: { marginBottom: 32, gap: 6 },
  backBtn: { marginBottom: 12 },
  backText: { color: COLORS.primary, fontSize: 15 },
  title: { color: COLORS.textPrimary, fontSize: 28, fontWeight: '800' },
  subtitle: { color: COLORS.textSecondary, fontSize: 14 },
  form: { gap: 14 },
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
  registerBtn: { borderRadius: 12, overflow: 'hidden', marginTop: 8 },
  registerBtnGradient: { paddingVertical: 15, alignItems: 'center' },
  registerBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  terms: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
