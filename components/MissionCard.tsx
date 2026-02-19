import Badge from "@/components/ui/Badge";
import type { Mission } from "@/types";
import { CATEGORIES } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Calendar, MapPin, Users } from "lucide-react-native";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface MissionCardProps {
    mission: Mission;
}

const CAUSE_TAGLINES: Record<string, string> = {
    "beach-cleanup": "Protégeons nos océans 🌊",
    "tree-planting": "Un arbre = un avenir 🌱",
    "zero-waste": "Moins de déchets, plus de vie ♻️",
    recycling: "Chaque geste compte 📦",
    education: "Inspirer les générations futures 📚",
};

export default function MissionCard({ mission }: MissionCardProps) {
    const router = useRouter();
    const spotsLeft = mission.spotsTotal - mission.spotsTaken;
    const categoryInfo = CATEGORIES.find((c) => c.key === mission.category);
    const spotsPercent = (mission.spotsTaken / mission.spotsTotal) * 100;

    const formattedDate = new Date(mission.date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <TouchableOpacity
            className="bg-white rounded-3xl overflow-hidden mb-5 mx-4"
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 16,
                elevation: 5,
            }}
            activeOpacity={0.92}
            onPress={() => router.push(`/mission/${mission.id}`)}
        >
            {/* Image with gradient overlay */}
            <View className="relative">
                <Image
                    source={{ uri: mission.image }}
                    className="w-full"
                    style={{ height: 180 }}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.6)"]}
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 100,
                    }}
                />

                {/* Spots overlay */}
                <View
                    className="absolute top-3 right-3 rounded-full px-3 py-1.5 flex-row items-center"
                    style={{
                        backgroundColor: spotsLeft <= 3 ? "rgba(239,68,68,0.9)" : "rgba(0,0,0,0.6)",
                    }}
                >
                    <Users size={12} color="#FFFFFF" />
                    <Text className="text-white text-xs font-bold ml-1">
                        {spotsLeft <= 0 ? "Complet" : `${spotsLeft} places`}
                    </Text>
                </View>

                {/* Category badge on image */}
                <View className="absolute bottom-3 left-4">
                    <Badge
                        label={`${categoryInfo?.emoji || ""} ${categoryInfo?.label || mission.category}`}
                        category={mission.category}
                        size="md"
                    />
                </View>
            </View>

            {/* Content */}
            <View className="p-4">
                {/* Title */}
                <Text
                    className="text-lg font-bold text-slate-800"
                    numberOfLines={2}
                >
                    {mission.title}
                </Text>

                {/* Cause tagline */}
                <Text className="text-xs text-emerald-600 font-semibold mt-1">
                    {CAUSE_TAGLINES[mission.category] || "Agissons ensemble 🌍"}
                </Text>

                {/* Meta info */}
                <View className="flex-row items-center mt-3 gap-4">
                    <View className="flex-row items-center">
                        <View
                            className="rounded-full p-1 mr-1.5"
                            style={{ backgroundColor: "#F0FDF4" }}
                        >
                            <Calendar size={12} color="#10B981" />
                        </View>
                        <Text className="text-sm text-slate-500">{formattedDate}</Text>
                    </View>
                    <View className="flex-row items-center flex-1">
                        <View
                            className="rounded-full p-1 mr-1.5"
                            style={{ backgroundColor: "#FEF2F2" }}
                        >
                            <MapPin size={12} color="#EF4444" />
                        </View>
                        <Text
                            className="text-sm text-slate-500"
                            numberOfLines={1}
                        >
                            {mission.location}
                        </Text>
                    </View>
                </View>

                {/* Spots progress bar */}
                <View className="mt-3">
                    <View className="flex-row items-center justify-between mb-1.5">
                        <Text className="text-xs text-slate-400 font-medium">
                            Participants
                        </Text>
                        <Text className="text-xs font-bold text-slate-600">
                            <Text style={{ color: spotsLeft <= 3 ? "#EF4444" : "#10B981" }}>
                                {mission.spotsTaken}
                            </Text>
                            /{mission.spotsTotal}
                        </Text>
                    </View>
                    <View className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <View
                            className="h-full rounded-full"
                            style={{
                                width: `${spotsPercent}%`,
                                backgroundColor: spotsLeft <= 3 ? "#EF4444" : "#10B981",
                            }}
                        />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}
