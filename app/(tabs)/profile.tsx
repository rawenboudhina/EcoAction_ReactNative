import StatCard from "@/components/StatCard";
import Button from "@/components/ui/Button";
import { useAuthContext } from "@/contexts/AuthContext";
import {
    Award,
    ChevronRight,
    Clock,
    LogOut,
    TreePine,
} from "lucide-react-native";
import React from "react";
import {
    Alert,
    Image,
    ScrollView,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const { user, logout } = useAuthContext();

    const handleLogout = () => {
        Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
            { text: "Annuler", style: "cancel" },
            {
                text: "Déconnexion",
                style: "destructive",
                onPress: () => logout(),
            },
        ]);
    };

    return (
        <ScrollView
            className="flex-1 bg-slate-50"
            contentContainerStyle={{ paddingBottom: 120 }}
        >
            {/* Profile Header */}
            <View
                className="bg-emerald-500 pt-6 pb-16 px-6 items-center rounded-b-[40px]"
                style={{ paddingTop: insets.top + 16 }}
            >
                <View className="bg-white rounded-full p-1 mb-4">
                    <Image
                        source={{
                            uri:
                                user?.avatar ||
                                "https://api.dicebear.com/7.x/avataaars/png?seed=default",
                        }}
                        className="w-24 h-24 rounded-full"
                    />
                </View>
                <Text className="text-2xl font-bold text-white">
                    {user?.name || "Bénévole"}
                </Text>
                <Text className="text-emerald-100 mt-1">{user?.email}</Text>
            </View>

            {/* Stats Cards */}
            <View className="flex-row gap-3 px-6 -mt-8">
                <StatCard
                    icon={<Award size={22} color="#10B981" />}
                    value={user?.missionsCompleted || 0}
                    label="Missions"
                    color="#10B981"
                />
                <StatCard
                    icon={<Clock size={22} color="#0EA5E9" />}
                    value={user?.hoursVolunteered || 0}
                    label="Heures"
                    color="#0EA5E9"
                />
                <StatCard
                    icon={<TreePine size={22} color="#22C55E" />}
                    value={user?.treesPlanted || 0}
                    label="Arbres"
                    color="#22C55E"
                />
            </View>

            {/* Info Section */}
            <View className="px-6 mt-8">
                <Text className="text-lg font-bold text-slate-800 mb-4">
                    Mon Impact
                </Text>

                <View className="bg-white rounded-2xl p-5 mb-4" style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                }}>
                    <Text className="text-sm text-slate-500 mb-3">
                        Votre contribution
                    </Text>
                    <View className="gap-4">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-slate-700">Missions réalisées</Text>
                            <View className="flex-row items-center">
                                <Text className="text-emerald-500 font-bold mr-1">
                                    {user?.missionsCompleted || 0}
                                </Text>
                                <ChevronRight size={16} color="#94A3B8" />
                            </View>
                        </View>
                        <View className="h-px bg-slate-100" />
                        <View className="flex-row items-center justify-between">
                            <Text className="text-slate-700">Heures de bénévolat</Text>
                            <View className="flex-row items-center">
                                <Text className="text-sky-500 font-bold mr-1">
                                    {user?.hoursVolunteered || 0}h
                                </Text>
                                <ChevronRight size={16} color="#94A3B8" />
                            </View>
                        </View>
                        <View className="h-px bg-slate-100" />
                        <View className="flex-row items-center justify-between">
                            <Text className="text-slate-700">Arbres plantés</Text>
                            <View className="flex-row items-center">
                                <Text className="text-green-500 font-bold mr-1">
                                    {user?.treesPlanted || 0}
                                </Text>
                                <ChevronRight size={16} color="#94A3B8" />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Logout */}
                <View className="mt-4">
                    <Button
                        title="Se déconnecter"
                        variant="danger"
                        onPress={handleLogout}
                        icon={<LogOut size={18} color="#FFFFFF" />}
                    />
                </View>
            </View>
        </ScrollView>
    );
}
