import { useTranslation } from "react-i18next";
import { InputField } from "@/components/InputField";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router";
import { requiredField, emailField } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { forgotPassword } from "../authApi";

const forgotPasswordSchema = z.object({
    email: emailField.pipe(requiredField),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
    const { t } = useTranslation();
    const forgotPasswordTitle = t("auth.forgotPassword.title");
    const emailLabel = t("auth.forgotPassword.email");
    const submitButtonLabel = t("auth.forgotPassword.submit");
    const goToLoginLabel = t("auth.forgotPassword.backToLogin");
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "onTouched",
    });

    const forgotPasswordMutation = useMutation({
        mutationFn: forgotPassword,
        onSuccess: () => toast.success(t("auth.forgotPassword.sent")),
    });

    function onSubmit(values: ForgotPasswordValues) {
        forgotPasswordMutation.mutate(values);
    }

    return (
        <main>
            <NavLink
                to="/login"
                className="text-sm text-foreground inline-flex mb-5 hover:underline"
            >
                <ArrowLeftIcon className="w-4 h-4 mr-2" /> {goToLoginLabel}
            </NavLink>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                <h2 className="mb-6 text-2xl font-bold">{forgotPasswordTitle}</h2>
                <InputField
                    label={emailLabel}
                    id="email"
                    type="email"
                    {...register("email")}
                    error={errors.email?.message && t(errors.email.message)}
                />

                <Button
                    type="submit"
                    className="mt-4"
                    disabled={forgotPasswordMutation.isPending}
                >
                    {submitButtonLabel}
                </Button>
            </form>
        </main>
    );
}
