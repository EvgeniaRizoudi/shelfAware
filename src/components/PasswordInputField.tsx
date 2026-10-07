import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Field, FieldLabel } from "@/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";

type PasswordInputFieldProps = React.ComponentProps<typeof InputGroupInput> & {
    label: string;
};

export function PasswordInputField({ label, id, ...inputProps }: PasswordInputFieldProps) {
    const { t } = useTranslation();
    const [show, setShow] = useState(false);

    return (
        <Field>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <InputGroup>
                <InputGroupInput id={id} type={show ? "text" : "password"} {...inputProps} />
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
        </Field>
    );
}
