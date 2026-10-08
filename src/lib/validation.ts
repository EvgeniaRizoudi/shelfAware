import { z } from "zod";

export const emailField = z.string().min(1, "validation.required").email("validation.email");
export const passwordRules = [
    { key: "validation.password.minLength", test: (v: string) => v.length >= 8 },
    { key: "validation.password.lowercase", test: (v: string) => /[a-z]/.test(v) },
    { key: "validation.password.uppercase", test: (v: string) => /[A-Z]/.test(v) },
    { key: "validation.password.number", test: (v: string) => /\d/.test(v) },
    { key: "validation.password.symbol", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

// Use for new passwords (register, reset)
export const newPasswordField = passwordRules.reduce(
    (schema, rule) => schema.refine(rule.test, rule.key),
    z.string(),
);

export const requiredField = z.string().trim().min(1, "validation.required");

export function getPasswordStrength(password: string) {
    return passwordRules.filter((rule) => rule.test(password)).length; // 0–5
}
