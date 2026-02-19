import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { MissionCardSkeleton } from "@/components/ui/LoadingSkeleton";
import { useAuthContext } from "@/contexts/AuthContext";
import { useMission } from "@/hooks/useMissions";
import { useCancelParticipation, useMyParticipations } from "@/hooks/useParticipations";
import type { Participation } from "@/types";
import { CATEGORIES } from "@/types";
import { useRouter } from "expo-router";
import { Calendar, CalendarCheck, MapPin, X } from "lucide-react-native";
import React, { useCallback } from "react";
import {
    Alert,
    FlatList,
    Image,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function ParticipationCard({ participation }: { participation: Participation }) {
    const router = useRouter();
    const { user } = useAuthContext();
    const cancelMutation = useCancelParticipation();
    const { data: mission, isLoading } = useMission(participation.missionId);

    const handleCancel = () => {
        Alert.alert(
            "Annuler la participation",
            "Êtes-vous sûr de vouloir annuler votre participation à cette mission ?",
            [
                { text: "Non", style: "cancel" },
                {
                    text: "Oui, annuler",
                    style: "destructive",
                    onPress: () => {
                        if (user) {
                            cancelMutation.mutate({
                                participationId: participation.id,
                                missionId: participation.missionId,
                                userId: user.id,
                            });
                        }
                    },
                },
            ]
        );
    };

    if (isLoading || !mission) {
        return <MissionCardSkeleton />;
    }

    const categoryInfo = CATEGORIES.find((c) => c.key === mission.category);
    const formattedDate = new Date(mission.date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <TouchableOpacity
            className="bg-white rounded-2xl overflow-hidden mb-4 mx-4"
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 3,
            }}
            activeOpacity={0.9}
            onPress={() => router.push(`/mission/${mission.id}`)}
        >
            <View className="flex-row">
                <Image
                    source={{ uri: mission.image }}
                    className="w-28 h-full"
                    resizeMode="cover"
                />
                <View className="flex-1 p-4">
                    <Badge
                        label={categoryInfo?.label || mission.category}
                        category={mission.category}
                    />
                    <Text className="text-base font-bold text-slate-800 mt-1.5" numberOfLines={2}>
                        {mission.title}
                    </Text>
                    <View className="flex-row items-center mt-2">
                        <Calendar size={12} color="#64748B" />
                        <Text className="text-xs text-slate-500 ml-1">{formattedDate}</Text>
                    </View>
                    <View className="flex-row items-center mt-1">
                        <MapPin size={12} color="#64748B" />
                        <Text className="text-xs text-slate-500 ml-1" numberOfLines={1}>
                            {mission.location}
                        </Text>
                    </View>
                </View>

                {/* Cancel button */}
                <TouchableOpacity
                    className="items-center justify-center px-3"
                    onPress={handleCancel}
                    activeOpacity={0.7}
                >
                    <View className="bg-red-50 rounded-full p-2">
                        <X size={16} color="#EF4444" />
                    </View>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

export default function MyMissionsScreen() {
    const insets = useSafeAreaInsets();
    const { user } = useAuthContext();
    const {
        data: participations,
        isLoading,
        isError,
        error,
        refetch,
        isRefetching,
    } = useMyParticipations(user?.id || "");

    const renderItem = useCallback(
        ({ item }: { item: Participation }) => (
            <ParticipationCard participation={item} />
        ),
        []
    );

    const keyExtractor = useCallback((item: Participation) => item.id, []);

    return (
        <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
            {/* Header */}
            <View className="px-6 pt-4 pb-4">
                <View className="flex-row items-center gap-3">
                    <View className="bg-emerald-100 rounded-full p-2.5">
                        <CalendarCheck size={24} color="#10B981" />
                    </View>
                    <View>
                        <Text className="text-2xl font-bold text-slate-800">
                            Mes Missions
                        </Text>
                        <Text className="text-sm text-slate-500">
                            {participations?.length || 0} mission(s) en cours
                        </Text>
                    </View>
                </View>
            </View>

            {isLoading ? (
                <View className="flex-1">
                    {[1, 2, 3].map((i) => (
                        <MissionCardSkeleton key={i} />
                    ))}
                </View>
            ) : isError ? (
                <ErrorState
                    message={(error as Error)?.message || "Impossible de charger vos missions"}
                    onRetry={() => refetch()}
                />
            ) : participations && participations.length === 0 ? (
                <EmptyState
                    title="Aucune mission"
                    description="Explorez et inscrivez-vous à des missions pour les retrouver ici !"
                />
            ) : (
                <FlatList
                    data={participations}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefetching}
                            onRefresh={() => refetch()}
                            tintColor="#10B981"
                            colors={["#10B981"]}
                        />
                    }
                />
            )}
        </View>
    );
}
