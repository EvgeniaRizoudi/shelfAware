import { Button } from "./ui/button";
import { CircleUserRound } from "lucide-react";
import { useNavigate } from "react-router";
import { useCurrentUser } from "@/features/auth/useCurrentUser";

export function UserAccountButton() {
    const navigate = useNavigate();
    const { data: currentUser } = useCurrentUser();
    const buttonLabel = currentUser ? currentUser.name : "";

    return (
        <>
            <Button type="button" onClick={() => navigate("/userAccount")}>
                <CircleUserRound />
                {buttonLabel}
            </Button>
        </>
    );
}
