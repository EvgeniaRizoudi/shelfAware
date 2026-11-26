import { api } from "@/lib/api";
import type { CurrentUser } from "@/features/auth/authApi";

// the backend only accepts these two fields (UpdateProfileDto)
export type UpdateProfilePayload = { name?: string; password?: string };

export async function updateProfile(payload: UpdateProfilePayload) {
    const { data } = await api.patch<CurrentUser>("/api/user-update/user", payload);
    return data;
}
