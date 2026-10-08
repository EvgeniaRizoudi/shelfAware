import { useTranslation } from "react-i18next";
import { InputField } from "@/components/InputField";
import { Button } from "@/components/ui/button";
import { PasswordInputField } from "@/components/PasswordInputField";
import { NavLink } from "react-router";
import { emailField, requiredField } from "@/lib/validation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
    email: emailField,
    password: requiredField,
});

type LoginValues = z.infer<typeof loginSchema>;

function onSubmit(values: LoginValues) {
    console.log(values); // later: call the login API
}

export function LoginPage() {
    const { t } = useTranslation();
    const loginTitle = t("auth.login.title");
    const emailLabel = t("auth.login.email");
    const passwordLabel = t("auth.login.password");
    const submitButtonLabel = t("auth.login.submit");
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        mode: "onTouched",
    });
    const forgotPasswordLabel = t("auth.login.forgotPassword");

    return (
        <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2 className="text-2xl font-bold">{loginTitle}</h2>
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

            <Button type="submit" className="mt-4">
                {submitButtonLabel}
            </Button>
            <NavLink
                to="/forgot-password"
                className="text-sm text-foreground underline hover:text-primary "
            >
                {forgotPasswordLabel}
            </NavLink>
        </form>
    );
}
