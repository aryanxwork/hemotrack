import type {
  BloodBank, UserAdmin, Donor, Hospital, BloodUnit,
  DonationRecord, BloodRequest, IssueRecord, AuditLog
} from "@/types";

export const initialBanks: BloodBank[] = [
  { bank_id: 1, name: "City Blood Center", location: "Delhi" },
  { bank_id: 2, name: "LifeCare Blood Bank", location: "Noida" },
];

export const initialAdmins: UserAdmin[] = [
  { admin_id: 1, username: "admin1", password: "admin123", role: "Admin" },
  { admin_id: 2, username: "staff1", password: "staff123", role: "Staff" },
];

export const initialDonors: Donor[] = [
  { donor_id: 1,  name: "Rahul Sharma",   age: 28, gender: "Male",   blood_group: "O+",  phone: "9990000001", email: "rahul.s@example.com",   address: "Sector 12, Delhi",       last_donation_date: "2025-06-15" },
  { donor_id: 2,  name: "Neha Verma",     age: 25, gender: "Female", blood_group: "A+",  phone: "9990000002", email: "neha.v@example.com",    address: "Lajpat Nagar, Delhi",    last_donation_date: "2025-07-02" },
  { donor_id: 3,  name: "Amit Kumar",     age: 34, gender: "Male",   blood_group: "B+",  phone: "9990000003", email: "amit.k@example.com",    address: "Sector 18, Noida",       last_donation_date: "2025-05-20" },
  { donor_id: 4,  name: "Pooja Singh",    age: 30, gender: "Female", blood_group: "O-",  phone: "9990000004", email: "pooja.s@example.com",   address: "Saket, Delhi",           last_donation_date: "2025-07-10" },
  { donor_id: 5,  name: "Rohit Mehta",    age: 40, gender: "Male",   blood_group: "AB+", phone: "9990000005", email: "rohit.m@example.com",   address: "Dwarka, Delhi",          last_donation_date: "2025-04-18" },
  { donor_id: 6,  name: "Sneha Patel",    age: 27, gender: "Female", blood_group: "A-",  phone: "9990000006", email: "sneha.p@example.com",   address: "Indirapuram, Ghaziabad", last_donation_date: "2025-06-30" },
  { donor_id: 7,  name: "Vikas Verma",    age: 32, gender: "Male",   blood_group: "B-",  phone: "9990000007", email: "vikas.v@example.com",   address: "Karol Bagh, Delhi",      last_donation_date: "2025-07-05" },
  { donor_id: 8,  name: "Karan Malhotra", age: 29, gender: "Male",   blood_group: "O+",  phone: "9990000008", email: "karan.m@example.com",   address: "Vasant Kunj, Delhi",     last_donation_date: "2025-07-12" },
  { donor_id: 9,  name: "Riya Gupta",     age: 24, gender: "Female", blood_group: "AB-", phone: "9990000009", email: "riya.g@example.com",    address: "Sector 50, Noida",       last_donation_date: "2025-06-22" },
  { donor_id: 10, name: "Ankit Jain",     age: 35, gender: "Male",   blood_group: "A+",  phone: "9990000010", email: "ankit.j@example.com",   address: "Rohini, Delhi",          last_donation_date: "2025-05-10" },
  { donor_id: 11, name: "Nisha Kapoor",   age: 31, gender: "Female", blood_group: "O+",  phone: "9990000011", email: "nisha.k@example.com",   address: "Greater Kailash, Delhi", last_donation_date: "2025-07-18" },
  { donor_id: 12, name: "Rahul Verma",    age: 26, gender: "Male",   blood_group: "B+",  phone: "9990000012", email: "rahul.v@example.com",   address: "Mayur Vihar, Delhi",     last_donation_date: "2025-08-01" },
];

export const initialHospitals: Hospital[] = [
  { hospital_id: 1,  name: "Apollo Hospital",  address: "Sarita Vihar, Delhi",   contact_no: "01126925858", email: "contact@apollo.in" },
  { hospital_id: 2,  name: "Fortis Hospital",  address: "Vasant Kunj, Delhi",    contact_no: "01142776222", email: "info@fortis.in" },
  { hospital_id: 3,  name: "Max Hospital",     address: "Saket, Delhi",          contact_no: "01140554055", email: "care@max.in" },
  { hospital_id: 4,  name: "AIIMS",            address: "Ansari Nagar, Delhi",   contact_no: "01126588500", email: "info@aiims.edu" },
  { hospital_id: 21, name: "Medanta Hospital", address: "Sector 38, Gurugram",   contact_no: "01244141414", email: "info@medanta.org" },
];

export const initialBloodUnits: BloodUnit[] = [
  { unit_id: 1,  blood_group: "O+",  collection_date: "2025-07-01", expiry_date: "2025-09-01", status: "Issued",    bank_id: 1 },
  { unit_id: 2,  blood_group: "A+",  collection_date: "2025-07-05", expiry_date: "2025-09-05", status: "Issued",    bank_id: 1 },
  { unit_id: 3,  blood_group: "B+",  collection_date: "2025-07-10", expiry_date: "2025-09-10", status: "Available", bank_id: 1 },
  { unit_id: 4,  blood_group: "O-",  collection_date: "2025-07-15", expiry_date: "2025-09-15", status: "Available", bank_id: 2 },
  { unit_id: 5,  blood_group: "AB+", collection_date: "2025-07-20", expiry_date: "2025-09-20", status: "Available", bank_id: 2 },
  { unit_id: 6,  blood_group: "A-",  collection_date: "2025-06-15", expiry_date: "2025-08-15", status: "Expired",   bank_id: 1 },
  { unit_id: 7,  blood_group: "B-",  collection_date: "2025-07-25", expiry_date: "2025-09-25", status: "Available", bank_id: 1 },
  { unit_id: 8,  blood_group: "O+",  collection_date: "2025-07-28", expiry_date: "2025-09-28", status: "Available", bank_id: 2 },
  { unit_id: 9,  blood_group: "AB-", collection_date: "2025-06-25", expiry_date: "2025-08-25", status: "Expired",   bank_id: 2 },
  { unit_id: 10, blood_group: "A+",  collection_date: "2025-08-01", expiry_date: "2025-10-01", status: "Available", bank_id: 1 },
  { unit_id: 11, blood_group: "O+",  collection_date: "2025-08-03", expiry_date: "2025-10-03", status: "Available", bank_id: 1 },
  { unit_id: 12, blood_group: "B+",  collection_date: "2025-08-05", expiry_date: "2025-10-05", status: "Available", bank_id: 2 },
];

export const initialDonationRecords: DonationRecord[] = [
  { donation_id: 1,  donor_id: 1,  unit_id: 1,  donation_date: "2025-07-01" },
  { donation_id: 2,  donor_id: 2,  unit_id: 2,  donation_date: "2025-07-05" },
  { donation_id: 3,  donor_id: 3,  unit_id: 3,  donation_date: "2025-07-10" },
  { donation_id: 4,  donor_id: 4,  unit_id: 4,  donation_date: "2025-07-15" },
  { donation_id: 5,  donor_id: 5,  unit_id: 5,  donation_date: "2025-07-20" },
  { donation_id: 6,  donor_id: 6,  unit_id: 6,  donation_date: "2025-06-15" },
  { donation_id: 7,  donor_id: 7,  unit_id: 7,  donation_date: "2025-07-25" },
  { donation_id: 8,  donor_id: 8,  unit_id: 8,  donation_date: "2025-07-28" },
  { donation_id: 9,  donor_id: 9,  unit_id: 9,  donation_date: "2025-06-25" },
  { donation_id: 10, donor_id: 10, unit_id: 10, donation_date: "2025-08-01" },
  { donation_id: 11, donor_id: 11, unit_id: 11, donation_date: "2025-08-03" },
  { donation_id: 12, donor_id: 12, unit_id: 12, donation_date: "2025-08-05" },
];

export const initialBloodRequests: BloodRequest[] = [
  { request_id: 1, hospital_id: 1,  blood_group: "O+",  quantity: 2, request_date: "2025-08-06", status: "Approved" },
  { request_id: 2, hospital_id: 2,  blood_group: "A+",  quantity: 1, request_date: "2025-08-07", status: "Pending"  },
  { request_id: 3, hospital_id: 3,  blood_group: "B+",  quantity: 3, request_date: "2025-08-08", status: "Pending"  },
  { request_id: 4, hospital_id: 4,  blood_group: "O-",  quantity: 1, request_date: "2025-08-09", status: "Approved" },
  { request_id: 5, hospital_id: 21, blood_group: "AB+", quantity: 2, request_date: "2025-08-10", status: "Rejected" },
  { request_id: 6, hospital_id: 1,  blood_group: "B-",  quantity: 1, request_date: "2025-08-11", status: "Pending"  },
  { request_id: 7, hospital_id: 2,  blood_group: "A-",  quantity: 2, request_date: "2025-08-12", status: "Pending"  },
];

export const initialIssueRecords: IssueRecord[] = [
  { issue_id: 1, unit_id: 1, hospital_id: 21, issue_date: "2025-08-10", admin_id: 1 },
  { issue_id: 2, unit_id: 2, hospital_id: 1,  issue_date: "2025-08-11", admin_id: 1 },
];

export const initialAuditLogs: AuditLog[] = [
  { log_id: 1, admin_id: 1, action: "ISSUE_BLOOD", table_name: "BLOOD_UNIT", record_id: 1, log_time: "2025-08-10T10:30:00" },
  { log_id: 2, admin_id: 1, action: "ISSUE_BLOOD", table_name: "BLOOD_UNIT", record_id: 2, log_time: "2025-08-11T11:15:00" },
];
