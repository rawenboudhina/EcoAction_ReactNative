// ─── Category Types ────────────────────────────────────────────
export type Category =
  | "beach-cleanup"
  | "tree-planting"
  | "zero-waste"
  | "recycling"
  | "education";

export interface CategoryInfo {
  key: Category;
  label: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { key: "beach-cleanup", label: "Plages", icon: "waves", color: "#0EA5E9" },
  { key: "tree-planting", label: "Arbres", icon: "tree-pine", color: "#22C55E" },
  { key: "zero-waste", label: "Zéro Déchet", icon: "recycle", color: "#F59E0B" },
  { key: "recycling", label: "Recyclage", icon: "package", color: "#8B5CF6" },
  { key: "education", label: "Éducation", icon: "book-open", color: "#EC4899" },
];

// ─── User ──────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  missionsCompleted: number;
  hoursVolunteered: number;
  treesPlanted: number;
}

// ─── Mission ───────────────────────────────────────────────────
export interface Mission {
  id: string;
  title: string;
  description: string;
  category: Category;
  date: string;
  location: string;
  spotsTotal: number;
  spotsTaken: number;
  image: string;
  organizer: string;
  duration: string;
}

// ─── Participation ─────────────────────────────────────────────
export type ParticipationStatus = "confirmed" | "cancelled";

export interface Participation {
  id: string;
  userId: string;
  missionId: string;
  status: ParticipationStatus;
  joinedAt: string;
}

// ─── Auth ──────────────────────────────────────────────────────
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ─── API Error ─────────────────────────────────────────────────
export interface ApiError {
  message: string;
  status: number;
}
