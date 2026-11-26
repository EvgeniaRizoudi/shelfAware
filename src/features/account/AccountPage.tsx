import { useTranslation } from "react-i18next";
import { ProfileForm } from "./ProfileForm";

export function AccountPage() {
    const { t } = useTranslation();
    return (
        <div className="relative isolate mx-auto flex w-full max-w-3xl flex-col gap-10 py-8">
            <h1 className="text-3xl font-bold">{t("account.title")}</h1>
            <ProfileForm />
        </div>
    );
}
