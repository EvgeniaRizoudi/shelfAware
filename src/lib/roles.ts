import type { CurrentUser } from "@/features/auth/authApi";

export function hasRole(user: CurrentUser | undefined, allowed: string[]) {
    if (!user) return false;
    return user.departmentRoles.some((departmentRole) =>
        allowed.includes(departmentRole.role.name),
    );
}

// Roles that may open Stock and Suppliers. Used by the menu and by the route guard.
export const MANAGER_ROLES = ["admin", "storekeeper", "Kitchen Manager", "Service Manager"];
