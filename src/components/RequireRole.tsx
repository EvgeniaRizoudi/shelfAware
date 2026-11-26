import { useCurrentUser } from "@/features/auth/useCurrentUser";
import { hasRole } from "@/lib/roles";
import { Navigate, Outlet } from "react-router";

// Wraps pages that only some roles may open (like ProtectedRoute, but for roles).
// Wrong role: send the user back to the dashboard.
export const RequireRole = ({ roles }: { roles: string[] }) => {
    const { data: currentUser } = useCurrentUser();

    if (!hasRole(currentUser, roles)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
