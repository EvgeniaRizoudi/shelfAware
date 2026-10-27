import { api } from "@/lib/api";

export async function login(payload: { email: string; password: string }) {
    const { data } = await api.post("/api/auth/login", payload);
    return data;
}

export async function forgotPassword(payload: { email: string }) {
    await api.post("/api/auth/forgot-password", payload);
}

export async function resetPassword(payload: { token: string; password: string }) {
    await api.post("/api/auth/reset-password", payload);
}

export async function logout() {
    await api.post("/api/auth/logout");
}
