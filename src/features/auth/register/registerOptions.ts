import type { SelectOption, SelectOptionGroup } from "@/components/SelectField";
import type { Department, RegisterPayload } from "./registerApi";

// admin and storekeeper apply to every department, so they are listed once
const JOKER_ROLE_IDS = [1, 6];
const JOKER_PREFIX = "all";

function toOption(department: Department): SelectOption {
    return { value: String(department.id), label: department.name };
}

// Departments with children become a group, the others stay as flat options
export function getDepartmentChoices(departments: Department[]) {
    const options: SelectOption[] = [];
    const groups: SelectOptionGroup[] = [];

    for (const root of departments.filter((department) => department.parentId === null)) {
        const children = departments.filter((department) => department.parentId === root.id);
        if (children.length === 0) {
            options.push(toOption(root));
        } else {
            groups.push({ label: root.name, options: children.map(toOption) });
        }
    }
    return { options, groups };
}

// The top level department of each chosen one (a root is its own root)
function getChosenRoots(chosen: Department[], all: Department[]) {
    const roots = chosen.map((department) => all.find((d) => d.id === department.parentId) ?? department);
    return roots.filter((root, index) => roots.indexOf(root) === index);
}

// Joker roles come from the roots, because the backend only allows a role
// in a department that lists it (children do not list admin or storekeeper)
function getJokerRoles(roots: Department[]) {
    const jokers = new Map<number, string>();
    for (const root of roots) {
        for (const role of root.roles) {
            if (JOKER_ROLE_IDS.includes(role.id)) jokers.set(role.id, role.name);
        }
    }
    return [...jokers].map(([id, name]) => ({ id, name }));
}

// Role values are "departmentId:roleId" because kitchen or Kitchen Manager
// exist in many departments, and "all:roleId" for the joker roles
export function getRoleChoices(chosen: Department[], all: Department[], generalLabel: string) {
    const jokerOptions: SelectOption[] = getJokerRoles(getChosenRoots(chosen, all)).map((role) => ({
        value: `${JOKER_PREFIX}:${role.id}`,
        label: role.name,
    }));
    const departmentGroups: SelectOptionGroup[] = chosen
        .map((department) => ({
            label: department.name,
            options: department.roles
                .filter((role) => !JOKER_ROLE_IDS.includes(role.id))
                .map((role) => ({ value: `${department.id}:${role.id}`, label: role.name })),
        }))
        .filter((group) => group.options.length > 0);

    // admin and storekeeper go first, in their own "General" group
    const groups: SelectOptionGroup[] =
        jokerOptions.length > 0
            ? [{ label: generalLabel, options: jokerOptions }, ...departmentGroups]
            : departmentGroups;

    return { options: [], groups };
}

// Every position that is allowed in at least one chosen department
export function getPositionOptions(chosen: Department[]): SelectOption[] {
    const positions = new Map<number, string>();
    for (const department of chosen) {
        for (const position of department.positions) positions.set(position.id, position.name);
    }
    return [...positions].map(([id, name]) => ({ value: String(id), label: name }));
}

// Turns the ticked role values into the pairs the backend wants
export function buildDepartmentRoles(
    roleKeys: string[],
    chosen: Department[],
    all: Department[],
): RegisterPayload["departmentRoles"] {
    const chosenIds = chosen.map((department) => department.id);
    const roots = getChosenRoots(chosen, all);
    const pairs: RegisterPayload["departmentRoles"] = [];

    for (const key of roleKeys) {
        const [first, second] = key.split(":");
        const roleId = Number(second);

        if (first === JOKER_PREFIX) {
            for (const root of roots) {
                if (root.roles.some((role) => role.id === roleId)) {
                    pairs.push({ departmentId: root.id, roleId });
                }
            }
        } else if (chosenIds.includes(Number(first))) {
            // skips roles of a department that was unticked afterwards
            pairs.push({ departmentId: Number(first), roleId });
        }
    }
    return pairs;
}
