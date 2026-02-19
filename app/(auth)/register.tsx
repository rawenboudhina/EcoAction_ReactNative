import Button from "@/components/ui/Button";
import { useAuthContext } from "@/contexts/AuthContext";
import type { ApiError } from "@/types";
import { useRouter } from "expo-router";
import { Eye, EyeOff, Lock, Mail, User, UserPlus } from "lucide-react-native";
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

export default function RegisterScreen() {
    const router = useRouter();
    const { register } = useAuthContext();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Erreur", "Le mot de passe doit contenir au moins 6 caractères");
            return;
        }

        setIsLoading(true);
        try {
            await register({ name: name.trim(), email: email.trim(), password });
        } catch (err) {
            const error = err as ApiError;
            Alert.alert("Erreur", error.message || "Une erreur est survenue");
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
                <View className="bg-teal-500 pt-20 pb-12 px-8 rounded-b-[40px]">
                    <View className="items-center mb-6">
                        <View className="bg-white/20 rounded-full p-4 mb-4">
                            <UserPlus size={40} color="#FFFFFF" />
                        </View>
                        <Text className="text-3xl font-bold text-white">Rejoignez-nous</Text>
                        <Text className="text-teal-100 text-base mt-2 text-center">
                            Créez votre compte et commencez à agir 🌱
                        </Text>
                    </View>
                </View>

                {/* Form */}
                <View className="px-6 pt-8 pb-6 flex-1">
                    <Text className="text-2xl font-bold text-slate-800 mb-2">
                        Inscription
                    </Text>
                    <Text className="text-slate-500 mb-8">
                        Quelques infos pour commencer
                    </Text>

                    {/* Name */}
                    <View className="mb-4">
                        <Text className="text-sm font-semibold text-slate-700 mb-2">
                            Nom complet
                        </Text>
                        <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 py-3.5">
                            <User size={20} color="#94A3B8" />
                            <TextInput
                                className="flex-1 ml-3 text-base text-slate-800"
                                placeholder="Votre nom"
                                placeholderTextColor="#94A3B8"
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                        </View>
                    </View>

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
                                placeholder="Minimum 6 caractères"
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

                    {/* Register button */}
                    <Button
                        title="Créer mon compte"
                        onPress={handleRegister}
                        isLoading={isLoading}
                        size="lg"
                    />

                    {/* Login link */}
                    <View className="flex-row items-center justify-center mt-6">
                        <Text className="text-slate-500">Déjà un compte ? </Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text className="text-teal-500 font-bold">Se connecter</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
