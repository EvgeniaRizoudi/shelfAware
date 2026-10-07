import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useTranslation } from "react-i18next";

export function TranslationButtonGroup() {
    const { t, i18n } = useTranslation();
    const current = i18n.resolvedLanguage;

    return (
        <ButtonGroup className="w-32 align-end justify-end">
            <Button
                variant={current === "el" ? "default" : "secondary"}
                aria-pressed={current === "el"}
                size="sm"
                onClick={() => i18n.changeLanguage("el")}
            >
                {t("general.translation.el")}
            </Button>
            <Button
                variant={current === "en" ? "default" : "secondary"}
                aria-pressed={current === "en"}
                size="sm"
                onClick={() => i18n.changeLanguage("en")}
            >
                {t("general.translation.en")}
            </Button>
        </ButtonGroup>
    );
}
