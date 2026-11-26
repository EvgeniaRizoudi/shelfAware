import { useTranslation } from "react-i18next";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordInputField } from "@/components/PasswordInputField";
import { InputField } from "@/components/InputField";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";
import { MultiSelectField } from "@/components/MultiSelectField";
import { newPasswordField, PASSWORD_MIN_LENGTH, requiredField } from "@/lib/validation";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/features/auth/useCurrentUser";
import { updateProfile } from "./accountApi";

const updateSchema = z
    .object({
        name: requiredField,
        email: z.string().optional(),
        password: newPasswordField.or(z.literal("")).optional(),
        departmentIds: z.array(z.string()),
        roleKeys: z.array(z.string()),
        positionIds: z.array(z.string()),
        confirmPassword: z.string().optional(),
    })
    .refine((values) => (values.password ?? "") === (values.confirmPassword ?? ""), {
        message: "validation.passwordsDontMatch",
        path: ["confirmPassword"],
    });

type updateValues = z.infer<typeof updateSchema>;

// backend error key -> form field
const fieldByApiKey = {
    name: "name",
    email: "email",
    password: "password",
    positionIds: "positionIds",
    departmentRoles: "roleKeys",
} as const;

export function ProfileForm() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { data: currentUser } = useCurrentUser();
    const updateTitle = t("auth.update.title");
    const editableTitle = t("auth.update.editable");
    const viewOnlyTitle = t("auth.update.viewOnly");
    const nameLabel = t("auth.update.name");
    const emailLabel = t("auth.update.email");
    const positionsLabel = t("auth.update.positions");
    const departmentLabel = t("auth.update.department");
    const roleLabel = t("auth.update.roles");
    const placeholder = t("auth.update.placeholder");
    const newPasswordLabel = t("auth.update.password");
    const confirmPasswordLabel = t("auth.update.confirmPassword");
    const submitButtonLabel = t("auth.update.submit");
    const departmentRoles = currentUser?.departmentRoles ?? [];
    const departmentOptions = departmentRoles
        .filter(
            (dr, index) =>
                departmentRoles.findIndex((x) => x.departmentId === dr.departmentId) === index,
        )
        .map((dr) => ({ value: String(dr.departmentId), label: dr.department.name }));
    const roleOptions = departmentRoles.map((dr) => ({
        value: `${dr.departmentId}:${dr.roleId}`,
        label: `${dr.role.name} (${dr.department.name})`,
    }));
    const positionOptions = (currentUser?.positions ?? []).map((position) => ({
        value: String(position.id),
        label: position.name,
    }));
    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
    } = useForm<updateValues>({
        resolver: zodResolver(updateSchema),
        mode: "onTouched",
        defaultValues: { departmentIds: [], roleKeys: [], positionIds: [] },
        values: currentUser && {
            name: currentUser.name,
            email: currentUser.email,
            departmentIds: departmentOptions.map((option) => option.value),
            roleKeys: roleOptions.map((option) => option.value),
            positionIds: positionOptions.map((option) => option.value),
        },
    });
    const password = useWatch({ control, name: "password" }) ?? "";

    const updateMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(["currentUser"], updatedUser);
            toast.success(t("toasts.updateSuccess"));
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

    return (
        <form
            className="flex w-full flex-col gap-8"
            noValidate
            onSubmit={handleSubmit((values) =>
                updateMutation.mutate({
                    name: values.name,
                    password: values.confirmPassword || undefined,
                }),
            )}
        >
            <h2 className="text-xl font-semibold">{updateTitle}</h2>
            <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                <div className="flex flex-col gap-3 rounded-3xl border border-white/50 bg-linear-to-br from-white/50 to-white/10 p-6 shadow-[0_8px_32px_rgba(31,38,135,0.15)] ring-1 ring-white/30 backdrop-blur-2xl backdrop-saturate-150 ring-inset dark:border-white/10 dark:from-white/10 dark:to-white/0">
                    <h3 className="text-sm font-semibold text-muted-foreground">{editableTitle}</h3>
                    <InputField
                        label={nameLabel}
                        id="name"
                        type="text"
                        {...register("name")}
                        error={errors.name?.message && t(errors.name.message)}
                    />
                    <PasswordInputField
                        clearable
                        label={newPasswordLabel}
                        id="newPassword"
                        {...register("password")}
                        error={
                            errors.password?.message &&
                            t(errors.password.message, { min: PASSWORD_MIN_LENGTH })
                        }
                    />
                    <PasswordInputField
                        clearable
                        label={confirmPasswordLabel}
                        id="confirmPassword"
                        {...register("confirmPassword")}
                        error={errors.confirmPassword?.message && t(errors.confirmPassword.message)}
                    />
                    <div className="relative">
                        {/* invisible copy keeps the height, so the card never grows */}
                        <div aria-hidden className="invisible">
                            <PasswordStrengthMeter password="a" />
                        </div>
                        <div className="absolute inset-0">
                            <PasswordStrengthMeter password={password} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-3 rounded-3xl border border-white/50 bg-linear-to-br from-white/50 to-white/10 p-6 shadow-[0_8px_32px_rgba(31,38,135,0.15)] ring-1 ring-white/30 backdrop-blur-2xl backdrop-saturate-150 ring-inset dark:border-white/10 dark:from-white/10 dark:to-white/0">
                    <h3 className="text-sm font-semibold text-muted-foreground">{viewOnlyTitle}</h3>
                    <InputField
                        label={emailLabel}
                        id="email"
                        type="email"
                        disabled
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
                                options={departmentOptions}
                                value={field.value}
                                disabled
                                onValueChange={field.onChange}
                                placeholder={placeholder}
                                error={
                                    errors.departmentIds?.message && t(errors.departmentIds.message)
                                }
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
                                options={roleOptions}
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled
                                placeholder={placeholder}
                                error={errors.roleKeys?.message && t(errors.roleKeys.message)}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="positionIds"
                        render={({ field }) => (
                            <MultiSelectField
                                label={positionsLabel}
                                id="positionIds"
                                options={positionOptions}
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled
                                placeholder={placeholder}
                                error={errors.positionIds?.message && t(errors.positionIds.message)}
                            />
                        )}
                    />
                </div>
            </div>

            <Button type="submit" className="self-center px-10" disabled={updateMutation.isPending}>
                {updateMutation.isPending && <LoaderCircle className="animate-spin" />}
                {submitButtonLabel}
            </Button>
        </form>
    );
}
