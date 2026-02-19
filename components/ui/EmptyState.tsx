import { Inbox } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
}

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
    return (
        <View className="flex-1 items-center justify-center px-8 py-16">
            <View className="bg-slate-100 rounded-full p-4 mb-4">
                {icon || <Inbox size={32} color="#94A3B8" />}
            </View>
            <Text className="text-lg font-bold text-slate-800 mb-2 text-center">
                {title}
            </Text>
            {description && (
                <Text className="text-sm text-slate-500 text-center">{description}</Text>
            )}
        </View>
    );
}
