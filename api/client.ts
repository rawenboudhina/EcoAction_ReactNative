import { ApiError } from "@/types";
import { Platform } from "react-native";

// Android emulator uses 10.0.2.2 to reach host machine's localhost
// iOS simulator and web use localhost directly
const getBaseUrl = (): string => {
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
