import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { PasswordInputField } from "@/components/PasswordInputField";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";
import { newPasswordField, PASSWORD_MIN_LENGTH, requiredField } from "@/lib/validation";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { resetPassword } from "../authApi";

const passwordResetSchema = z
    .object({
        password: newPasswordField,
        confirmPassword: requiredField,
    })
    .refine((values) => values.password === values.confirmPassword, {
        message: "validation.passwordsDontMatch",
        path: ["confirmPassword"],
    });

type PasswordResetValues = z.infer<typeof passwordResetSchema>;

export function PasswordResetPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const passwordResetTitle = t("auth.passwordReset.title");
    const newPasswordLabel = t("auth.passwordReset.newPassword");
    const confirmPasswordLabel = t("auth.passwordReset.confirmNewPassword");
    const submitButtonLabel = t("auth.passwordReset.submit");
    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
    } = useForm<PasswordResetValues>({
        resolver: zodResolver(passwordResetSchema),
        mode: "onTouched",
    });
    const password = useWatch({ control, name: "password" }) ?? "";

    const resetMutation = useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {
            toast.success(t("toasts.passwordResetSuccess"));
            navigate("/login");
        },
        onError: (error) => {
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                setError("password", { message: "auth.passwordReset.invalidToken" });
                setError("confirmPassword", { message: "auth.passwordReset.invalidToken" });
                toast.error(t("auth.passwordReset.invalidToken"));
            }
        },
    });

    function onSubmit(values: PasswordResetValues) {
        resetMutation.mutate({ token, password: values.password });
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2 className="mb-6 text-2xl font-bold">{passwordResetTitle}</h2>
            <PasswordInputField
                label={newPasswordLabel}
                id="newPassword"
                {...register("password")}
                error={
                    errors.password?.message &&
                    t(errors.password.message, { min: PASSWORD_MIN_LENGTH })
                }
            />
            <PasswordStrengthMeter password={password} />
            <PasswordInputField
                label={confirmPasswordLabel}
                id="confirmPassword"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message && t(errors.confirmPassword.message)}
            />

            <Button type="submit" className="mt-4" disabled={resetMutation.isPending}>
                {submitButtonLabel}
            </Button>
        </form>
    );
}
