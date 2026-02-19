import { getUserById } from "@/api/auth";
import type { User } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useUser(id: string) {
    return useQuery<User>({
        queryKey: ["user", id],
        queryFn: () => getUserById(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}
