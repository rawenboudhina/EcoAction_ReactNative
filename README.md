# 🌿 EcoAction — Plateforme de Bénévolat Environnemental

> Application mobile React Native permettant aux citoyens de découvrir, rejoindre et gérer des missions de bénévolat écologique (nettoyage de plages, plantation d'arbres, ateliers zéro déchet, recyclage, éducation environnementale).

---

## 📸 Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| 🔐 **Authentification** | Inscription / Connexion avec persistance de session (SecureStore) |
| 🗺️ **Explorer** | Parcourir les missions disponibles avec recherche et filtres par catégorie |
| 📋 **Détail mission** | Page détaillée avec image, description, lieu, date, places disponibles |
| ✅ **Participer** | Rejoindre une mission avec **Optimistic UI** (mise à jour instantanée) |
| ❌ **Annuler** | Annuler sa participation avec rollback optimiste en cas d'erreur |
| 📅 **Mes Missions** | Visualiser toutes ses participations confirmées |
| 👤 **Profil** | Statistiques personnelles (missions, heures, arbres plantés) et déconnexion |

---

## 🛠️ Stack Technique

| Technologie | Rôle |
|---|---|
| [Expo SDK 54](https://expo.dev/) | Framework React Native |
| [Expo Router](https://docs.expo.dev/router/introduction/) | Navigation basée sur le système de fichiers |
| [TypeScript](https://www.typescriptlang.org/) | Typage statique strict |
| [NativeWind](https://www.nativewind.dev/) (TailwindCSS) | Styling utilitaire |
| [TanStack Query v5](https://tanstack.com/query/latest) | Gestion du cache, fetching, mutations avec Optimistic UI |
| [JSON-Server](https://github.com/typicode/json-server) | API REST mock (backend local) |
| [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/) | Stockage sécurisé de la session utilisateur |
| [Lucide React Native](https://lucide.dev/) | Icônes modernes |

---

## 📁 Architecture du Projet

```
my-app/
├── api/                        # Couche API (fonctions fetch typées)
│   ├── client.ts               #   Client HTTP générique (GET, POST, PATCH, DELETE)
│   ├── missions.ts             #   Endpoints missions
│   ├── auth.ts                 #   Endpoints authentification
│   └── participations.ts       #   Endpoints participations
├── app/                        # Écrans (Expo Router – file-based routing)
│   ├── _layout.tsx             #   Layout racine (QueryClientProvider + AuthProvider)
│   ├── index.tsx               #   Redirection selon état d'authentification
│   ├── (auth)/                 #   Groupe authentification
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/                 #   Groupe onglets (navigation principale)
│   │   ├── _layout.tsx         #     Tab bar personnalisée
│   │   ├── index.tsx           #     Explorer les missions
│   │   ├── my-missions.tsx     #     Mes participations
│   │   └── profile.tsx         #     Profil utilisateur
│   └── mission/
│       └── [id].tsx            #   Détail d'une mission (route dynamique)
├── components/                 # Composants réutilisables
│   ├── ui/                     #   Composants atomiques (Button, Badge, Skeleton, etc.)
│   ├── MissionCard.tsx         #   Carte de mission
│   ├── CategoryFilter.tsx      #   Filtre horizontal par catégorie
│   ├── SearchBar.tsx           #   Barre de recherche
│   └── StatCard.tsx            #   Carte de statistique profil
├── contexts/
│   └── AuthContext.tsx         # Context React pour l'authentification
├── hooks/                      # Hooks TanStack Query
│   ├── useMissions.ts          #   Requêtes missions (useQuery)
│   ├── useParticipations.ts    #   Mutations participation (Optimistic UI)
│   └── useAuth.ts              #   Requête utilisateur
├── types/
│   └── index.ts                # Interfaces TypeScript (User, Mission, Participation, etc.)
├── db.json                     # Données seed pour JSON-Server
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 🚀 Installation & Lancement

### Prérequis

- **Node.js** ≥ 18
- **npm** ou **yarn**
- **Expo Go** sur votre appareil mobile (ou un émulateur Android/iOS)

### 1. Cloner le dépôt

```bash
git clone https://github.com/<votre-username>/EcoActionReactNative.git
cd EcoActionReactNative/my-app
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Démarrer le serveur JSON (backend mock)

```bash
npm run server
```

> Le serveur API sera accessible sur `http://localhost:3000`. L'application détecte automatiquement l'IP de votre machine via Expo pour les appareils physiques.

### 4. Démarrer l'application Expo

```bash
npx expo start
```

Scannez le QR code avec **Expo Go** ou lancez sur un émulateur.

### Comptes de test

| Email | Mot de passe |
|---|---|
| `rawen@eco.com` | `password123` |
| `amira@eco.com` | `password123` |
| `youssef@eco.com` | `password123` |

---

## 📡 Endpoints API (JSON-Server)

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/missions` | Liste des missions |
| `GET` | `/missions/:id` | Détail d'une mission |
| `GET` | `/missions?category=xxx` | Missions par catégorie |
| `GET` | `/users?email=xxx` | Recherche d'utilisateur |
| `POST` | `/users` | Inscription |
| `GET` | `/participations?userId=xxx` | Participations d'un utilisateur |
| `POST` | `/participations` | Rejoindre une mission |
| `DELETE` | `/participations/:id` | Annuler une participation |
| `PATCH` | `/missions/:id` | Mettre à jour les places |

---

## ✅ Vérification

```bash
# Vérifier le typage TypeScript
npx tsc --noEmit

# Lancer le linting
npm run lint

# Tester les endpoints API
curl http://localhost:3000/missions
curl http://localhost:3000/users
```

---

## 👤 Auteur

**Rawen** — Mini-projet React Native
