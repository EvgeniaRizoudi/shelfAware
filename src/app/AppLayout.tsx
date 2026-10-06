import { NavLink, Outlet } from "react-router";

export function AppLayout() {
    const links = [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/inventory", label: "Inventory" },
        { to: "/suppliers", label: "Suppliers" },
        { to: "/map", label: "Map" },
        { to: "/orders", label: "Orders" },
        { to: "/settings", label: "Settings" },
    ];

    return (
        <div>
            <nav>
                {links.map((link) => (
                    <NavLink key={link.to} to={link.to}>
                        {link.label}
                    </NavLink>
                ))}
            </nav>
            <main>
                <Outlet />
            </main>
        </div>
    );
}
