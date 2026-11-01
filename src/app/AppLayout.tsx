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

export function AppLayout() {
    const children = [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
        { to: "/stock", label: "Stock", icon: ShelvingUnit },
        { to: "/suppliers", label: "Suppliers", icon: Truck },
        { to: "/orders", label: "Orders", icon: ReceiptText },
        { to: "/notifications", label: "Notifications", icon: Bell },
        { to: "/messages", label: "Messages", icon: MessagesCircle },
    ];

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
                        {children.map((child) => (
                            <NavLink
                                key={child.to}
                                to={child.to}
                                className="flex flex-row items-center gap-5 rounded-md px-2.5 py-2.5 text-lg font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground aria-[current=page]:bg-sidebar-accent aria-[current=page]:text-sidebar-foreground aria-[current=page]:shadow-[inset_3px_0_0_var(--sidebar-primary)]"
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

                <SidebarTrigger />
            </SidebarProvider>

            <main>
                <Outlet />
            </main>
        </div>
    );
}
