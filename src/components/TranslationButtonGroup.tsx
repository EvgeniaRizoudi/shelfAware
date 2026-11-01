import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useTranslation } from "react-i18next";

type TranslationButtonGroupProps = {
    className?: string;
};

export function TranslationButtonGroup({ className }: TranslationButtonGroupProps) {
    const { t, i18n } = useTranslation();
    const current = i18n.resolvedLanguage;

    return (
        <ButtonGroup className={className}>
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
