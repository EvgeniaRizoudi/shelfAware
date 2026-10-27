import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { PasswordInputField } from "@/components/PasswordInputField";
import { InputField } from "@/components/InputField";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";
import { MultiSelectField } from "@/components/MultiSelectField";
import { SelectField } from "@/components/SelectField";
import { emailField, newPasswordField, PASSWORD_MIN_LENGTH, requiredField } from "@/lib/validation";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NavLink, useNavigate } from "react-router";
import { fetchDepartments, registerUser } from "./registerApi";
import {
    buildDepartmentRoles,
    getDepartmentChoices,
    getPositionOptions,
    getRoleChoices,
} from "./registerOptions";

const registerSchema = z.object({
    name: requiredField,
    email: emailField.pipe(requiredField),
    password: newPasswordField,
    departmentIds: z.array(z.string()).min(1, "validation.required"),
    roleKeys: z.array(z.string()).min(1, "validation.required"),
    positionId: requiredField,
});

type registerValues = z.infer<typeof registerSchema>;

// backend error key -> form field
const fieldByApiKey = {
    name: "name",
    email: "email",
    password: "password",
    positionIds: "positionId",
    departmentRoles: "roleKeys",
} as const;

export function RegisterPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const registerTitle = t("auth.register.title");
    const nameLabel = t("auth.register.name");
    const emailLabel = t("auth.register.email");
    const positionsLabel = t("auth.register.positions");
    const departmentLabel = t("auth.register.department");
    const roleLabel = t("auth.register.roles");
    const placeholder = t("auth.register.placeholder");
    const generalLabel = t("auth.register.general");
    const chooseDepartmentHint = t("auth.register.chooseDepartmentFirst");
    const goToLoginLabel = t("auth.register.alreadyUser");
    const newPasswordLabel = t("auth.register.password");
    const submitButtonLabel = t("auth.register.submit");
    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
    } = useForm<registerValues>({
        resolver: zodResolver(registerSchema),
        mode: "onTouched",
        defaultValues: { departmentIds: [], roleKeys: [], positionId: "" },
    });
    const password = useWatch({ control, name: "password" }) ?? "";
    const departmentIds = useWatch({ control, name: "departmentIds" });

    const { data: departments = [] } = useQuery({
        queryKey: ["departments"],
        queryFn: fetchDepartments,
    });

    const registerMutation = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            toast.success(t("toasts.registerSuccess"));
            navigate("/login");
        },
        onError: (error) => {
            if (!axios.isAxiosError(error) || error.response?.status !== 422) return;
            toast.error(t("errors.validation"));
            const apiErrors: Record<string, string[]> = error.response.data.errors ?? {};
            for (const [key, messages] of Object.entries(apiErrors)) {
                const field = fieldByApiKey[key as keyof typeof fieldByApiKey];
                if (field) setError(field, { message: messages[0] });
            }
        },
    });

    // everything below is derived from the departments the user ticked
    const chosenDepartments = departments.filter((department) =>
        departmentIds.includes(String(department.id)),
    );
    const departmentChoices = getDepartmentChoices(departments);
    const roleChoices = getRoleChoices(chosenDepartments, departments, generalLabel);
    const positionOptions = getPositionOptions(chosenDepartments);

    function onSubmit(values: registerValues) {
        const departmentRoles = buildDepartmentRoles(
            values.roleKeys,
            chosenDepartments,
            departments,
        );
        if (departmentRoles.length === 0) {
            setError("roleKeys", { message: "validation.required" });
            return;
        }
        registerMutation.mutate({
            name: values.name,
            email: values.email,
            password: values.password,
            positionIds: [Number(values.positionId)],
            departmentRoles,
        });
    }

    return (
        <form className="flex flex-col gap-1" onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2 className="mb-6 text-2xl font-bold">{registerTitle}</h2>
            <InputField
                label={nameLabel}
                id="name"
                type="text"
                {...register("name")}
                error={errors.name?.message && t(errors.name.message)}
            />
            <InputField
                label={emailLabel}
                id="email"
                type="email"
                {...register("email")}
                error={errors.email?.message && t(errors.email.message)}
            />
            <Controller
                control={control}
                name="departmentIds"
                render={({ field }) => (
                    <MultiSelectField
                        label={departmentLabel}
                        id="departmentIds"
                        value={field.value}
                        onValueChange={field.onChange}
                        options={departmentChoices.options}
                        groups={departmentChoices.groups}
                        placeholder={placeholder}
                        error={errors.departmentIds?.message && t(errors.departmentIds.message)}
                    />
                )}
            />
            <Controller
                control={control}
                name="roleKeys"
                render={({ field }) => (
                    <MultiSelectField
                        label={roleLabel}
                        id="roleKeys"
                        value={field.value}
                        onValueChange={field.onChange}
                        options={roleChoices.options}
                        groups={roleChoices.groups}
                        placeholder={placeholder}
                        hint={chosenDepartments.length === 0 ? chooseDepartmentHint : undefined}
                        disabled={chosenDepartments.length === 0}
                        error={errors.roleKeys?.message && t(errors.roleKeys.message)}
                    />
                )}
            />
            <Controller
                control={control}
                name="positionId"
                render={({ field }) => (
                    <SelectField
                        label={positionsLabel}
                        id="positionId"
                        value={field.value}
                        onValueChange={field.onChange}
                        options={positionOptions}
                        placeholder={placeholder}
                        hint={chosenDepartments.length === 0 ? chooseDepartmentHint : undefined}
                        disabled={chosenDepartments.length === 0}
                        error={errors.positionId?.message && t(errors.positionId.message)}
                    />
                )}
            />
            <PasswordInputField
                label={newPasswordLabel}
                id="newPassword"
                {...register("password")}
                error={
                    errors.password?.message &&
                    t(errors.password.message, { min: PASSWORD_MIN_LENGTH })
                }
            />
            <PasswordStrengthMeter password={password} />

            <Button type="submit" className="mt-4" disabled={registerMutation.isPending}>
                {submitButtonLabel}
            </Button>
            <NavLink to="/login" className="text-sm text-foreground underline hover:text-primary ">
                {goToLoginLabel}
            </NavLink>
        </form>
    );
}
