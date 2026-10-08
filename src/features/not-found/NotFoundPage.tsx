import logoSvg from "@/assets/brand/shelf-aware-logo-404.svg?raw";
import { useTranslation } from "react-i18next";

export function NotFoundPage() {
    const { t } = useTranslation();
    const notFoundTitle = t("notFound.title");
    const notFoundMessage = t("notFound.message");

    return (
        <main className="flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-foreground p-4 text-background">
            {/* inline (not <img>) so the apple can roll past the logo to the screen edge */}
            <div
                className="w-full max-w-5xl [&>svg]:h-auto [&>svg]:w-full"
                dangerouslySetInnerHTML={{ __html: logoSvg }}
            />
            <h2 className="text-3xl text-secondary">{notFoundTitle}</h2>
            <p className="text-sm tracking-[0.2em] text-sidebar-primary">{notFoundMessage}</p>
        </main>
    );
}
