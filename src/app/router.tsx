import { createBrowserRouter, Navigate } from "react-router";
import { AppLayout } from "./AppLayout";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { SuppliersPage } from "../features/suppliers/SuppliersPage";
import { InventoryPage } from "../features/inventory/InventoryPage";
import { OrdersPage } from "../features/orders/OrdersPage";
import { SettingsPage } from "../features/settings/SettingsPage";
import { MapPage } from "../features/map/MapPage";
import { AuthLayout } from "./AuthLayout";
import { LoginPage } from "../features/auth/login/LoginPage";
import { RegisterPage } from "../features/auth/register/RegisterPage";
import { ForgotPasswordPage } from "../features/auth/forgot-password/ForgotPasswordPage";
import { PasswordResetPage } from "../features/auth/password-reset/PasswordResetPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            { index: true, element: <DashboardPage /> },
            { path: "dashboard", element: <Navigate to="/" /> },
            { path: "suppliers", element: <SuppliersPage /> },
            { path: "inventory", element: <InventoryPage /> },
            { path: "orders", element: <OrdersPage /> },
            { path: "settings", element: <SettingsPage /> },
            { path: "map", element: <MapPage /> },
        ],
    },
    {
        element: <AuthLayout />,
        children: [
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
            { path: "forgot-password", element: <ForgotPasswordPage /> },
            { path: "password-reset", element: <PasswordResetPage /> },
        ],
    },
]);
