import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { PasswordInputField } from "@/components/PasswordInputField";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";
import { newPasswordField, PASSWORD_MIN_LENGTH, requiredField } from "@/lib/validation";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

function onSubmit(values: PasswordResetValues) {
    console.log(values); // later: call the password reset API
}

export function PasswordResetPage() {
    const { t } = useTranslation();
    const passwordResetTitle = t("auth.passwordReset.title");
    const newPasswordLabel = t("auth.passwordReset.newPassword");
    const confirmPasswordLabel = t("auth.passwordReset.confirmNewPassword");
    const submitButtonLabel = t("auth.passwordReset.submit");
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<PasswordResetValues>({
        resolver: zodResolver(passwordResetSchema),
        mode: "onTouched",
    });
    const password = useWatch({ control, name: "password" }) ?? "";

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2 className="text-2xl font-bold">{passwordResetTitle}</h2>
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

            <Button type="submit" className="mt-4">
                {submitButtonLabel}
            </Button>
        </form>
    );
}
