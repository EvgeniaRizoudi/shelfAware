import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPasswordStrength, passwordRules } from "@/lib/validation";

const levels = [
    { label: "validation.strength.weak", color: "bg-error" },
    { label: "validation.strength.fair", color: "bg-warning" },
    { label: "validation.strength.good", color: "bg-blue-600" },
    { label: "validation.strength.strong", color: "bg-success" },
];

// Rules passed (0-5) → index in levels. Strong only when every rule passes.
const levelForScore = [0, 0, 1, 1, 2, 3];

export function PasswordStrengthMeter({ password }: { password: string }) {
    const { t } = useTranslation();
    if (!password) return null;

    const score = getPasswordStrength(password);
    const level = levels[levelForScore[score]];
    const filledBars = levels.indexOf(level) + 1;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-1">
                {levels.map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "h-1.5 flex-1 rounded-full bg-muted",
                            i < filledBars && level.color,
                        )}
                    />
                ))}
            </div>
            <p className="text-sm text-muted-foreground">{t(level.label)}</p>
            <ul className="flex flex-col gap-1 text-sm">
                {passwordRules.map((rule) => {
                    const passed = rule.test(password);
                    return (
                        <li
                            key={rule.key}
                            className={cn(
                                "flex items-center gap-2",
                                passed ? "text-green-600" : "text-muted-foreground",
                            )}
                        >
                            {passed ? <Check className="size-4" /> : <X className="size-4" />}
                            {t(rule.key, { min: rule.min })}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
