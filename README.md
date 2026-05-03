# HemoTrack — Blood Bank Management System

A medical-grade blood bank dashboard built with React, TypeScript, Tailwind CSS, and Shadcn/UI components. The frontend mirrors the Oracle SQL schema (DONOR, BLOOD_UNIT, HOSPITAL, BLOOD_REQUEST, ISSUE_RECORD, AUDIT_LOG, etc.) with mock data and CRUD that mirrors the original PL/SQL procedures and triggers (`register_donor`, `approve_request`, `issue_blood`, `trg_check_expiry`, `trg_log_issue`).

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

### Demo credentials

| Role  | Username | Password   |
|-------|----------|------------|
| Admin | admin1   | admin123   |
| Staff | staff1   | staff123   |

Staff users cannot access **Issue Blood** or **Audit Log**.

## Features

- **Dashboard** — animated count-up stat cards, blood-group bar chart, request-status pie, recent-activity table.
- **Donor Management** — full CRUD, search, blood-group filter, age 18–65 validation, duplicate-phone detection, pagination (10/page), color-coded blood-group badges.
- **Blood Inventory** — summary cards, status / group filters, expired rows highlighted, auto-expire trigger logic on add.
- **Hospital Management** — CRUD, search, side-drawer showing requests per hospital.
- **Blood Requests** — filters, new-request modal, Approve/Reject only on Pending rows (tooltip lock for processed rows).
- **Issue Blood** — admin-only, available-units dropdown, auto-fills logged-in admin, updates unit + appends ISSUE_RECORD + AUDIT_LOG.
- **Reports** — Donor Report (CSV export), Stock by Group (progress bars), Donation History join, Expired Units list.
- **Audit Log** — admin-only, action-type filter, newest first.

## Tech

- React 18 + TypeScript + Vite
- Tailwind CSS (dark-first medical theme — navy + crimson)
- Shadcn/UI primitives (Dialog, Drawer, Select, Table, Badge, Tooltip, …)
- Recharts (charts)
- React Router v6
- date-fns, lucide-react, Sonner (toasts)

## Folder Structure

```
src/
├── components/
│   ├── layout/         Sidebar, Header, Layout
│   ├── ui/             Shadcn primitives
│   ├── dashboard/      StatCard, charts
│   ├── donors/         DonorModal
│   ├── blood-units/    BloodUnitModal
│   ├── hospitals/      HospitalModal
│   ├── requests/       RequestModal
├── context/            AuthContext, AppDataContext
├── data/               mockData.ts (mirrors SQL inserts)
├── hooks/              useCountUp
├── pages/              one file per route
├── types/              TypeScript schema
└── utils/              helpers (date format, CSV, badge colors)
```

## Mock Data Layer

All data lives in React Context (`AppDataContext`). Edits/adds/deletes update state immediately and reflect across every page without reloads. To wire to Oracle, replace the in-memory mutators with API calls — interfaces in `src/types/index.ts` already match the SQL schema.

## Build

```bash
npm run build      # production bundle in dist/
npm run preview    # preview built app
```
