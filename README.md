# Family Budget App

A mobile-first family budget application built with Next.js, TypeScript, Tailwind CSS, and Firebase.

## Features

- Email/password authentication with Firebase Auth
- Dashboard with income, expenses, balance, and charts
- Income and expense CRUD
- Monthly budget tracking by category with warnings
- Savings goals with progress tracking
- Weekly and monthly reports with Recharts visualizations
- Dark mode support
- Mobile-first design with bottom navigation

## Getting Started

### 1. Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password provider)
3. Create a **Firestore** database
4. Copy your web app config

### 2. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Firebase credentials:

```bash
cp .env.local.example .env.local
```

### 3. Deploy Security Rules (required)

The app will show **"Missing or insufficient permissions"** until rules are deployed.

**Option A — Firebase Console (quickest)**

1. Open [Firebase Console](https://console.firebase.google.com) → your project
2. **Firestore Database** → **Rules** → paste contents of `firestore.rules` → **Publish**

**Option B — Firebase CLI**

```bash
npm install -g firebase-tools
firebase login
firebase use your-project-id
firebase deploy --only firestore:rules
```

### 4. Firestore Indexes

Create composite indexes for queries with `userId` + `date`/`category`/`month` ordering as needed. Firebase will prompt you with index creation links when queries fail.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
/app
  /(auth)          # Login & signup
  /(dashboard)     # Protected app screens
/components
  /dashboard       # Dashboard widgets
  /income          # Income components
  /expenses        # Expense components
  /budget          # Budget components
  /goals           # Savings goal components
  /reports         # Chart components
  /layout          # Navigation & headers
  /ui              # Reusable UI primitives
/lib               # Firebase, auth, utilities
/hooks             # Data hooks with optimistic updates
/types             # TypeScript definitions
```

## Tech Stack

- Next.js 15+ App Router
- TypeScript
- Tailwind CSS
- Firebase (Auth, Firestore)
- Recharts
- React Hook Form + Zod
- Sonner (toasts)
# budget
