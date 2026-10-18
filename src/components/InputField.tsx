import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type InputFieldProps = React.ComponentProps<typeof Input> & {
    label: string;
    hint?: string;
    error?: string;
};

export function InputField({ label, hint, id, error, ...inputProps }: InputFieldProps) {
    return (
        <Field data-invalid={!!error}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <Input id={id} {...inputProps} aria-invalid={!!error} />
            <FieldDescription
                className={cn("min-h-4 text-xs leading-4", error && "text-destructive")}
            >
                {error || hint}
            </FieldDescription>
        </Field>
    );
}
