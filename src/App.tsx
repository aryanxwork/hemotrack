import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AppDataProvider } from "@/context/AppDataContext";
import Layout from "@/components/layout/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Donors from "@/pages/Donors";
import BloodUnits from "@/pages/BloodUnits";
import Hospitals from "@/pages/Hospitals";
import Requests from "@/pages/Requests";
import IssueBlood from "@/pages/IssueBlood";
import Reports from "@/pages/Reports";
import AuditLog from "@/pages/AuditLog";
import PatientDashboard from "@/pages/PatientDashboard";

function Protected({ children, adminOnly = false, staffOnly = false }: { children: JSX.Element; adminOnly?: boolean; staffOnly?: boolean }) {
  const { user, role } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  if (adminOnly && role !== "Admin") return <Navigate to="/" replace state={{ denied: true }} />;
  if (staffOnly && (role !== "Admin" && role !== "Staff")) return <Navigate to="/" replace state={{ denied: true }} />;
  return children;
}

function AppRoutes() {
  const { role } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Protected><Layout>{role === "Patient" ? <PatientDashboard /> : <Dashboard />}</Layout></Protected>} />
      <Route path="/donors" element={<Protected staffOnly><Layout><Donors /></Layout></Protected>} />
      <Route path="/blood-units" element={<Protected staffOnly><Layout><BloodUnits /></Layout></Protected>} />
      <Route path="/hospitals" element={<Protected staffOnly><Layout><Hospitals /></Layout></Protected>} />
      <Route path="/requests" element={<Protected><Layout><Requests /></Layout></Protected>} />
      <Route path="/issue" element={<Protected adminOnly><Layout><IssueBlood /></Layout></Protected>} />
      <Route path="/reports" element={<Protected staffOnly><Layout><Reports /></Layout></Protected>} />
      <Route path="/audit-log" element={<Protected adminOnly><Layout><AuditLog /></Layout></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <TooltipProvider delayDuration={150}>
          <AppRoutes />
          <Toaster position="bottom-right" theme="dark" richColors closeButton />
        </TooltipProvider>
      </AppDataProvider>
    </AuthProvider>
  );
}
