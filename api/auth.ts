import type { LoginCredentials, RegisterPayload, User } from "@/types";
import { apiGet, apiPost } from "./client";

export async function login(credentials: LoginCredentials): Promise<User> {
    // JSON-Server: find user by email, then verify password
    const users = await apiGet<User[]>(
        `/users?email=${encodeURIComponent(credentials.email)}`
    );

    if (users.length === 0) {
        throw { message: "Aucun compte trouvé avec cet email", status: 404 };
    }

    const user = users[0];
    if (user.password !== credentials.password) {
        throw { message: "Mot de passe incorrect", status: 401 };
    }

    return user;
}

export async function register(payload: RegisterPayload): Promise<User> {
    // Check if email already exists
    const existing = await apiGet<User[]>(
        `/users?email=${encodeURIComponent(payload.email)}`
    );

    if (existing.length > 0) {
        throw { message: "Un compte avec cet email existe déjà", status: 409 };
    }

    const newUser: Omit<User, "id"> = {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        avatar: `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(payload.name)}`,
        missionsCompleted: 0,
        hoursVolunteered: 0,
        treesPlanted: 0,
    };

    return apiPost<User>("/users", newUser);
}

export async function getUserById(id: string): Promise<User> {
    return apiGet<User>(`/users/${id}`);
}
