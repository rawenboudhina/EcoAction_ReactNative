import CategoryFilter from "@/components/CategoryFilter";
import MissionCard from "@/components/MissionCard";
import SearchBar from "@/components/SearchBar";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { MissionCardSkeleton } from "@/components/ui/LoadingSkeleton";
import { useAuthContext } from "@/contexts/AuthContext";
import { useMissions } from "@/hooks/useMissions";
import type { Category, Mission } from "@/types";
import { Leaf, TrendingUp } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
    FlatList,
    RefreshControl,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ExploreScreen() {
    const insets = useSafeAreaInsets();
    const { user } = useAuthContext();
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const {
        data: missions,
        isLoading,
        isError,
        error,
        refetch,
        isRefetching,
    } = useMissions(selectedCategory ?? undefined, searchQuery);

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    const renderMission = useCallback(
        ({ item }: { item: Mission }) => <MissionCard mission={item} />,
        []
    );

    const keyExtractor = useCallback((item: Mission) => item.id, []);

    return (
        <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
            {/* Header */}
            <View className="px-6 pt-4 pb-2">
                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="text-slate-500 text-sm">Bonjour 👋</Text>
                        <Text className="text-2xl font-bold text-slate-800">
                            {user?.name || "Bénévole"}
                        </Text>
                    </View>
                    <View className="bg-emerald-100 rounded-full p-2.5">
                        <Leaf size={24} color="#10B981" />
                    </View>
                </View>
            </View>

            {/* Eco Impact Banner */}
            <View
                className="mx-4 mb-4 rounded-2xl p-4 flex-row items-center"
                style={{
                    backgroundColor: "#ECFDF5",
                    borderWidth: 1,
                    borderColor: "#A7F3D0",
                }}
            >
                <View className="bg-emerald-500 rounded-xl p-2 mr-3">
                    <TrendingUp size={18} color="#FFFFFF" />
                </View>
                <View className="flex-1">
                    <Text className="text-sm font-bold text-emerald-800">
                        🌍 Ensemble, faisons la différence
                    </Text>
                    <Text className="text-xs text-emerald-600 mt-0.5">
                        {missions?.length || 0} missions disponibles près de chez vous
                    </Text>
                </View>
            </View>

            {/* Search */}
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

            {/* Category Filter */}
            <CategoryFilter
                selected={selectedCategory}
                onSelect={setSelectedCategory}
            />

            {/* Mission List */}
            {isLoading ? (
                <View className="flex-1">
                    {[1, 2, 3].map((i) => (
                        <MissionCardSkeleton key={i} />
                    ))}
                </View>
            ) : isError ? (
                <ErrorState
                    message={(error as Error)?.message || "Impossible de charger les missions"}
                    onRetry={handleRefresh}
                />
            ) : missions && missions.length === 0 ? (
                <EmptyState
                    title="Aucune mission trouvée"
                    description="Essayez de modifier vos filtres ou votre recherche"
                />
            ) : (
                <FlatList
                    data={missions}
                    renderItem={renderMission}
                    keyExtractor={keyExtractor}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefetching}
                            onRefresh={handleRefresh}
                            tintColor="#10B981"
                            colors={["#10B981"]}
                        />
                    }
                />
            )}
        </View>
    );
}
