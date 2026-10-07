import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";

type InputFieldProps = React.ComponentProps<typeof Input> & {
    label: string;
    hint?: string;
};

export function InputField({ label, hint, id, ...inputProps }: InputFieldProps) {
    return (
        <Field>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <Input id={id} {...inputProps} />
            {hint && <FieldDescription>{hint}</FieldDescription>}
        </Field>
    );
}
