import React from "react";
import { Text, View } from "react-native";

interface StatCardProps {
    icon: React.ReactNode;
    value: number;
    label: string;
    color: string;
}

export default function StatCard({ icon, value, label, color }: StatCardProps) {
    return (
        <View
            className="bg-white rounded-2xl p-4 flex-1 items-center"
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
            }}
        >
            <View
                className="rounded-full p-2.5 mb-2"
                style={{ backgroundColor: `${color}15` }}
            >
                {icon}
            </View>
            <Text className="text-2xl font-bold text-slate-800">{value}</Text>
            <Text className="text-xs text-slate-500 mt-1 text-center">{label}</Text>
        </View>
    );
}
