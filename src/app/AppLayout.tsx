import { NavLink, Outlet } from "react-router";
import { LogoutButton } from "@/components/LogoutButton";
import {
    SidebarProvider,
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import logo from "@/assets/brand/shelf-aware-icon-light.svg";
import { LayoutDashboardIcon, User } from "lucide-react";
import { ShelvingUnit } from "lucide-react";
import { Truck } from "lucide-react";
import { ReceiptText } from "lucide-react";
import { Bell } from "lucide-react";
import { MessagesCircle } from "lucide-react";
import { TranslationButtonGroup } from "@/components/TranslationButtonGroup";
import { UserAccountButton } from "@/components/UserAccountButton";
import { useCurrentUser } from "@/features/auth/useCurrentUser";
import { hasRole, MANAGER_ROLES } from "@/lib/roles";

export function AppLayout() {
    const { data: currentUser } = useCurrentUser();
    const children = [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
        { to: "/stock", label: "Stock", icon: ShelvingUnit, roles: MANAGER_ROLES },
        { to: "/suppliers", label: "Suppliers", icon: Truck, roles: MANAGER_ROLES },
        { to: "/orders", label: "Orders", icon: ReceiptText },
        { to: "/notifications", label: "Notifications", icon: Bell },
        { to: "/messages", label: "Messages", icon: MessagesCircle },
    ];

    // the sieve: keep an item if it has no `roles` (everyone), or the user has one of its roles
    const visibleLinks = children.filter(
        (child) => !child.roles || hasRole(currentUser, child.roles),
    );

    const headerLabel = "Grecotel Casa Paradiso";
    return (
        <div>
            <SidebarProvider>
                <Sidebar>
                    <SidebarHeader className="flex-row items-center gap-2.5 p-4">
                        <img src={logo} alt="ShelfAware" className="size-10 shrink-0 rounded-lg" />
                        <div>
                            <div className="text-xl leading-none font-extrabold tracking-tighter text-sidebar-foreground">
                                Shelf Aware
                            </div>
                            <div className="mt-1 text-xs text-sidebar-foreground/60">
                                {headerLabel}
                            </div>
                        </div>
                    </SidebarHeader>
                    <SidebarContent className="gap-1 px-3">
                        {visibleLinks.map((child) => (
                            <NavLink
                                key={child.to}
                                to={child.to}
                                className="flex flex-row items-center gap-5 rounded-md px-2.5 py-2.5 text-lg font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground aria-[current=page]:bg-sidebar-accent aria-[current=page]:text-sidebar-foreground"
                            >
                                <child.icon className="size-5" /> {child.label}
                            </NavLink>
                        ))}
                        <br />
                    </SidebarContent>
                    <SidebarFooter className="gap-3 p-4">
                        <TranslationButtonGroup />
                        <UserAccountButton />
                        <LogoutButton />
                    </SidebarFooter>
                </Sidebar>

                <main className="relative isolate flex-1 overflow-hidden p-6">
                    {/* soft colour blobs: top left and bottom right of the page, behind everything */}
                    <div className="absolute -top-32 -left-32 -z-10 size-96 rounded-full bg-secondary blur-3xl" />
                    <div className="absolute -right-32 -bottom-32 -z-10 size-96 rounded-full bg-primary/40 blur-3xl" />
                    <SidebarTrigger />
                    <Outlet />
                </main>
            </SidebarProvider>
        </div>
    );
}
