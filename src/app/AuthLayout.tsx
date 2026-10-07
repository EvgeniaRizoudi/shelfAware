import { Outlet } from "react-router";
import logo from "@/assets/brand/shelf-aware-logo-animated.svg";
import { useTranslation } from "react-i18next";
import { TranslationButtonGroup } from "@/components/TranslationButtonGroup";

export function AuthLayout() {
    const { t } = useTranslation();
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <aside className="hidden flex-col items-center justify-center gap-6 bg-sidebar lg:flex">
                <img src={logo} alt="ShelfAware" className="w-4/5 max-w-xl" />
                <p className="text-sm tracking-[0.2em] text-sidebar-primary ">
                    {t("auth.tagline")}
                </p>
            </aside>

            <main className="relative flex items-center justify-center p-6">
                <div className="w-full max-w-sm">
                    <Outlet />
                </div>
                <div className="absolute bottom-6">
                    <TranslationButtonGroup />
                </div>
            </main>
        </div>
    );
}
