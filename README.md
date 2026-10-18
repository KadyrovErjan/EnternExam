# InternExam

Production-oriented examination platform for IT internship admission. Russian UI, Supabase Auth/PostgreSQL, server-side scoring and a reviewable anti-cheat event log.

## What is implemented

- Student-only public registration; the role is created by a database trigger and cannot be elevated through browser metadata.
- Student dashboard, protected attempts, server-randomized question/option order, automatic answer saving, server deadline and idempotent finalization.
- Best-effort event tracking (`visibilitychange`, blur/focus-related window event, offline/online, `pagehide`, `sendBeacon`, heartbeat). These events are signals for review, not proof of cheating.
- Admin dashboard, key-confirmation UI, database-level block against publishing an exam with unconfirmed keys, and CSV result export.
- RLS policies and security-definer RPCs so clients never receive correct answers before finalization.
- DOCX importer that preserves source wording/options, is repeatable, verifies exactly 45 questions, and imports only as a draft with **no guessed answer keys**.

## Local setup

1. Create a Supabase project and copy `.env.example` to `.env.local`; provide the project URL, anon key and service-role key. Keep the service role key server-only.
2. Apply [`supabase/migrations/202610180001_internexam.sql`](supabase/migrations/202610180001_internexam.sql) with `supabase db push` (or the Supabase SQL editor).
3. Create at least one group and mentor in the database, then create the first admin: `npm run bootstrap:admin`.
4. Import the supplied test: `npm run import:python -- "C:\Users\USER\Downloads\Тест_Python_Django_DRF.docx"`.
5. Review each of the 45 answer keys in `/admin/questions`, then set the exam state to `PUBLISHED` in the admin tooling/database. The database rejects publishing before all keys are confirmed.
6. Run `npm run dev`. Before production, run `npm run typecheck` and `npm run build`.

## Deploy to Vercel

Connect the repository to Vercel, configure the four variables from `.env.example` in the Vercel project settings, then deploy. Never expose `SUPABASE_SERVICE_ROLE_KEY` with a `NEXT_PUBLIC_` prefix.

## Remaining owner actions

The supplied DOCX does not provide a verified answer key. An authorized academic reviewer must confirm all 45 keys. A Supabase project and Vercel account are also required for a real deployment; this repository contains no credentials or deployment URL.
