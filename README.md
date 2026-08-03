# Debtshare

A web app to split shared expenses between friends, roommates, and travel groups: scan tickets, record expenses, split costs, and settle debts easily.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Framer Motion + Sonner
- Geist Sans / Geist Mono (auto-hosted via Fontsource)
- All data is currently mocked in `lib/mocks` — a real backend is on the way

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — development server (Turbopack)
- `npm run build` — production build
- `npm run start` — start the production server
- `npm run lint` — run ESLint

## Structure

- `app/` — routes (auth, dashboard, groups)
- `components/ui/` — shadcn/ui primitives
- `components/custom/` — app-specific components
- `lib/types/` — domain types
- `lib/mocks/` — mocked API (async, simulates latency)
- `lib/utils/` — helpers

## License

MIT
