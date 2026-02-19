import { Search, X } from "lucide-react-native";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}

export default function SearchBar({
    value,
    onChangeText,
    placeholder = "Rechercher une mission...",
}: SearchBarProps) {
    return (
        <View className="mx-4 mb-4 flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 py-3">
            <Search size={20} color="#94A3B8" />
            <TextInput
                className="flex-1 ml-3 text-base text-slate-800"
                placeholder={placeholder}
                placeholderTextColor="#94A3B8"
                value={value}
                onChangeText={onChangeText}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
            />
            {value.length > 0 && (
                <TouchableOpacity onPress={() => onChangeText("")} activeOpacity={0.7}>
                    <X size={18} color="#94A3B8" />
                </TouchableOpacity>
            )}
        </View>
    );
}
