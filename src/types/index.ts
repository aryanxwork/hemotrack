export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
export const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export type Role = "Admin" | "Staff" | "Patient";
export type UnitStatus = "Available" | "Issued" | "Expired";
export type RequestStatus = "Pending" | "Approved" | "Rejected";

export interface BloodBank { bank_id: number; name: string; location: string; }
export interface UserAdmin { admin_id: number; username: string; password: string; role: Role; }
export interface Donor {
  donor_id: number; name: string; age: number; gender: "Male" | "Female" | "Other";
  blood_group: BloodGroup; phone: string; email: string; address: string; last_donation_date: string;
}
export interface Hospital { hospital_id: number; name: string; address: string; contact_no: string; email: string; }
export interface BloodUnit {
  unit_id: number; blood_group: BloodGroup; collection_date: string; expiry_date: string;
  status: UnitStatus; bank_id: number;
}
export interface DonationRecord { donation_id: number; donor_id: number; unit_id: number; donation_date: string; }
export interface BloodRequest {
  request_id: number; hospital_id: number; blood_group: BloodGroup;
  quantity: number; request_date: string; status: RequestStatus;
}
export interface IssueRecord {
  issue_id: number; unit_id: number; hospital_id: number; issue_date: string; handled_by: number;
}
export interface AuditLog {
  log_id: number; admin_id: number; action: string; table_name: string; record_id: number; log_time: string;
}
