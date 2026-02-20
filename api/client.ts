import { ApiError } from "@/types";
import Constants from "expo-constants";
import { Platform } from "react-native";

// Automatically detect the correct API host:
// - Physical device via Expo Go → uses the dev machine IP from Expo's hostUri
// - Android emulator → 10.0.2.2
// - iOS simulator / Web → localhost
const getBaseUrl = (): string => {
    // Expo Go provides the dev machine IP via hostUri (e.g. "192.168.0.120:8081")
    const expoHost = Constants.expoConfig?.hostUri;
    if (expoHost) {
        const ip = expoHost.split(":")[0];
        return `http://${ip}:3000`;
    }

    if (Platform.OS === "android") {
        return "http://10.0.2.2:3000";
    }
    return "http://localhost:3000";
};

export const BASE_URL = getBaseUrl();


async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error: ApiError = {
            message: `Request failed: ${response.statusText}`,
            status: response.status,
        };
        throw error;
    }
    return response.json() as Promise<T>;
}

export async function apiGet<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    return handleResponse<T>(response);
}

export async function apiPost<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
}

export async function apiPatch<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
}

export async function apiDelete(endpoint: string): Promise<void> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        const error: ApiError = {
            message: `Delete failed: ${response.statusText}`,
            status: response.status,
        };
        throw error;
    }
}
