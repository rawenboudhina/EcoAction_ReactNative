import { getMissionById, getMissions } from "@/api/missions";
import type { Mission } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useMissions(category?: string, search?: string) {
    return useQuery<Mission[]>({
        queryKey: ["missions", { category, search }],
        queryFn: async () => {
            const missions = await getMissions();

            let filtered = missions;

            if (category) {
                filtered = filtered.filter((m) => m.category === category);
            }

            if (search && search.trim().length > 0) {
                const q = search.toLowerCase();
                filtered = filtered.filter(
                    (m) =>
                        m.title.toLowerCase().includes(q) ||
                        m.description.toLowerCase().includes(q) ||
                        m.location.toLowerCase().includes(q)
                );
            }

            return filtered;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
    });
}

export function useMission(id: string) {
    return useQuery<Mission>({
        queryKey: ["mission", id],
        queryFn: () => getMissionById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}
