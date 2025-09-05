---
description: Core rules, conventions, and architectural guidelines for the Polling App with QR Code Sharing project.
globs:
  alwaysApply: true
---

# 📌 Project Overview
The **Polling App with QR Code Sharing** is a Next.js web application where users can register, create polls, and share them via unique links and QR codes.  
Follow these rules to ensure **consistency, maintainability, and production quality** across the codebase.

# 🛠️ Technology Stack
- **Language:** TypeScript  
- **Framework:** Next.js (App Router)  
- **Database & Auth:** Supabase  
- **Styling:** Tailwind CSS + shadcn/ui components  
- **Forms:** react-hook-form with shadcn/ui inputs  
- **State Management:**  
  - Server Components → for server state and data fetching  
  - Client Components (`"use client"`) → only when interactivity (hooks/events/state) is needed  
- **API Communication:** Next.js Server Actions for mutations (poll creation, voting)  
- **Utilities:** `qrcode.react` for QR code generation  

# 🏗️ Architecture & Code Conventions
- **Directory Structure**
  - `/app/polls` → Poll routes/pages  
  - `/app/api` → API route handlers (only if Server Actions aren’t viable)  
  - `/components/ui` → shadcn/ui components  
  - `/components/` → custom reusable components  
  - `/lib` → Supabase client, utilities, Server Actions  

- **Component Design**
  - Default to **Server Components** for rendering and fetching  
  - Use **Client Components** sparingly, only where interactivity is required  

- **Naming Conventions**
  - Components → `PascalCase` (e.g., `CreatePollForm.tsx`)  
  - Utilities & Server Actions → `camelCase` (e.g., `submitVote.ts`)  

- **Error Handling**
  - Always wrap async logic in `try/catch` inside Server Actions and Route Handlers  
  - Use Next.js `error.tsx` for route-level error boundaries  

- **Security**
  - Never hardcode secrets  
  - Store Supabase credentials in `.env.local`  
  - Access using `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.SUPABASE_SECRET_KEY`  

# 📋 Code Patterns & Best Practices
- ✅ Forms must use **react-hook-form** + shadcn/ui inputs  
- ✅ Data mutations must use **Server Actions**, not client fetches  
- ✅ Fetch data in **Server Components**, never with `useEffect` in page components  
- ✅ Use shadcn/ui + Tailwind CSS for UI consistency  
- ✅ Generate QR codes with `qrcode.react`  
- ❌ Do not introduce new libraries or frameworks without explicit approval  

# 🔍 Verification Checklist
Before finalizing code, confirm:  
1. Uses **Next.js App Router** and Server Components for fetching.  
2. Uses **Server Actions** for all poll-related mutations.  
3. Database and auth logic flows through the Supabase client.  
4. UI uses **shadcn/ui** + Tailwind conventions.  
5. Secrets are pulled from **environment variables** only.  
