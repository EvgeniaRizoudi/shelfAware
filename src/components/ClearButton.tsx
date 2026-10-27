import { XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

type ClearButtonProps = {
    onClear: () => void;
};

// Sits on top of a select, to the left of its arrow
export function ClearButton({ onClear }: ClearButtonProps) {
    const { t } = useTranslation();

    return (
        <button
            type="button"
            onClick={onClear}
            aria-label={t("auth.clear")}
            className="absolute top-1/2 right-8 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
        >
            <XIcon className="size-4" />
        </button>
    );
}
