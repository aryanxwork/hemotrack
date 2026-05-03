import { ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/donors": "Donor Management",
  "/blood-units": "Blood Inventory",
  "/hospitals": "Hospital Management",
  "/requests": "Blood Requests",
  "/issue": "Issue Blood",
  "/reports": "Reports & Analytics",
  "/audit-log": "Audit Log",
};

export default function Layout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const title = titles[pathname] ?? "HemoTrack";

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* animated blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-primary/15 blur-3xl animate-blob-1" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-primary/10 blur-3xl animate-blob-2" />
        <div className="absolute top-[40%] left-[30%] w-[25rem] h-[25rem] rounded-full bg-primary/10 blur-3xl animate-blob-3" />
      </div>

      <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} closeMobile={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} toggleSidebar={() => setCollapsed(c => !c)} openMobile={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
