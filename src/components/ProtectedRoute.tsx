import { useEffect, useState } from "react";
import { useCurrentUser } from "@/features/auth/useCurrentUser";
import { PageLoader } from "@/components/PageLoader";
import { Navigate, Outlet } from "react-router";

// After a login the loader stays at least this long, so you can enjoy the animation (ms)
const SPLASH_MS = 2900;
const LEAVE_MS = 600; // the zoom-out at the end

export const ProtectedRoute = () => {
    const { data: currentUser, isPending } = useCurrentUser();

    // "show" = play the loader, "leaving" = zoom out, "done" = show the app.
    // The login page leaves a note in sessionStorage; no note (a refresh) = no splash.
    const [phase, setPhase] = useState<"show" | "leaving" | "done">(() =>
        sessionStorage.getItem("showSplash") ? "show" : "done",
    );

    // Like a watch in Vue: when the phase changes, start the next timer
    useEffect(() => {
        if (phase === "show") {
            const timer = setTimeout(() => setPhase("leaving"), SPLASH_MS);
            return () => clearTimeout(timer);
        }
        if (phase === "leaving") {
            const timer = setTimeout(() => {
                sessionStorage.removeItem("showSplash");
                setPhase("done");
            }, LEAVE_MS);
            return () => clearTimeout(timer);
        }
    }, [phase]);

    if (isPending) {
        return <PageLoader />;
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (phase !== "done") {
        return <PageLoader leaving={phase === "leaving"} />;
    }

    return <Outlet />;
};
