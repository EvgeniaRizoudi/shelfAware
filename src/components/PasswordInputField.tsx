import { useEffect, useRef, useState } from "react";
import { EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";

type PasswordInputFieldProps = React.ComponentProps<typeof InputGroupInput> & {
    label: string;
    error?: string;
    clearable?: boolean;
};

export function PasswordInputField({
    label,
    id,
    error,
    clearable,
    ref,
    ...inputProps
}: PasswordInputFieldProps) {
    const { t } = useTranslation();
    const [show, setShow] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [hasValue, setHasValue] = useState(false);

    useEffect(() => {
        setHasValue(inputRef.current?.value !== "");
    });

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
                    type={show ? "text" : "password"}
                    {...inputProps}
                    ref={setRefs}
                    onInput={(event) => {
                        setHasValue(event.currentTarget.value !== "");
                        inputProps.onInput?.(event);
                    }}
                    aria-invalid={!!error}
                />
                <InputGroupAddon align="inline-end">
                    {clearable && hasValue && (
                        <InputGroupButton
                            type="button"
                            onClick={clear}
                            aria-label={t("auth.clear")}
                        >
                            <XIcon />
                        </InputGroupButton>
                    )}
                    <InputGroupButton
                        type="button"
                        onClick={() => setShow(!show)}
                        aria-label={t(show ? "auth.password.hide" : "auth.password.show")}
                    >
                        {show ? <EyeIcon /> : <EyeOffIcon />}
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
            <FieldDescription
                className={cn("min-h-4 text-xs leading-4", error && "text-destructive")}
            >
                {error}
            </FieldDescription>
        </Field>
    );
}
