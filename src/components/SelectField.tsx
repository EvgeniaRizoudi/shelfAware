import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ClearButton } from "@/components/ClearButton";
import { cn } from "@/lib/utils";

export type SelectOption = { value: string; label: string };
export type SelectOptionGroup = { label: string; options: SelectOption[] };

type SelectFieldProps = {
    label: string;
    id: string;
    value?: string;
    onValueChange: (value: string) => void;
    options?: SelectOption[];
    groups?: SelectOptionGroup[];
    placeholder?: string;
    hint?: string;
    error?: string;
    disabled?: boolean;
};

function renderOption(option: SelectOption) {
    return (
        <SelectItem key={option.value} value={option.value}>
            {option.label}
        </SelectItem>
    );
}

export function SelectField({
    label,
    id,
    value,
    onValueChange,
    options,
    groups,
    placeholder,
    hint,
    error,
    disabled,
}: SelectFieldProps) {
    return (
        <Field data-invalid={!!error}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <div className="relative">
                <Select value={value} onValueChange={onValueChange} disabled={disabled}>
                    <SelectTrigger id={id} className="w-full" aria-invalid={!!error}>
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {options?.map(renderOption)}
                        {groups?.map((group) => (
                            <SelectGroup key={group.label}>
                                <SelectLabel>{group.label}</SelectLabel>
                                {group.options.map(renderOption)}
                            </SelectGroup>
                        ))}
                    </SelectContent>
                </Select>
                {value && <ClearButton onClear={() => onValueChange("")} />}
            </div>
            <FieldDescription
                className={cn("min-h-4 text-xs leading-4", error && "text-destructive")}
            >
                {error || hint}
            </FieldDescription>
        </Field>
    );
}
