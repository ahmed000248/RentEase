# RentEase — Premium Rental SaaS Platform

RentEase is a modern, high-performance rental SaaS platform built for property owners, prospective tenants, and platform administrators. It provides end-to-end property discovery, inquiry management, owner analytics, real-time messaging, reservation booking workflows, and administrative moderation.

---

## 🛠 Tech Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database & Auth:** [Firebase Firestore](https://firebase.google.com/docs/firestore) & [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- **Styling:** [TailwindCSS v4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Testing:** [Vitest](https://vitest.dev/)
- **Payments:** [Stripe](https://stripe.com/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ installed
- Firebase project with Firestore enabled

### 1. Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Firebase credentials in `.env.local`:

- `NEXT_PUBLIC_FIREBASE_*`: Web App credentials from Firebase Console > Project Settings > General.
- `FIREBASE_SERVICE_ACCOUNT_KEY`: Service account JSON key from Firebase Console > Project Settings > Service Accounts (single-line string).
- `ENABLE_DEMO_DATA`: Set to `true` if you want mock listings populated in local dev.

### 2. Install Dependencies

```bash
npm install
```

### 3. Seed Database (Optional)

Populate your local Firestore emulator or dev instance with initial sample data:

```bash
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🧪 Testing & Quality Assurance

Run unit and integration tests:

```bash
npm test
```

Run linting and type checking:

```bash
npm run lint
npx tsc --noEmit
```

---

## 📁 Architecture Overview

- `src/app/` — Next.js App Router pages and API endpoints.
  - `src/app/api/admin/` — Admin moderation & management API endpoints (`/approve`, `/reject`, `/suspend`).
  - `src/app/api/messages/` — Real-time messaging endpoint (`/send`).
  - `src/app/api/bookings/` — Reservation and Stripe checkout endpoints.
- `src/components/` — React UI components grouped by domain (`admin`, `owner`, `property`, `ui`).
- `src/lib/data/` — Server-side data access layer (`properties.ts`, `owner.ts`, `admin.ts`, `messages.ts`, `bookings.ts`).
- `src/lib/firebase/` — Firebase client and Admin SDK initialization and type definitions.
- `firebase/` — Security rules (`firestore.rules`) and compound indexes (`firestore.indexes.json`).

---

## 📄 Product Documentation

- [`PRODUCT.md`](./PRODUCT.md) — Product requirements and features.
- [`REQUIREMENTS.md`](./REQUIREMENTS.md) — Platform technical specifications.
- [`improve.md`](./improve.md) — Engineering remediation plan and audit history.
