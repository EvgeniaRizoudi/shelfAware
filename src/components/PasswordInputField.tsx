import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
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
};

export function PasswordInputField({ label, id, error, ...inputProps }: PasswordInputFieldProps) {
    const { t } = useTranslation();
    const [show, setShow] = useState(false);

    return (
        <Field data-invalid={!!error}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <InputGroup>
                <InputGroupInput
                    id={id}
                    type={show ? "text" : "password"}
                    {...inputProps}
                    aria-invalid={!!error}
                />
                <InputGroupAddon align="inline-end">
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
