# Recruitment Management System (RMS)

An advanced, enterprise-grade system for managing the entire recruitment lifecycle, from candidate sourcing to final placement. Built with a modern, scalable, and real-time tech stack.

## ✨ Key Features

- **Public Job Portal:** A clean, searchable interface for public job listings.
- **Comprehensive Dashboards:** Real-time analytics and KPIs for data-driven decisions.
- **360° Candidate Profiles:** Centralized view of candidate details, documents, history, and activity.
- **Advanced Search:** Global, full-text, and fuzzy search across all entities.
- **Role-Based Access Control (RBAC):** Multi-layered security with four distinct user roles.
- **Real-time Collaboration:** Live updates across all modules for seamless teamwork.
- **Automated Workflows:** Invitation-based staff management and automated audit logging.
- **Data Management:** Robust import/export functionality for all key data.
- **PWA & Mobile-First:** Fully responsive, installable, and provides offline capabilities.
- **Print & PDF Generation:** Create professional, print-friendly documents on the fly.

---

## 🚀 Quick Start

For detailed setup, see [SETUP.md](./SETUP.md).

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd recruitment-management-system
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    -   Copy `.env.example` to `.env`.
    -   Fill in your Supabase Project URL and Anon Key.
    -   Set up Supabase secrets for any third-party API keys (see `SETUP.md`).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Run tests:**
    ```bash
    npm test
    ```

---

## 📚 Documentation

-   [**SETUP.md**](./SETUP.md): Detailed guide for setting up the local development environment and Supabase project.
-   [**DEPLOYMENT.md**](./DEPLOYMENT.md): Instructions for deploying the frontend and Supabase project to production.
-   [**API_DOCUMENTATION.md**](./API_DOCUMENTATION.md): Documentation for all Supabase database functions (RPCs) and triggers.
-   [**CONTRIBUTING.md**](./CONTRIBUTING.md): Guidelines for team members contributing to the project.
-   [**TROUBLESHOOTING.md**](./TROUBLESHOOTING.md): Solutions for common issues.
-   [**USER_MANUAL.md**](./USER_MANUAL.md): A complete guide for end-users (Staff, Viewers).
-   [**ADMIN_GUIDE.md**](./ADMIN_GUIDE.md): A guide for Administrators and Super Admins on managing the system.

---

## 💻 Tech Stack

-   **Frontend:** React 18 (Vite), Redux Toolkit, Material-UI (MUI), React Hook Form
-   **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions, Realtime)
-   **Testing:** Vitest, React Testing Library, MSW
-   **Deployment:** Vercel/Netlify (Frontend), Supabase (Backend)