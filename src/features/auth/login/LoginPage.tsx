import { useTranslation } from "react-i18next";
import { InputField } from "@/components/InputField";
import { Button } from "@/components/ui/button";
import { PasswordInputField } from "@/components/PasswordInputField";
import { NavLink, useNavigate } from "react-router";
import { emailField, requiredField } from "@/lib/validation";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { login } from "../authApi";

const loginSchema = z.object({
    email: emailField.pipe(requiredField),
    password: requiredField,
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const loginTitle = t("auth.login.title");
    const emailLabel = t("auth.login.email");
    const passwordLabel = t("auth.login.password");
    const goToRegisterLabel = t("auth.login.register");
    const submitButtonLabel = t("auth.login.submit");
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        mode: "onTouched",
    });
    const forgotPasswordLabel = t("auth.login.forgotPassword");

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: () => {
            toast.success(t("toasts.loginSuccess"));
            navigate("/");
        },
        onError: (error) => {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                setError("email", { message: "validation.invalid_credentials" });
                setError("password", { message: "validation.invalid_credentials" });
                toast.error(t("validation.invalid_credentials"));
            }
        },
    });

    function onSubmit(values: LoginValues) {
        loginMutation.mutate(values);
    }

    return (
        <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2 className="mb-6 text-2xl font-bold">{loginTitle}</h2>
            <InputField
                label={emailLabel}
                id="email"
                type="email"
                {...register("email")}
                error={errors.email?.message && t(errors.email.message)}
            />
            <PasswordInputField
                label={passwordLabel}
                id="password"
                {...register("password")}
                error={errors.password?.message && t(errors.password.message)}
            />

            <Button type="submit" className="mt-4" disabled={loginMutation.isPending}>
                {submitButtonLabel}
            </Button>
            <NavLink
                to="/forgot-password"
                className="text-sm text-foreground underline hover:text-primary "
            >
                {forgotPasswordLabel}
            </NavLink>
            <NavLink
                to="/register"
                className="text-sm text-foreground underline hover:text-primary "
            >
                {goToRegisterLabel}
            </NavLink>
        </form>
    );
}
