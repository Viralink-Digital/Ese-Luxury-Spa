# Ese Luxury Cosmetics - Full Platform Architecture

## Stack
- **Frontend**: React 18 SPA (Vite) + React Router v6 + Zustand + TanStack Query
- **Backend**: Node.js + Express.js REST API
- **Database**: MySQL + Prisma ORM
- **Cache/Queue**: BullMQ (in-process fallback; Redis removed)
- **Auth**: JWT + Refresh Tokens + SMS OTP (TextBee)
- **Payments**: Korapay
- **Background Jobs**: BullMQ Workers + node-cron
