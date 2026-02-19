import { AlertTriangle } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import Button from "./Button";

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export default function ErrorState({
    message = "Une erreur est survenue",
    onRetry,
}: ErrorStateProps) {
    return (
        <View className="flex-1 items-center justify-center px-8 py-16">
            <View className="bg-red-50 rounded-full p-4 mb-4">
                <AlertTriangle size={32} color="#EF4444" />
            </View>
            <Text className="text-lg font-bold text-slate-800 mb-2 text-center">
                Oops !
            </Text>
            <Text className="text-sm text-slate-500 text-center mb-6">{message}</Text>
            {onRetry && (
                <Button title="Réessayer" variant="outline" size="sm" onPress={onRetry} />
            )}
        </View>
    );
}
