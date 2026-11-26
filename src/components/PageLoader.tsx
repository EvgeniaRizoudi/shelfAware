import loaderSvg from "@/assets/brand/shelf-aware-loader.svg?raw";
import { useTranslation } from "react-i18next";

// Full-page loading screen: the A-shelf logo with items dropping onto it, looping.
// Like <Spinner /> in Vue: use it anywhere something is still loading.
// `leaving` = play the exit animation (zoom in while fading out).
export const PageLoader = ({ leaving = false }: { leaving?: boolean }) => {
    const { t } = useTranslation();

    return (
        // role="status" tells screen readers "something is loading"
        <div role="status" className="flex min-h-svh w-full items-center justify-center">
            {/* keyframes live here, so this component is self-contained (classes start with pl-) */}
            <style>{`
                @media (prefers-reduced-motion: no-preference) {
                    .pl-enter { animation: pl-fade-in 0.5s ease-out both; }
                    .pl-leave { animation: pl-zoom-out 0.6s ease-in forwards; }
                }
                @keyframes pl-fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes pl-zoom-out { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(2.4); } }
            `}</style>
            {/* the SVG is pasted inline (like v-html in Vue) so its CSS animation runs and uses our theme colours */}
            <div
                aria-hidden="true"
                className={`w-28 sm:w-36 [&>svg]:h-auto [&>svg]:w-full ${leaving ? "pl-leave" : "pl-enter"}`}
                dangerouslySetInnerHTML={{ __html: loaderSvg }}
            />
            {/* sr-only = visible only to screen readers */}
            <span className="sr-only">{t("general.loading")}</span>
        </div>
    );
};
