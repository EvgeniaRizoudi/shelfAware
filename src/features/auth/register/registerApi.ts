import { api } from "@/lib/api";

export type Department = {
    id: number;
    name: string;
    parentId: number | null;
    roles: { id: number; name: string }[];
    positions: { id: number; name: string }[];
};

export type RegisterPayload = {
    name: string;
    email: string;
    password: string;
    positionIds: number[];
    departmentRoles: { departmentId: number; roleId: number }[];
};

export async function fetchDepartments() {
    const { data } = await api.get<Department[]>("/api/departments");
    return data;
}

export async function registerUser(payload: RegisterPayload) {
    const { data } = await api.post("/api/auth/register", payload);
    return data;
}
