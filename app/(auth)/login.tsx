import Button from "@/components/ui/Button";
import { useAuthContext } from "@/contexts/AuthContext";
import type { ApiError } from "@/types";
import { useRouter } from "expo-router";
import { Eye, EyeOff, Leaf, Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuthContext();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs");
            return;
        }

        setIsLoading(true);
        try {
            await login({ email: email.trim(), password });
        } catch (err) {
            const error = err as ApiError;
            Alert.alert("Erreur de connexion", error.message || "Une erreur est survenue");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                className="flex-1 bg-slate-50"
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Hero section */}
                <View className="bg-emerald-500 pt-20 pb-12 px-8 rounded-b-[40px]">
                    <View className="items-center mb-6">
                        <View className="bg-white/20 rounded-full p-4 mb-4">
                            <Leaf size={40} color="#FFFFFF" />
                        </View>
                        <Text className="text-3xl font-bold text-white">EcoAction</Text>
                        <Text className="text-emerald-100 text-base mt-2 text-center">
                            Agissons ensemble pour la planète 🌍
                        </Text>
                    </View>
                </View>

                {/* Form */}
                <View className="px-6 pt-8 pb-6 flex-1">
                    <Text className="text-2xl font-bold text-slate-800 mb-2">
                        Connexion
                    </Text>
                    <Text className="text-slate-500 mb-8">
                        Heureux de vous revoir !
                    </Text>

                    {/* Email */}
                    <View className="mb-4">
                        <Text className="text-sm font-semibold text-slate-700 mb-2">
                            Email
                        </Text>
                        <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 py-3.5">
                            <Mail size={20} color="#94A3B8" />
                            <TextInput
                                className="flex-1 ml-3 text-base text-slate-800"
                                placeholder="votre@email.com"
                                placeholderTextColor="#94A3B8"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                    </View>

                    {/* Password */}
                    <View className="mb-8">
                        <Text className="text-sm font-semibold text-slate-700 mb-2">
                            Mot de passe
                        </Text>
                        <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 py-3.5">
                            <Lock size={20} color="#94A3B8" />
                            <TextInput
                                className="flex-1 ml-3 text-base text-slate-800"
                                placeholder="••••••••"
                                placeholderTextColor="#94A3B8"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                activeOpacity={0.7}
                            >
                                {showPassword ? (
                                    <EyeOff size={20} color="#94A3B8" />
                                ) : (
                                    <Eye size={20} color="#94A3B8" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Login button */}
                    <Button
                        title="Se connecter"
                        onPress={handleLogin}
                        isLoading={isLoading}
                        size="lg"
                    />

                    {/* Register link */}
                    <View className="flex-row items-center justify-center mt-6">
                        <Text className="text-slate-500">Pas encore de compte ? </Text>
                        <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
                            <Text className="text-emerald-500 font-bold">S'inscrire</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
