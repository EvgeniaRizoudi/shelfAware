import { useCurrentUser } from "@/features/auth/useCurrentUser";
import { Navigate, Outlet } from "react-router";

export const ProtectedRoute = () => {
    const { data: currentUser, isPending } = useCurrentUser();

    if (isPending) {
        return <div>Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
