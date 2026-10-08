import { useTranslation } from "react-i18next";
import { InputField } from "@/components/InputField";
import { Button } from "@/components/ui/button";
import { PasswordInputField } from "@/components/PasswordInputField";
import { NavLink } from "react-router";
import { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";

export function ForgotPasswordPage() {
    const { t } = useTranslation();
    const forgotPasswordTitle = t("auth.forgotPassword.title");
    const emailLabel = t("auth.forgotPassword.email");
    const submitButtonLabel = t("auth.forgotPassword.submit");
    const [email, setEmail] = useState("");
    const goToLoginLabel = t("auth.forgotPassword.backToLogin");

    return (
        <main>
            <NavLink
                to="/login"
                className="text-sm text-foreground inline-flex mb-5 hover:underline"
            >
                <ArrowLeftIcon className="w-4 h-4 mr-2" /> {goToLoginLabel}
            </NavLink>
            <form className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold">{forgotPasswordTitle}</h2>
                <InputField
                    label={emailLabel}
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Button type="submit" className="mt-4">
                    {submitButtonLabel}
                </Button>
            </form>
        </main>
    );
}
