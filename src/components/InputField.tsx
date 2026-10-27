import { useRef, useState } from "react";
import { XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

type InputFieldProps = React.ComponentProps<typeof InputGroupInput> & {
    label: string;
    hint?: string;
    error?: string;
};

export function InputField({ label, hint, id, error, ref, ...inputProps }: InputFieldProps) {
    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [hasValue, setHasValue] = useState(false);

    // react-hook-form also needs the ref, so we hand the element to both
    function setRefs(element: HTMLInputElement | null) {
        inputRef.current = element;
        if (typeof ref === "function") ref(element);
        else if (ref) ref.current = element;
    }

    // Empties the input like a user would, so react-hook-form notices the change
    function clear() {
        const input = inputRef.current;
        if (!input) return;
        const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
        setValue?.call(input, "");
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.focus();
    }

    return (
        <Field data-invalid={!!error}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <InputGroup>
                <InputGroupInput
                    id={id}
                    {...inputProps}
                    ref={setRefs}
                    onInput={(event) => setHasValue(event.currentTarget.value !== "")}
                    aria-invalid={!!error}
                />
                {hasValue && (
                    <InputGroupAddon align="inline-end">
                        <InputGroupButton
                            type="button"
                            onClick={clear}
                            aria-label={t("auth.clear")}
                        >
                            <XIcon />
                        </InputGroupButton>
                    </InputGroupAddon>
                )}
            </InputGroup>
            <FieldDescription
                className={cn("min-h-4 text-xs leading-4", error && "text-destructive")}
            >
                {error || hint}
            </FieldDescription>
        </Field>
    );
}
