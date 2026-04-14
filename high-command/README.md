# High Command: Central Admin Portal

![High Command UI Overview - Placeholder]

**High Command** is the Ministry-level God-Mode portal of the Bloodchain Ecosystem. It is strictly limited to **System Administrators and Ministry of Health Officials**.

---

## 🌍 Role in the Bloodchain Ecosystem
While all other apps deal with immediate physical tasks, High Command overlooks the entire grid. It is the administrative backend where users are artificially provisioned, national blood deficits are tracked, immutable audit logs are verified, and public trust levels are moderated.

## ✨ Core Features
- **Keymaster (User Provisioning)**: While the public can register via Azure, all staff accounts (`LAB`, `MEDICAL`, `TRANSIT`) *must* be artificially seeded by an Admin in High Command. This prevents unverified users from gaining access to clinical apps.
- **Master Ledger (Audit Trail)**: A secure, read-only infinite table that lists *every single custody event* that has ever occurred across Botswana in real-time. If a bag of blood goes missing, the Master Ledger identifies the exact timestamp and user.
- **Verification Queue**: A dashboard for verifying the identity documents uploaded by public donors in the Azure app. Admins review Omang PDFs and click "Verify" to elevate a donor to Level 3 (`Gold`) Trust status.
- **Situation Room**: High-level statistical plotting of how many assets exist in the entire nation, grouped by status.
- **Ministry Reporter**: Generates physical PDF dumps and CSV exports of the nation's blood economy.

## 🛠 Tech Stack
- **Framework**: React 18 + Vite + TypeScript (`.tsx`)
- **Styling**: Tailwind CSS v3 (Black/Gold "Strategic Command" OLED aesthetic)
- **State Management**: Tanstack Query (`react-query`) for robust, cached admin polling.
- **Authentication**: Supabase Auth restricted strictly to the `ADMIN` role.
- **Routing**: React Router DOM (Standard responsive sidebar layout).

## 📂 Architecture
High Command utilizes React Query to continuously poll the `bloodchain-core` admin endpoints (`/api/v1/admin/*`). 
- It communicates heavily with `admin.service.ts` to execute `PATCH /users/:id` (for Trust Verifications) and `POST /users` (for Supabase Admin Auth user creation).
