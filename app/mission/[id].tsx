import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/ui/ErrorState";
import { useAuthContext } from "@/contexts/AuthContext";
import { useMission } from "@/hooks/useMissions";
import {
    useCancelParticipation,
    useJoinMission,
    useMyParticipations,
} from "@/hooks/useParticipations";
import { CATEGORIES } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    ArrowLeft,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    MapPin,
    Share2,
    Users,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MissionDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuthContext();

    const { data: mission, isLoading, isError, refetch } = useMission(id);
    const { data: participations } = useMyParticipations(user?.id || "");
    const joinMutation = useJoinMission();
    const cancelMutation = useCancelParticipation();

    // ─── Local join state for instant toggle ───────────────
    const serverParticipation = useMemo(
        () => participations?.find((p) => p.missionId === id),
        [participations, id]
    );

    const [localJoined, setLocalJoined] = useState<boolean | null>(null);

    // Sync local state with server data (only when not overridden)
    useEffect(() => {
        setLocalJoined(null); // reset local override when server data changes
    }, [serverParticipation?.id]);

    // Effective join status: local override > server truth
    const isJoined = localJoined !== null ? localJoined : !!serverParticipation;

    const isMutating = joinMutation.isPending || cancelMutation.isPending;
    const spotsLeft = mission ? mission.spotsTotal - mission.spotsTaken : 0;
    const isFull = spotsLeft <= 0 && !isJoined;
    const categoryInfo = CATEGORIES.find((c) => c.key === mission?.category);

    const formattedDate = mission
        ? new Date(mission.date).toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        })
        : "";

    const formattedTime = mission
        ? new Date(mission.date).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        })
        : "";

    const handleJoin = () => {
        if (!user || !mission || isMutating || isJoined) return;

        if (isFull) {
            Alert.alert("Complet", "Cette mission n'a plus de places disponibles");
            return;
        }

        // Instantly flip the button
        setLocalJoined(true);

        joinMutation.mutate(
            { userId: user.id, missionId: mission.id },
            {
                onError: () => {
                    setLocalJoined(false); // rollback on error
                    Alert.alert("Erreur", "Impossible de s'inscrire à cette mission.");
                },
            }
        );
    };

    const handleCancel = () => {
        if (!user || !serverParticipation || !mission || isMutating) return;

        Alert.alert(
            "Annuler la participation",
            "Êtes-vous sûr de vouloir annuler votre participation ?",
            [
                { text: "Non", style: "cancel" },
                {
                    text: "Oui, annuler",
                    style: "destructive",
                    onPress: () => {
                        // Instantly flip the button
                        setLocalJoined(false);

                        cancelMutation.mutate(
                            {
                                participationId: serverParticipation.id,
                                missionId: mission.id,
                                userId: user.id,
                            },
                            {
                                onError: () => {
                                    setLocalJoined(true); // rollback on error
                                    Alert.alert("Erreur", "Impossible d'annuler la participation.");
                                },
                            }
                        );
                    },
                },
            ]
        );
    };

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50">
                <ActivityIndicator size="large" color="#10B981" />
            </View>
        );
    }

    if (isError || !mission) {
        return (
            <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
                <ErrorState
                    message="Impossible de charger cette mission"
                    onRetry={() => refetch()}
                />
            </View>
        );
    }

    const spotsPercent = Math.min(
        100,
        (mission.spotsTaken / mission.spotsTotal) * 100
    );

    return (
        <View className="flex-1 bg-slate-50">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 130 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ─── Hero Image ─────────────────────────────────── */}
                <View className="relative">
                    <Image
                        source={{ uri: mission.image }}
                        className="w-full"
                        style={{ height: 320 }}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.65)"]}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }}
                    />

                    {/* Back button */}
                    <TouchableOpacity
                        className="absolute bg-white rounded-2xl p-2.5"
                        style={{
                            top: insets.top + 8,
                            left: 16,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.15,
                            shadowRadius: 8,
                            elevation: 4,
                        }}
                        onPress={() => router.back()}
                        activeOpacity={0.8}
                    >
                        <ArrowLeft size={22} color="#1E293B" />
                    </TouchableOpacity>

                    {/* Share button */}
                    <TouchableOpacity
                        className="absolute bg-white rounded-2xl p-2.5"
                        style={{
                            top: insets.top + 8,
                            right: 16,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.15,
                            shadowRadius: 8,
                            elevation: 4,
                        }}
                        activeOpacity={0.8}
                    >
                        <Share2 size={22} color="#1E293B" />
                    </TouchableOpacity>

                    {/* Bottom info overlay */}
                    <View className="absolute bottom-0 left-0 right-0 px-6 pb-5">
                        <View className="flex-row items-center gap-2 mb-2">
                            <Badge
                                label={categoryInfo?.label || mission.category}
                                category={mission.category}
                                size="md"
                            />
                            {isJoined && (
                                <View className="flex-row items-center bg-emerald-500 rounded-full px-3 py-1.5">
                                    <CheckCircle2 size={14} color="#FFFFFF" />
                                    <Text className="text-white text-xs font-bold ml-1">
                                        Inscrit
                                    </Text>
                                </View>
                            )}
                        </View>
                        <Text
                            className="text-2xl font-bold text-white leading-7"
                            style={{
                                textShadowColor: "rgba(0,0,0,0.3)",
                                textShadowRadius: 4,
                                textShadowOffset: { width: 0, height: 1 },
                            }}
                        >
                            {mission.title}
                        </Text>
                    </View>
                </View>

                {/* ─── Content ────────────────────────────────────── */}
                <View className="px-5 pt-5">
                    {/* Organizer */}
                    <View className="flex-row items-center mb-5">
                        <View className="bg-emerald-50 rounded-full p-2">
                            <Building2 size={16} color="#10B981" />
                        </View>
                        <Text className="text-sm text-slate-600 ml-2.5 font-medium">
                            {mission.organizer}
                        </Text>
                    </View>

                    {/* ─── Info Grid ────────────────────────────────── */}
                    <View className="flex-row gap-3 mb-4">
                        <View
                            className="flex-1 bg-white rounded-3xl p-4 items-center"
                            style={{
                                shadowColor: "#10B981",
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.08,
                                shadowRadius: 16,
                                elevation: 3,
                            }}
                        >
                            <View className="bg-emerald-50 rounded-2xl p-2.5 mb-2">
                                <Calendar size={20} color="#10B981" />
                            </View>
                            <Text className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                Date
                            </Text>
                            <Text className="text-xs font-bold text-slate-800 text-center mt-1">
                                {formattedDate}
                            </Text>
                            <Text className="text-xs text-emerald-500 font-bold mt-0.5">
                                {formattedTime}
                            </Text>
                        </View>

                        <View
                            className="flex-1 bg-white rounded-3xl p-4 items-center"
                            style={{
                                shadowColor: "#0EA5E9",
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.08,
                                shadowRadius: 16,
                                elevation: 3,
                            }}
                        >
                            <View className="bg-sky-50 rounded-2xl p-2.5 mb-2">
                                <Clock size={20} color="#0EA5E9" />
                            </View>
                            <Text className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                Durée
                            </Text>
                            <Text className="text-xs font-bold text-slate-800 text-center mt-1">
                                {mission.duration}
                            </Text>
                        </View>

                        <View
                            className="flex-1 bg-white rounded-3xl p-4 items-center"
                            style={{
                                shadowColor: "#8B5CF6",
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.08,
                                shadowRadius: 16,
                                elevation: 3,
                            }}
                        >
                            <View className="bg-violet-50 rounded-2xl p-2.5 mb-2">
                                <Users size={20} color="#8B5CF6" />
                            </View>
                            <Text className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                Places
                            </Text>
                            <Text className="text-xs font-bold text-slate-800 text-center mt-1">
                                {spotsLeft} restantes
                            </Text>
                        </View>
                    </View>

                    {/* Location Card */}
                    <View
                        className="bg-white rounded-3xl p-4 mb-4 flex-row items-center"
                        style={{
                            shadowColor: "#EF4444",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.06,
                            shadowRadius: 12,
                            elevation: 2,
                        }}
                    >
                        <View className="bg-red-50 rounded-2xl p-3">
                            <MapPin size={22} color="#EF4444" />
                        </View>
                        <View className="ml-4 flex-1">
                            <Text className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                Lieu
                            </Text>
                            <Text className="text-sm font-bold text-slate-800 mt-0.5">
                                {mission.location}
                            </Text>
                        </View>
                    </View>

                    {/* Participants Progress */}
                    <View
                        className="bg-white rounded-3xl p-5 mb-5"
                        style={{
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.04,
                            shadowRadius: 12,
                            elevation: 2,
                        }}
                    >
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-sm font-bold text-slate-700">
                                Participants
                            </Text>
                            <Text className="text-sm font-bold text-slate-800">
                                <Text className="text-emerald-500">{mission.spotsTaken}</Text>
                                /{mission.spotsTotal}
                            </Text>
                        </View>
                        <View className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <View
                                className={`h-full rounded-full ${spotsLeft <= 3 ? "bg-red-400" : "bg-emerald-400"
                                    }`}
                                style={{ width: `${spotsPercent}%` }}
                            />
                        </View>
                        <Text className="text-xs text-slate-400 mt-2.5">
                            {spotsLeft <= 3 && spotsLeft > 0
                                ? "⚡ Dépêchez-vous, il reste peu de places !"
                                : isFull
                                    ? "😔 Cette mission est complète"
                                    : `🌿 ${spotsLeft} places disponibles`}
                        </Text>
                    </View>

                    {/* Why Participate */}
                    <View
                        className="bg-emerald-50 rounded-3xl p-5 mb-5"
                        style={{
                            borderWidth: 1,
                            borderColor: "#A7F3D0",
                        }}
                    >
                        <Text className="text-base font-bold text-emerald-800 mb-2">
                            💚 Pourquoi participer ?
                        </Text>
                        <Text className="text-sm text-emerald-700 leading-5">
                            {mission.description.split("\n")[0]}
                        </Text>
                    </View>

                    {/* Full Description */}
                    <View className="mb-6">
                        <Text className="text-lg font-bold text-slate-800 mb-3">
                            📋 À propos de cette mission
                        </Text>
                        <Text className="text-[15px] text-slate-600 leading-6">
                            {mission.description}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* ─── Bottom Action Bar ────────────────────────────── */}
            <View
                className="absolute bottom-0 left-0 right-0 bg-white/95 border-t border-slate-100 px-5 pt-4"
                style={{
                    paddingBottom: Math.max(insets.bottom, 16) + 8,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -8 },
                    shadowOpacity: 0.06,
                    shadowRadius: 16,
                    elevation: 8,
                }}
            >
                <View className="flex-row items-center gap-4">
                    <View className="items-center">
                        <Text className="text-xs text-slate-400">Durée</Text>
                        <Text className="text-base font-bold text-slate-800">
                            {mission.duration}
                        </Text>
                    </View>

                    <View className="flex-1">
                        {isJoined ? (
                            <Button
                                title="Annuler ma participation"
                                variant="danger"
                                size="lg"
                                onPress={handleCancel}
                                isLoading={cancelMutation.isPending}
                                disabled={isMutating}
                            />
                        ) : (
                            <Button
                                title={isFull ? "Complet" : "Participer 🌱"}
                                variant="primary"
                                size="lg"
                                onPress={handleJoin}
                                isLoading={joinMutation.isPending}
                                disabled={isFull || isMutating}
                            />
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
}
