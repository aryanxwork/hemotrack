import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import type {
  BloodBank, Donor, Hospital, BloodUnit, DonationRecord,
  BloodRequest, IssueRecord, AuditLog
} from "@/types";
import { api } from "@/lib/api";
import { useAuth } from "./AuthContext";

interface AppDataCtx {
  banks: BloodBank[];
  donors: Donor[]; 
  addDonor: (d: Omit<Donor, "donor_id">) => Promise<{ ok: boolean; message: string }>;
  updateDonor: (d: Donor) => Promise<{ ok: boolean; message: string }>; 
  deleteDonor: (id: number) => Promise<{ ok: boolean; message: string }>;
  
  hospitals: Hospital[]; 
  addHospital: (h: Omit<Hospital, "hospital_id">) => Promise<{ ok: boolean; message: string }>;
  updateHospital: (h: Hospital) => Promise<{ ok: boolean; message: string }>; 
  deleteHospital: (id: number) => Promise<{ ok: boolean; message: string }>;
  
  units: BloodUnit[]; 
  addUnit: (u: Omit<BloodUnit, "unit_id" | "status">) => Promise<{ ok: boolean; message: string }>;
  setUnitStatus: (id: number, status: BloodUnit["status"]) => Promise<{ ok: boolean; message: string }>;
  
  donations: DonationRecord[];
  
  requests: BloodRequest[]; 
  addRequest: (r: Omit<BloodRequest, "request_id" | "request_date" | "status">) => Promise<{ ok: boolean; message: string }>;
  approveRequest: (id: number) => Promise<{ ok: boolean; message: string }>;
  rejectRequest: (id: number) => Promise<{ ok: boolean; message: string }>;
  
  issues: IssueRecord[];
  issueBlood: (unit_id: number, hospital_id: number) => Promise<{ ok: boolean; message: string }>;
  
  audits: AuditLog[];
  refreshData: () => Promise<void>;
}

const Ctx = createContext<AppDataCtx | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  const [banks, setBanks] = useState<BloodBank[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [units, setUnits] = useState<BloodUnit[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [issues, setIssues] = useState<IssueRecord[]>([]);
  const [audits, setAudits] = useState<AuditLog[]>([]);

  const refreshData = useCallback(async () => {
    if (!user) return;
    try {
      const [b, d, h, u, req, i, a, don] = await Promise.all([
        api.get("/blood-banks").catch(()=>({data:{data:[]}})),
        api.get("/donors").catch(()=>({data:{data:[]}})),
        api.get("/hospitals").catch(()=>({data:{data:[]}})),
        api.get("/blood-units").catch(()=>({data:{data:[]}})),
        api.get("/requests").catch(()=>({data:{data:[]}})),
        api.get("/issue").catch(()=>({data:{data:[]}})),
        api.get("/audit-log").catch(()=>({data:{data:[]}})),
        api.get("/donations").catch(()=>({data:{data:[]}}))
      ]);
      setBanks(b.data.data || []);
      setDonors(d.data.data || []);
      setHospitals(h.data.data || []);
      setUnits(u.data.data || []);
      setRequests(req.data.data || []);
      setIssues(i.data.data || []);
      setAudits(a.data.data || []);
      setDonations(don.data.data || []);
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addDonor = async (d: Omit<Donor, "donor_id">) => {
    try {
      await api.post("/donors", d);
      await refreshData();
      return { ok: true, message: "Donor registered successfully" };
    } catch (e: any) {
      return { ok: false, message: e.message || "Failed to add donor" };
    }
  };

  const updateDonor = async (d: Donor) => {
    try {
      await api.put(`/donors/${d.donor_id}`, d);
      await refreshData();
      return { ok: true, message: "Donor updated" };
    } catch (e: any) {
      return { ok: false, message: e.message || "Failed to update donor" };
    }
  };

  const deleteDonor = async (id: number) => {
    try {
      await api.delete(`/donors/${id}`);
      await refreshData();
      return { ok: true, message: "Donor deleted" };
    } catch (e: any) {
      return { ok: false, message: e.message || "Failed to delete donor" };
    }
  };

  const addHospital = async (h: Omit<Hospital, "hospital_id">) => {
    try {
      await api.post("/hospitals", h);
      await refreshData();
      return { ok: true, message: "Hospital added" };
    } catch (e: any) {
      return { ok: false, message: e.message || "Failed to add hospital" };
    }
  };

  const updateHospital = async (h: Hospital) => {
    try {
      await api.put(`/hospitals/${h.hospital_id}`, h);
      await refreshData();
      return { ok: true, message: "Hospital updated" };
    } catch (e: any) {
      return { ok: false, message: e.message || "Failed to update hospital" };
    }
  };

  const deleteHospital = async (id: number) => {
    try {
      await api.delete(`/hospitals/${id}`);
      await refreshData();
      return { ok: true, message: "Hospital deleted" };
    } catch (e: any) {
      return { ok: false, message: e.message || "Failed to delete hospital" };
    }
  };

  const addUnit = async (u: Omit<BloodUnit, "unit_id" | "status">) => {
    try {
      await api.post("/blood-units", u);
      await refreshData();
      return { ok: true, message: "Blood unit added" };
    } catch (e: any) {
      return { ok: false, message: e.message || "Failed to add blood unit" };
    }
  };

  const setUnitStatus = async (id: number, status: BloodUnit["status"]) => {
    try {
      await api.put(`/blood-units/${id}`, { status });
      await refreshData();
      return { ok: true, message: "Status updated" };
    } catch (e: any) {
      return { ok: false, message: e.message || "Failed to update status" };
    }
  };

  const addRequest = async (r: Omit<BloodRequest, "request_id" | "request_date" | "status">) => {
    try {
      await api.post("/requests", r);
      await refreshData();
      return { ok: true, message: "Request added" };
    } catch (e: any) {
      return { ok: false, message: e.message || "Failed to add request" };
    }
  };

  const approveRequest = async (id: number) => {
    try {
      await api.put(`/requests/${id}/approve`);
      await refreshData();
      return { ok: true, message: "Request approved" };
    } catch (e: any) {
      return { ok: false, message: e.message || "Failed to approve request" };
    }
  };

  const rejectRequest = async (id: number) => {
    try {
      await api.put(`/requests/${id}/reject`);
      await refreshData();
      return { ok: true, message: "Request rejected" };
    } catch (e: any) {
      return { ok: false, message: e.message || "Failed to reject request" };
    }
  };

  const issueBlood = async (unit_id: number, hospital_id: number) => {
    try {
      await api.post("/issue", { unit_id, hospital_id });
      await refreshData();
      return { ok: true, message: "Blood issued successfully" };
    } catch (e: any) {
      return { ok: false, message: e.message || "Failed to issue blood" };
    }
  };

  return (
    <Ctx.Provider value={{
      banks, donors, addDonor, updateDonor, deleteDonor,
      hospitals, addHospital, updateHospital, deleteHospital,
      units, addUnit, setUnitStatus, donations,
      requests, addRequest, approveRequest, rejectRequest,
      issues, issueBlood, audits, refreshData
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAppData() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAppData must be inside AppDataProvider");
  return c;
}
