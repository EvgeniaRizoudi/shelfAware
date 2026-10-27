import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/features/auth/authApi";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { LogOutIcon } from "lucide-react";

export function LogoutButton() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            toast.success(t("toasts.logoutSuccess"));
            navigate("/login");
        },
        onError: (error) => {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                toast.error(t("errors.network"));
            }
        },
    });
    const buttonLabel = t("auth.logout");
    return (
        <Button type="button" onClick={() => logoutMutation.mutate()}>
            <LogOutIcon />
            {buttonLabel}
        </Button>
    );
}
