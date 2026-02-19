import {
    cancelParticipation,
    getParticipationsByUser,
    joinMission,
} from "@/api/participations";
import type { Mission, Participation } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useMyParticipations(userId: string) {
    return useQuery<Participation[]>({
        queryKey: ["participations", userId],
        queryFn: () => getParticipationsByUser(userId),
        enabled: !!userId,
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

export function useJoinMission() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, missionId }: { userId: string; missionId: string }) =>
            joinMission(userId, missionId),

        // ─── Optimistic UI ───────────────────────────────────────
        onMutate: async ({ userId, missionId }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["missions"] });
            await queryClient.cancelQueries({ queryKey: ["mission", missionId] });
            await queryClient.cancelQueries({ queryKey: ["participations", userId] });

            // Snapshot previous values
            const previousMission = queryClient.getQueryData<Mission>(["mission", missionId]);
            const previousParticipations = queryClient.getQueryData<Participation[]>([
                "participations",
                userId,
            ]);

            // Optimistically update mission spots
            queryClient.setQueriesData<Mission[]>(
                { queryKey: ["missions"] },
                (old) =>
                    old?.map((m) =>
                        m.id === missionId ? { ...m, spotsTaken: m.spotsTaken + 1 } : m
                    )
            );

            if (previousMission) {
                queryClient.setQueryData<Mission>(["mission", missionId], {
                    ...previousMission,
                    spotsTaken: previousMission.spotsTaken + 1,
                });
            }

            // Optimistically add participation to the list
            const tempParticipation: Participation = {
                id: `temp-${Date.now()}`,
                userId,
                missionId,
                status: "confirmed",
                joinedAt: new Date().toISOString(),
            };

            queryClient.setQueryData<Participation[]>(
                ["participations", userId],
                (old) => [...(old || []), tempParticipation]
            );

            return { previousMission, previousParticipations };
        },

        onError: (_err, { missionId, userId }, context) => {
            // Rollback on error
            if (context?.previousMission) {
                queryClient.setQueryData(["mission", missionId], context.previousMission);
            }
            if (context?.previousParticipations) {
                queryClient.setQueryData(
                    ["participations", userId],
                    context.previousParticipations
                );
            }
            // Also rollback mission lists
            queryClient.invalidateQueries({ queryKey: ["missions"] });
        },

        onSettled: (_data, _error, { userId, missionId }) => {
            // Refetch to ensure consistency with server
            queryClient.invalidateQueries({ queryKey: ["missions"] });
            queryClient.invalidateQueries({ queryKey: ["mission", missionId] });
            queryClient.invalidateQueries({ queryKey: ["participations", userId] });
        },
    });
}

export function useCancelParticipation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            participationId,
            missionId,
        }: {
            participationId: string;
            missionId: string;
            userId: string;
        }) => cancelParticipation(participationId, missionId),

        onMutate: async ({ missionId, participationId, userId }) => {
            await queryClient.cancelQueries({ queryKey: ["missions"] });
            await queryClient.cancelQueries({ queryKey: ["participations", userId] });
            await queryClient.cancelQueries({ queryKey: ["mission", missionId] });

            const previousParticipations = queryClient.getQueryData<Participation[]>([
                "participations",
                userId,
            ]);
            const previousMission = queryClient.getQueryData<Mission>(["mission", missionId]);

            // Optimistically remove participation
            if (previousParticipations) {
                queryClient.setQueryData<Participation[]>(
                    ["participations", userId],
                    previousParticipations.filter((p) => p.id !== participationId)
                );
            }

            // Optimistically decrement spots
            queryClient.setQueriesData<Mission[]>(
                { queryKey: ["missions"] },
                (old) =>
                    old?.map((m) =>
                        m.id === missionId
                            ? { ...m, spotsTaken: Math.max(0, m.spotsTaken - 1) }
                            : m
                    )
            );

            if (previousMission) {
                queryClient.setQueryData<Mission>(["mission", missionId], {
                    ...previousMission,
                    spotsTaken: Math.max(0, previousMission.spotsTaken - 1),
                });
            }

            return { previousParticipations, previousMission };
        },

        onError: (_err, { userId, missionId }, context) => {
            if (context?.previousParticipations) {
                queryClient.setQueryData(
                    ["participations", userId],
                    context.previousParticipations
                );
            }
            if (context?.previousMission) {
                queryClient.setQueryData(["mission", missionId], context.previousMission);
            }
            queryClient.invalidateQueries({ queryKey: ["missions"] });
        },

        onSettled: (_data, _error, { userId, missionId }) => {
            queryClient.invalidateQueries({ queryKey: ["missions"] });
            queryClient.invalidateQueries({ queryKey: ["mission", missionId] });
            queryClient.invalidateQueries({ queryKey: ["participations", userId] });
        },
    });
}
