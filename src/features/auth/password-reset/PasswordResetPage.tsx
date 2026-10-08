import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { PasswordInputField } from "@/components/PasswordInputField";
import { useState } from "react";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";

export function PasswordResetPage() {
    const { t } = useTranslation();
    const passwordResetTitle = t("auth.passwordReset.title");
    const newPasswordLabel = t("auth.passwordReset.newPassword");
    const confirmPasswordLabel = t("auth.passwordReset.confirmNewPassword");
    const submitButtonLabel = t("auth.passwordReset.submit");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <form className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">{passwordResetTitle}</h2>
            <PasswordInputField
                label={newPasswordLabel}
                id="newPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordStrengthMeter password={password} />
            <PasswordInputField
                label={confirmPasswordLabel}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button type="submit" className="mt-4">
                {submitButtonLabel}
            </Button>
        </form>
    );
}
