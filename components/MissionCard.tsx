import Badge from "@/components/ui/Badge";
import type { Mission } from "@/types";
import { CATEGORIES } from "@/types";
import { useRouter } from "expo-router";
import { Calendar, MapPin, Users } from "lucide-react-native";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface MissionCardProps {
    mission: Mission;
}

export default function MissionCard({ mission }: MissionCardProps) {
    const router = useRouter();
    const spotsLeft = mission.spotsTotal - mission.spotsTaken;
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
            {/* Image */}
            <View className="relative">
                <Image
                    source={{ uri: mission.image }}
                    className="w-full h-44"
                    resizeMode="cover"
                />
                {/* Spots overlay */}
                <View className="absolute top-3 right-3 bg-black/60 rounded-full px-3 py-1.5 flex-row items-center">
                    <Users size={12} color="#FFFFFF" />
                    <Text className="text-white text-xs font-bold ml-1">
                        {spotsLeft} places
                    </Text>
                </View>
            </View>

            {/* Content */}
            <View className="p-4">
                {/* Category badge */}
                <Badge
                    label={categoryInfo?.label || mission.category}
                    category={mission.category}
                />

                {/* Title */}
                <Text
                    className="text-lg font-bold text-slate-800 mt-2"
                    numberOfLines={2}
                >
                    {mission.title}
                </Text>

                {/* Meta info */}
                <View className="flex-row items-center mt-3 gap-4">
                    <View className="flex-row items-center">
                        <Calendar size={14} color="#64748B" />
                        <Text className="text-sm text-slate-500 ml-1.5">{formattedDate}</Text>
                    </View>
                    <View className="flex-row items-center flex-1">
                        <MapPin size={14} color="#64748B" />
                        <Text
                            className="text-sm text-slate-500 ml-1.5"
                            numberOfLines={1}
                        >
                            {mission.location}
                        </Text>
                    </View>
                </View>

                {/* Spots progress bar */}
                <View className="mt-3">
                    <View className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <View
                            className={`h-full rounded-full ${spotsLeft <= 3 ? "bg-red-400" : "bg-emerald-400"
                                }`}
                            style={{
                                width: `${(mission.spotsTaken / mission.spotsTotal) * 100}%`,
                            }}
                        />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}
