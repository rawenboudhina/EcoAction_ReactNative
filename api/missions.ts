import type { Mission } from "@/types";
import { apiGet } from "./client";

export async function getMissions(): Promise<Mission[]> {
    return apiGet<Mission[]>("/missions");
}

export async function getMissionById(id: string): Promise<Mission> {
    return apiGet<Mission>(`/missions/${id}`);
}

export async function getMissionsByCategory(category: string): Promise<Mission[]> {
    return apiGet<Mission[]>(`/missions?category=${category}`);
}

export async function searchMissions(query: string): Promise<Mission[]> {
    return apiGet<Mission[]>(`/missions?q=${encodeURIComponent(query)}`);
}
