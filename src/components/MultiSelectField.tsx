import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { SelectOption, SelectOptionGroup } from "@/components/SelectField";
import { ClearButton } from "@/components/ClearButton";
import { cn } from "@/lib/utils";

type MultiSelectFieldProps = {
    label: string;
    id: string;
    value: string[];
    onValueChange: (value: string[]) => void;
    options?: SelectOption[];
    groups?: SelectOptionGroup[];
    placeholder?: string;
    hint?: string;
    error?: string;
    disabled?: boolean;
};

export function MultiSelectField({
    label,
    id,
    value,
    onValueChange,
    options = [],
    groups = [],
    placeholder,
    hint,
    error,
    disabled,
}: MultiSelectFieldProps) {
    const allOptions = [...options, ...groups.flatMap((group) => group.options)];
    const selectedLabels = allOptions
        .filter((option) => value.includes(option.value))
        .map((option) => option.label);

    function toggle(optionValue: string, checked: boolean) {
        onValueChange(
            checked ? [...value, optionValue] : value.filter((item) => item !== optionValue),
        );
    }

    function renderOption(option: SelectOption) {
        return (
            <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
            >
                <Checkbox
                    checked={value.includes(option.value)}
                    onCheckedChange={(checked) => toggle(option.value, checked === true)}
                />
                {option.label}
            </label>
        );
    }

    return (
        <Field data-invalid={!!error}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <div className="relative">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id={id}
                            type="button"
                            variant="outline"
                            className="w-full justify-between font-normal"
                            aria-invalid={!!error}
                            disabled={disabled}
                        >
                            <span className="truncate">
                                {selectedLabels.length > 0 ? selectedLabels.join(", ") : placeholder}
                            </span>
                            <ChevronDownIcon className="size-4 text-muted-foreground" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="max-h-72 w-(--radix-popover-trigger-width) overflow-y-auto p-2">
                        {options.map(renderOption)}
                        {groups.map((group) => (
                            <div key={group.label}>
                                <p className="px-2 py-1.5 text-xs text-muted-foreground">
                                    {group.label}
                                </p>
                                {group.options.map(renderOption)}
                            </div>
                        ))}
                    </PopoverContent>
                </Popover>
                {value.length > 0 && <ClearButton onClear={() => onValueChange([])} />}
            </div>
            <FieldDescription
                className={cn("min-h-4 text-xs leading-4", error && "text-destructive")}
            >
                {error || hint}
            </FieldDescription>
        </Field>
    );
}
