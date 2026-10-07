import { useTranslation } from "react-i18next";
import { InputField } from "@/components/InputField";
import { Button } from "@/components/ui/button";
import { PasswordInputField } from "@/components/PasswordInputField";
import { useState } from "react";

export function LoginPage() {
    const { t } = useTranslation();
    const loginTitle = t("auth.login.title");
    const emailLabel = t("auth.login.email");
    const passwordLabel = t("auth.login.password");
    const submitButtonLabel = t("auth.login.submit");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return (
        <form className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">{loginTitle}</h2>
            <InputField
                label={emailLabel}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInputField
                label={passwordLabel}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" className="mt-4">
                {submitButtonLabel}
            </Button>
        </form>
    );
}
