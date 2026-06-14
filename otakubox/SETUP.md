# OtakuBox — Guide de démarrage

Application mobile de suivi de contenu japonais/coréen (Anime, Manga, Webtoon, Light Novel) pour la communauté francophone.

## Stack

- **Expo SDK 51** (React Native)
- **Supabase** — auth + base de données temps réel
- **API Jikan** (MyAnimeList) — données anime & manga, gratuite, sans clé
- **API MangaDex** — webtoons & light novels, gratuite, sans clé
- **AdMob** — monétisation freemium
- **Expo Notifications** — rappels de sorties
- **Zustand** — gestion d'état locale

## Installation rapide

```bash
cd otakubox
npm install
```

## Configuration Supabase

1. Crée un projet sur [supabase.com](https://supabase.com)
2. Copie l'URL et la clé anon depuis **Settings → API**
3. Exécute `supabase/schema.sql` dans l'éditeur SQL Supabase
4. Copie `.env.example` en `.env` et remplis les valeurs :

```bash
cp .env.example .env
```

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## Configuration AdMob (optionnel)

1. Crée des unités publicitaires sur [AdMob](https://admob.google.com)
2. Ajoute les IDs dans `.env` et dans `app.json`

## Lancer l'application

```bash
# Démarrer le serveur Expo
npx expo start

# Ou directement sur un simulateur
npx expo run:ios
npx expo run:android
```

## Structure du projet

```
otakubox/
├── App.tsx                    # Point d'entrée
├── src/
│   ├── constants/colors.ts    # Palette de couleurs
│   ├── types/index.ts         # Types TypeScript
│   ├── services/
│   │   ├── supabase.ts        # Client Supabase + helpers
│   │   ├── jikanApi.ts        # API anime/manga (Jikan/MAL)
│   │   └── mangadexApi.ts     # API webtoon/LN (MangaDex)
│   ├── store/libraryStore.ts  # État global (Zustand)
│   ├── hooks/useAuth.ts       # Hook authentification
│   ├── components/            # Composants réutilisables
│   ├── navigation/            # Navigation (tabs + stack)
│   └── screens/               # Tous les écrans
│       ├── auth/              # Login & Register
│       ├── HomeScreen.tsx
│       ├── SearchScreen.tsx
│       ├── LibraryScreen.tsx
│       ├── DetailScreen.tsx
│       ├── StatsScreen.tsx
│       └── ProfileScreen.tsx
└── supabase/schema.sql        # Schéma base de données
```

## Couleurs par type

| Type         | Couleur   | Hex       |
|--------------|-----------|-----------|
| Anime        | Orange    | `#f97316` |
| Manga        | Violet    | `#a855f7` |
| Webtoon      | Cyan      | `#06b6d4` |
| Light Novel  | Vert      | `#22c55e` |

## Déploiement (EAS Build)

```bash
npm install -g eas-cli
eas build:configure
eas build --platform android
eas build --platform ios
```

## Freemium

- **Gratuit** : accès complet + publicités AdMob
- **Premium (2,99€/mois)** : sans pub, notifications prioritaires, thèmes exclusifs

Le flag `is_premium` sur la table `profiles` contrôle l'accès Premium.
Intègre [RevenueCat](https://revenuecat.com) ou Stripe pour la gestion des abonnements.
