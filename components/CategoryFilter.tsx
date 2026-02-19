import type { Category } from "@/types";
import { CATEGORIES } from "@/types";
import React from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

interface CategoryFilterProps {
    selected: Category | null;
    onSelect: (category: Category | null) => void;
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
            className="mb-4"
        >
            {/* All filter */}
            <TouchableOpacity
                className={`px-4 py-2.5 rounded-full ${selected === null
                        ? "bg-emerald-500"
                        : "bg-white border border-slate-200"
                    }`}
                onPress={() => onSelect(null)}
                activeOpacity={0.8}
            >
                <Text
                    className={`text-sm font-semibold ${selected === null ? "text-white" : "text-slate-600"
                        }`}
                >
                    Tous
                </Text>
            </TouchableOpacity>

            {/* Category pills */}
            {CATEGORIES.map((cat) => (
                <TouchableOpacity
                    key={cat.key}
                    className={`px-4 py-2.5 rounded-full ${selected === cat.key
                            ? "bg-emerald-500"
                            : "bg-white border border-slate-200"
                        }`}
                    onPress={() => onSelect(selected === cat.key ? null : cat.key)}
                    activeOpacity={0.8}
                >
                    <Text
                        className={`text-sm font-semibold ${selected === cat.key ? "text-white" : "text-slate-600"
                            }`}
                    >
                        {cat.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}
