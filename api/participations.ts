import type { Mission, Participation } from "@/types";
import { apiDelete, apiGet, apiPatch, apiPost } from "./client";

export async function getParticipationsByUser(userId: string): Promise<Participation[]> {
    return apiGet<Participation[]>(`/participations?userId=${userId}&status=confirmed`);
}

export async function joinMission(
    userId: string,
    missionId: string
): Promise<{ participation: Participation; mission: Mission }> {
    // ── Guard: prevent duplicate participations ──
    const existing = await apiGet<Participation[]>(
        `/participations?userId=${userId}&missionId=${missionId}&status=confirmed`
    );
    if (existing.length > 0) {
        const mission = await apiGet<Mission>(`/missions/${missionId}`);
        return { participation: existing[0], mission };
    }

    // Create participation
    const participation = await apiPost<Participation>("/participations", {
        userId,
        missionId,
        status: "confirmed",
        joinedAt: new Date().toISOString(),
    });

    // Increment spotsTaken on the mission
    const mission = await apiGet<Mission>(`/missions/${missionId}`);
    const updatedMission = await apiPatch<Mission>(`/missions/${missionId}`, {
        spotsTaken: mission.spotsTaken + 1,
    });

    return { participation, mission: updatedMission };
}

export async function cancelParticipation(
    participationId: string,
    missionId: string
): Promise<void> {
    // Delete participation
    await apiDelete(`/participations/${participationId}`);

    // Decrement spotsTaken on the mission
    const mission = await apiGet<Mission>(`/missions/${missionId}`);
    await apiPatch<Mission>(`/missions/${missionId}`, {
        spotsTaken: Math.max(0, mission.spotsTaken - 1),
    });
}
