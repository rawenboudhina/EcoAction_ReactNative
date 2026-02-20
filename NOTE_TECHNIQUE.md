# Note Technique — EcoAction

**Projet** : EcoAction — Plateforme de Bénévolat Environnemental  
**Stack** : React Native (Expo SDK 54), TypeScript, TanStack Query v5, NativeWind, JSON-Server  
## 1. Architecture de l'application

### 1.1 Choix architectural : Séparation en couches

L'application adopte une **architecture en couches** clairement séparées, inspirée du pattern *Clean Architecture* adapté à React Native :

```
┌─────────────────────────────────────────┐
│             Screens (app/)              │  ← UI / Présentation
├─────────────────────────────────────────┤
│       Hooks TanStack Query (hooks/)     │  ← Logique métier & cache
├─────────────────────────────────────────┤
│          API Layer (api/)               │  ← Accès données
├─────────────────────────────────────────┤
│        JSON-Server (db.json)            │  ← Source de données
└─────────────────────────────────────────┘
```

**Justification :**

- **`api/`** — Couche d'abstraction HTTP. Un client générique (`client.ts`) expose des fonctions typées `apiGet<T>()`, `apiPost<T>()`, `apiPatch<T>()`, `apiDelete()` qui encapsulent `fetch` avec gestion d'erreurs centralisée. Les modules `missions.ts`, `participations.ts` et `auth.ts` consomment ce client et retournent des objets fortement typés. Cette séparation permet de remplacer le backend (JSON-Server → API réelle) sans modifier les hooks ni les écrans.

- **`hooks/`** — Couche de logique métier via TanStack Query. Les hooks (`useMissions`, `useParticipations`) orchestrent le cache, les requêtes et les mutations. Les écrans n'interagissent jamais directement avec l'API.

- **`app/`** — Couche de présentation. Expo Router permet un routage basé sur le système de fichiers avec des groupes de routes : `(auth)` pour l'authentification et `(tabs)` pour la navigation principale. L'`AuthGate` dans le layout racine redirige automatiquement l'utilisateur selon son état de connexion.

- **`contexts/`** — L'`AuthContext` gère l'état de session globalement et persiste les données utilisateur via `expo-secure-store`, garantissant la restauration automatique de session au redémarrage.

### 1.2 Navigation

Expo Router est choisi pour sa navigation file-based qui rend la structure de l'application immédiatement lisible. Les **route groups** `(auth)` et `(tabs)` séparent clairement les flux authentifié et non-authentifié, et la route dynamique `mission/[id].tsx` gère le détail des missions.

---

## 2. Gestion des types complexes

### 2.1 Typage strict avec TypeScript

Tous les types sont centralisés dans `types/index.ts`. Le système de types couvre l'ensemble du domaine métier :

| Type | Rôle | Complexité |
|---|---|---|
| `Category` (union littérale) | 5 catégories de missions | Garantit les valeurs valides à la compilation |
| `CategoryInfo` (interface) | Métadonnées d'une catégorie (label, icône, emoji, couleur) | Utilisé par le `CategoryFilter` |
| `Mission` | Modèle mission (11 champs) | Référence `Category` pour le champ `category` |
| `Participation` | Relation User ↔ Mission avec statut | Union littérale `"confirmed" | "cancelled"` |
| `User` | Profil utilisateur avec statistiques | Utilisé par `AuthContext` et les écrans |
| `ApiError` | Erreur API structurée | Propagée dans toute la couche API |

### 2.2 Génériques dans le client API

Le client HTTP utilise des **fonctions génériques** pour assurer le typage de bout en bout :

```typescript
export async function apiGet<T>(endpoint: string): Promise<T> { ... }
export async function apiPost<T>(endpoint: string, data: unknown): Promise<T> { ... }
```

Ainsi, `apiGet<Mission[]>("/missions")` retourne directement un `Mission[]` typé. Ce pattern élimine les assertions de type manuelles et propage la sûreté de type du backend jusqu'à l'écran.

### 2.3 Types composites dans les mutations

La fonction `joinMission` retourne un type composite `Promise<{ participation: Participation; mission: Mission }>` car elle effectue deux opérations atomiques (création de participation + mise à jour des places). Ce type composite est ensuite exploité par le hook `useJoinMission` pour mettre à jour de manière optimiste les deux caches concernés.

---

## 3. Stratégie de mise en cache avec TanStack Query

### 3.1 Configuration globale

Le `QueryClient` est configuré dans `_layout.tsx` avec des valeurs par défaut :

| Paramètre | Valeur | Justification |
|---|---|---|
| `retry` | 2 | Deux tentatives automatiques en cas d'échec réseau |
| `staleTime` | 5 min | Les données sont considérées fraîches pendant 5 minutes — évite les refetch inutiles |
| `gcTime` | 30 min | Le cache est conservé 30 minutes après le dernier usage — navigation rapide entre écrans |

### 3.2 Clés de cache (Query Keys)

La structure des clés de cache suit une hiérarchie logique qui permet l'invalidation granulaire :

- `["missions"]` — liste globale (toutes les missions)
- `["missions", { category, search }]` — liste filtrée (variation automatique selon les paramètres)
- `["mission", id]` — détail d'une mission spécifique
- `["participations", userId]` — participations d'un utilisateur

Cette structure permet d'**invalider sélectivement** : par exemple, après une participation, on invalide `["missions"]`, `["mission", missionId]` et `["participations", userId]` sans toucher au reste du cache.

### 3.3 Optimistic UI — Mutations avec rollback

L'Optimistic UI est implémentée dans les hooks `useJoinMission()` et `useCancelParticipation()` via le cycle complet de TanStack Query :

```
onMutate → onError (rollback) → onSettled (reconciliation)
```

**Cycle détaillé de `useJoinMission` :**

1. **`onMutate`** — Avant l'envoi au serveur :
   - Annule les requêtes en cours (`cancelQueries`) pour éviter les conflits
   - Sauvegarde l'état précédent (snapshot) des caches `mission` et `participations`
   - Met à jour le cache immédiatement : `spotsTaken + 1` et ajout d'une participation temporaire

2. **`onError`** — En cas d'échec réseau :
   - Restaure les snapshots sauvegardés (rollback complet)
   - L'utilisateur voit l'état revenir à la normale sans intervention

3. **`onSettled`** — Après succès ou échec :
   - Invalide les caches pour re-synchroniser avec le serveur
   - Garantit la cohérence finale des données

**Avantage** : L'utilisateur perçoit une réponse instantanée (< 50 ms) même sur réseau lent. En cas d'erreur, le rollback est transparent et automatique.

### 3.4 Résumé de la stratégie

| Aspect | Choix | Bénéfice |
|---|---|---|
| Cache global | `staleTime: 5min`, `gcTime: 30min` | Navigation fluide, pas de rechargement inutile |
| Invalidation | Par query key hiérarchique | Précision, pas de sur-invalidation |
| Mutations | Optimistic UI + rollback | UX réactive, résilience aux erreurs |
| Refetch | Pull-to-refresh + `onSettled` | L'utilisateur garde le contrôle |
