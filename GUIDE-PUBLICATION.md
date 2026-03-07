# 🚀 Guide : Publier Color Takeover sur Google Play

## Ce que tu as dans ce dossier
- `index.html` → Page principale de la PWA
- `color-takeover.jsx` → Le jeu complet
- `manifest.json` → Configuration PWA
- `sw.js` → Service worker (mode hors ligne)
- `icons/` → Icônes dans toutes les tailles
- `privacy-policy.html` → Politique de confidentialité obligatoire

---

## ÉTAPE 1 — Héberger le jeu en ligne (GRATUIT)

Tu dois mettre les fichiers en ligne sur un vrai domaine HTTPS.

### Option A : GitHub Pages (recommandé, gratuit)
1. Crée un compte sur https://github.com
2. Crée un nouveau dépôt nommé `color-takeover`
3. Upload tous les fichiers de ce dossier
4. Va dans Settings → Pages → Source : `main` branch
5. Ton jeu sera sur `https://[ton-pseudo].github.io/color-takeover`

### Option B : Netlify (encore plus simple)
1. Va sur https://netlify.com
2. Drag & drop le dossier entier
3. Tu as une URL en quelques secondes

---

## ÉTAPE 2 — Créer l'APK avec Bubblewrap (outil officiel Google)

### Pré-requis (sur ton PC)
```bash
# Installe Node.js depuis https://nodejs.org
# Puis installe Bubblewrap :
npm install -g @bubblewrap/cli

# Vérifie l'installation :
bubblewrap --version
```

### Générer l'APK
```bash
# Crée un nouveau dossier pour le projet Android
mkdir color-takeover-android
cd color-takeover-android

# Initialise avec l'URL de ton site hébergé
bubblewrap init --manifest https://[ton-pseudo].github.io/color-takeover/manifest.json

# Réponds aux questions :
# - Package name : com.colortakeover.game
# - App name : Color Takeover
# - Signing key : laisse les valeurs par défaut pour l'instant

# Build l'APK
bubblewrap build
```

Ça génère un fichier `app-release-bundle.aab` → c'est ce que tu uploades sur le Play Store.

---

## ÉTAPE 3 — Créer le compte développeur

1. Va sur https://play.google.com/console
2. Clique "Commencer"
3. Paye **25$ une seule fois** (Visa/Mastercard)
4. Vérifie ton identité avec une pièce d'identité
5. Attends 24-48h

---

## ÉTAPE 4 — Créer la fiche sur Google Play Console

1. Clique "Créer une application"
2. Remplis :
   - **Nom** : Color Takeover
   - **Description courte** : Conquiers la grille en changeant de couleur. Affronte le bot ou un ami en 1v1 !
   - **Description longue** : (voir ci-dessous)
   - **Captures d'écran** : prends 2-8 screenshots sur ton téléphone
   - **Icône** : utilise `icons/icon-512.png`
   - **Politique de confidentialité** : héberge `privacy-policy.html` et mets le lien

### Description longue (copie-colle)
```
Color Takeover est un jeu de stratégie de conquête de territoire.

🎮 COMMENT JOUER
Chaque tour, choisis une couleur pour étendre ton territoire.
Conquiers plus de 50% de la grille pour gagner !

🗺️ MODE CAMPAGNE
10 niveaux progressifs du plus facile au plus extrême.
Gagne des étoiles et débloque des skins exclusifs.

⚔️ 1v1 LOCAL
Affronte un ami sur le même écran.
Passe le téléphone entre chaque tour !

🤖 MODE LIBRE
Joue contre le bot avec la difficulté et la grille de ton choix.

🏆 TROPHÉES & SKINS
12 trophées à débloquer. Obtiens-les tous pour révéler le skin secret PIXEL !

✅ Gratuit · Sans pub · Sans achat intégré · Hors ligne
```

---

## ÉTAPE 5 — Soumettre

1. Complète toutes les sections dans la console (contenu, public cible, etc.)
2. Upload le fichier `.aab`
3. Soumets pour révision
4. Attends **3 à 7 jours** la première fois

---

## ⚠️ Pense à changer l'email dans privacy-policy.html !
Remplace `[votre-email@example.com]` par ton vrai email.
