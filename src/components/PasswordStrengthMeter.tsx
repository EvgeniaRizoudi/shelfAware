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

export function PasswordStrengthMeter({ password }: { password: string }) {
    const { t } = useTranslation();
    if (!password) return null;

    const score = getPasswordStrength(password);
    // Map 0–5 passed rules onto 4 levels
    const level =
        levels[Math.max(0, Math.ceil((score / passwordRules.length) * levels.length) - 1)];
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
                            {t(rule.key)}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
