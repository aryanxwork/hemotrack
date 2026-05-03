# HemoTrack — Full-Stack Blood Bank Management System

HemoTrack is a comprehensive, medical-grade blood bank management dashboard. Originally built as a robust frontend prototype, it has been fully upgraded into a **production-ready full-stack application**. It features a React-based frontend and a Node.js/Express backend, powered by a PostgreSQL database.

The system handles everything from inventory tracking and automated expiry management to dual-role authentication (Admin/Staff and Patient), allowing patients to register and request blood while administrators manage the supply chain and issue logs.

---

## 🚀 Key Features

*   **Dual-Role Authentication System**
    *   **Admin/Staff**: Full access to inventory, donors, hospitals, and audit logs. Staff have restricted access (cannot issue blood or view audit logs).
    *   **Patients**: Self-registration portal. Can log in, submit new blood requests, and track the real-time status of their past requests.
*   **Real-time Dashboard**
    *   Animated count-up stat cards, blood-group bar charts, request-status pie charts, and recent-activity tables.
*   **Inventory & Expiry Management**
    *   Track blood units by group, collection date, and expiry.
    *   Automated triggers ensure expired blood cannot be issued.
*   **Request & Issue Workflow**
    *   Patients/Hospitals request specific blood groups.
    *   Admins review requests (Approve/Reject) and formally "Issue" blood from available stock.
    *   Issuing blood automatically updates unit status and generates immutable audit logs.
*   **Donor & Hospital Management**
    *   Full CRUD operations with search, filtering, and pagination.
*   **Audit Logging**
    *   Automated, un-deletable logging of critical actions (e.g., `ISSUE_BLOOD`) for compliance and security.

---

## 🛠️ Tech Stack

**Frontend**
*   **Core**: React 18, TypeScript, Vite
*   **Styling**: Tailwind CSS (Dark-first medical theme: navy + crimson)
*   **Components**: Shadcn/UI (Dialog, Drawer, Select, Table, Badge, Tooltip, etc.)
*   **Icons & Charts**: Lucide React, Recharts
*   **Routing & State**: React Router v6, Context API

**Backend**
*   **Core**: Node.js, Express.js
*   **Database**: PostgreSQL
*   **ORM**: Sequelize
*   **Security & Auth**: JWT (JSON Web Tokens), bcryptjs, Helmet, Express Rate Limit, CORS validation.
*   **Validation**: Joi (Schema validation for all API inputs).

---

## 📂 Project Structure

```text
hemotrack/
├── hemotrack-backend/       # Node.js/Express API Server
│   ├── src/
│   │   ├── config/          # Database & JWT configuration
│   │   ├── controllers/     # Route logic (Auth, Donors, Units, Requests)
│   │   ├── middleware/      # Auth verification, error handling, validation
│   │   ├── models/          # Sequelize schema definitions
│   │   ├── routes/          # API endpoint definitions
│   │   ├── seeders/         # Mass database population scripts
│   │   ├── services/        # Complex business logic and DB transactions
│   │   └── validators/      # Joi schemas
├── src/                     # React Frontend
│   ├── components/          # UI Components (Layout, Dashboard, Modals)
│   ├── context/             # AuthContext, AppDataContext
│   ├── lib/                 # API client wrapper (fetchApi)
│   ├── pages/               # Route views (Login, Inventory, Patient Dashboard)
│   └── types/               # TypeScript interfaces matching backend models
└── DEPLOYMENT.md            # Cloud deployment instructions
```

---

## 💻 Local Development Setup

To run HemoTrack locally, you need Node.js and PostgreSQL installed on your machine.

### 1. Database Setup
Create a local PostgreSQL database named `hemotrack_db`.

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and configure your environment variables.
```bash
cd hemotrack-backend
npm install
```
Create a `.env` file in `hemotrack-backend/`:
```env
PORT=5000
DATABASE_URL=postgres://your_username:your_password@localhost:5432/hemotrack_db
NODE_ENV=development
JWT_SECRET=super_secret_local_key_change_me
CORS_ORIGIN=http://localhost:5173
```
Start the server (this will automatically sync the database schemas):
```bash
npm run dev
```
*(Optional)* Seed the database with initial data:
```bash
npm run seed
```

### 3. Frontend Setup
In a new terminal window, navigate to the root directory and start the Vite dev server.
```bash
cd hemotrack
npm install
```
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the frontend:
```bash
npm run dev
```

---

## 🌐 Production Deployment

The project is configured for seamless deployment:
*   **Backend & Database**: Configured for Render via `render.yaml` (automatically provisions a PostgreSQL database and Node web service).
*   **Frontend**: Configured for Vercel via `vercel.json` (handles client-side routing).

For detailed, step-by-step instructions on deploying the application to the cloud, please refer to the **[`DEPLOYMENT.md`](./DEPLOYMENT.md)** file.

---

## 🔑 Demo Credentials

If you have seeded the database (`npm run seed` or triggered the remote seed URL), use the following credentials to explore the system:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin1` | `password123` |
| **Staff** | `staff1` | `password123` |
| **Patient** | *(Self-register)* | *(Any valid password)* |

*Note: Staff users have restricted access and cannot issue blood or view audit logs.*
