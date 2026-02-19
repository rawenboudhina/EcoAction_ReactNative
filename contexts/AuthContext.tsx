import { login as apiLogin, register as apiRegister } from "@/api/auth";
import type { AuthState, LoginCredentials, RegisterPayload, User } from "@/types";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "eco_action_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restore session on mount
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const stored = await SecureStore.getItemAsync(USER_STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored) as User;
                    setUser(parsed);
                }
            } catch {
                // Session expired or corrupted - ignore
            } finally {
                setIsLoading(false);
            }
        };
        restoreSession();
    }, []);

    const login = useCallback(async (credentials: LoginCredentials) => {
        const loggedUser = await apiLogin(credentials);
        setUser(loggedUser);
        await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(loggedUser));
    }, []);

    const register = useCallback(async (payload: RegisterPayload) => {
        const newUser = await apiRegister(payload);
        setUser(newUser);
        await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(newUser));
    }, []);

    const logout = useCallback(async () => {
        setUser(null);
        await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
}
