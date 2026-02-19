import type { Category } from "@/types";
import { CATEGORIES } from "@/types";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface CategoryFilterProps {
    selected: Category | null;
    onSelect: (category: Category | null) => void;
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
    return (
        <View style={{ height: 52, marginBottom: 12 }}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 10, alignItems: "center" }}
                style={{ flex: 1 }}
            >
                {/* All filter */}
                <TouchableOpacity
                    style={{
                        paddingHorizontal: 18,
                        paddingVertical: 10,
                        borderRadius: 50,
                        backgroundColor: selected === null ? "#10B981" : "#FFFFFF",
                        borderWidth: selected === null ? 0 : 1.5,
                        borderColor: selected === null ? "transparent" : "#E2E8F0",
                        shadowColor: selected === null ? "#10B981" : "#000",
                        shadowOffset: { width: 0, height: selected === null ? 4 : 1 },
                        shadowOpacity: selected === null ? 0.3 : 0.06,
                        shadowRadius: selected === null ? 8 : 4,
                        elevation: selected === null ? 4 : 1,
                    }}
                    onPress={() => onSelect(null)}
                    activeOpacity={0.8}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: "700",
                            color: selected === null ? "#FFFFFF" : "#475569",
                        }}
                    >
                        🌍 Tous
                    </Text>
                </TouchableOpacity>

                {/* Category pills */}
                {CATEGORIES.map((cat) => {
                    const isActive = selected === cat.key;
                    return (
                        <TouchableOpacity
                            key={cat.key}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                borderRadius: 50,
                                backgroundColor: isActive ? cat.color : "#FFFFFF",
                                borderWidth: isActive ? 0 : 1.5,
                                borderColor: isActive ? "transparent" : `${cat.color}40`,
                                shadowColor: isActive ? cat.color : "#000",
                                shadowOffset: { width: 0, height: isActive ? 4 : 1 },
                                shadowOpacity: isActive ? 0.3 : 0.06,
                                shadowRadius: isActive ? 8 : 4,
                                elevation: isActive ? 4 : 1,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 6,
                            }}
                            onPress={() => onSelect(isActive ? null : cat.key)}
                            activeOpacity={0.8}
                        >
                            <Text style={{ fontSize: 14 }}>{cat.emoji}</Text>
                            <Text
                                style={{
                                    fontSize: 13,
                                    fontWeight: "700",
                                    color: isActive ? "#FFFFFF" : "#475569",
                                }}
                            >
                                {cat.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}
