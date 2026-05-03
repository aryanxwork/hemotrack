import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Droplets, Building2, ClipboardList,
  HeartPulse, BarChart2, ScrollText, LogOut, X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface Props { collapsed: boolean; mobileOpen: boolean; closeMobile: () => void; }

export default function Sidebar({ collapsed, mobileOpen, closeMobile }: Props) {
  const { role, logout } = useAuth();
  const nav = useNavigate();

  const items = [
    { to: "/", label: "Dashboard", Icon: LayoutDashboard, end: true },
    ...(role !== "Patient" ? [
      { to: "/donors", label: "Donors", Icon: Users },
      { to: "/blood-units", label: "Blood Inventory", Icon: Droplets },
      { to: "/hospitals", label: "Hospitals", Icon: Building2 },
    ] : []),
    { to: "/requests", label: "Blood Requests", Icon: ClipboardList },
    ...(role === "Admin" ? [
      { to: "/issue", label: "Issue Blood", Icon: HeartPulse },
      { to: "/audit-log", label: "Audit Log", Icon: ScrollText }
    ] : []),
    ...(role !== "Patient" ? [{ to: "/reports", label: "Reports", Icon: BarChart2 }] : []),
  ];

  const handleLogout = () => { logout(); nav("/login"); };

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={closeMobile} />
      )}
      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 z-50 h-screen flex flex-col glass border-r transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          "md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-border/50">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center shrink-0 glow-border">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary-foreground" fill="currentColor">
                <path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z" />
              </svg>
            </div>
            {!collapsed && <span className="font-display text-2xl tracking-wide">HemoTrack</span>}
          </div>
          <button onClick={closeMobile} className="md:hidden p-1"><X className="w-5 h-5" /></button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {items.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to} to={to} end={end as boolean | undefined} onClick={closeMobile}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all relative",
                  "hover:bg-primary/10 hover:text-foreground",
                  isActive
                    ? "bg-primary/15 text-foreground before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-primary before:rounded-r"
                    : "text-muted-foreground"
                )
              }
              title={collapsed ? label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-2 border-t border-border/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition-colors"
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
