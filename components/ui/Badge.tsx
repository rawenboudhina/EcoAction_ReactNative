import type { Category } from "@/types";
import React from "react";
import { Text, View } from "react-native";

interface BadgeProps {
    label: string;
    category?: Category;
    size?: "sm" | "md";
}

const categoryColors: Record<Category, { bg: string; text: string }> = {
    "beach-cleanup": { bg: "bg-sky-100", text: "text-sky-700" },
    "tree-planting": { bg: "bg-emerald-100", text: "text-emerald-700" },
    "zero-waste": { bg: "bg-amber-100", text: "text-amber-700" },
    recycling: { bg: "bg-violet-100", text: "text-violet-700" },
    education: { bg: "bg-pink-100", text: "text-pink-700" },
};

export default function Badge({ label, category, size = "sm" }: BadgeProps) {
    const colors = category
        ? categoryColors[category]
        : { bg: "bg-slate-100", text: "text-slate-700" };

    return (
        <View
            className={`self-start rounded-full ${colors.bg} ${size === "sm" ? "px-2.5 py-1" : "px-3.5 py-1.5"
                }`}
        >
            <Text
                className={`font-semibold ${colors.text} ${size === "sm" ? "text-xs" : "text-sm"
                    }`}
            >
                {label}
            </Text>
        </View>
    );
}
