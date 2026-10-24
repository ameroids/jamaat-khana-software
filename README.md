# Jamaat Khana Wedding Hall Booking — AMEROIDS TECH STUDIO
*INNOVATE • BUILD • ELEVATE.* React + Vite demo using browser localStorage. No Supabase / real Razorpay yet.

## Run
`npm install` then `npm run dev`

## Demo logins (fictional)
- Members: ITS `40010001`–`40010004`, password `member123` (`40010005` is inactive).
- Admin: `admin@ameroids.demo` / `admin123` at `/admin/login`.

## Features
Framer Motion transitions; member profile; admin calendar with hall/slot/status filters and temporary holds; ITS-number login; hall listing with search/filter/sort; hall details; availability calendar (green/yellow/red/grey computed from bookings, holds and blocks); 3 slots; booking form with capacity validation; configurable advance (25%) and hold time (10 min); DEMO PAYMENT (UPI/Card/Net Banking, choose success or failure); printable receipt; member dashboard with cancel; admin overview, bookings (search/filter/paginate/CSV/notes/offline payments/cancel+refund), payments, members, halls (edit/enable/blocks), settings, audit log, reset demo data.

## Structure
`src/services/db.js` is the single data/business-logic layer (auth, availability, holds, bookings, payments, settings, audit). `src/App.jsx` holds pages; `src/styles/app.css` styling. Replace `db.js` with a Supabase adapter later.
Pending bookings carry a `holdExpiresAt` that acts as the temporary slot hold; unique key is hallId + bookingDate + slotId.

## Limitations & security
localStorage is single-browser: no cross-device conflict protection, no atomic transactions. Passwords are hashed with a weak demo hash only; admin/member checks run in the browser and are NOT secure. Before production: server-side auth with proper password hashing, authorised ITS verification, row-level security, DB unique constraint on (hall_id, booking_date, slot_id), atomic slot reservation, server-side booking confirmation, and Razorpay payment verification via signed webhooks with secrets kept server-side.
Proposed tables: members, admins, halls, hall_slots, bookings, slot_holds, payments, blocked_slots, admin_audit_logs, app_settings.
