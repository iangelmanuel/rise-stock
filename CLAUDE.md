# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Next.js dev server (Turbopack)
pnpm build            # Production build
pnpm lint             # ESLint
pnpm prettier         # Format with Prettier
pnpm prettier:check   # Check formatting

# Prisma
pnpm prisma migrate dev --name <description>  # New migration
pnpm prisma migrate deploy                    # Apply migrations
pnpm prisma generate                          # Regenerate client
pnpm seed                                     # Seed database
```

No test suite configured.

## Environment Variables

Copy `.env.template` → `.env.local`:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
SITE_URL="http://localhost:3000"
RESEND_API_KEY="..."
```

## Architecture

**Next.js 16 App Router** with two route groups:
- `app/(auth)/` — protected dashboard routes (requires session)
- `app/(no-auth)/` — public routes (landing, login, register)

Middleware/auth guard lives in `src/auth.ts` (NextAuth v5 beta with credentials provider). Session JWT stores full user object via custom `jwt`/`session` callbacks.

**Two user types in the schema:**
- `User` — internal admin users who log in and manage stock/sales
- `Client` — e-commerce customers who place orders (not yet wired to auth)

**Data layer:**
- Prisma 7 with `@prisma/adapter-pg` (driver adapter, not default engine)
- Client generated to `generated/prisma/` (not the default `node_modules/.prisma`)
- Import from `src/lib/prisma.ts` — singleton `PrismaClient` with `PrismaPg` adapter
- Import types from `@prisma/client` (re-exported from generated output)

**Server actions** in `src/actions/` — all use `"use server"`, check `auth()` session, validate with Zod, then call `prisma`. Pattern:
```ts
return { ok: boolean, message: string }
```
Mutations log to `UserMovement` table and call `revalidatePath`.

**API routes** in `app/api/` — `contact`, `newsletter`, `products`, `orders`. Orders route is WIP (references stale variable names from an earlier pattern).

**Images:** Cloudinary via `src/utils/create-cloudinary-img.ts`. `next.config.ts` whitelists `res.cloudinary.com`.

**Email:** Resend + `@react-email/components` for transactional email templates in `src/components/email/`.

**UI stack:** Radix UI primitives + shadcn component pattern (`components.json` present), Tailwind CSS v4, `clsx`/`tailwind-merge` via `src/lib/utils.ts`.

**Schemas/validation:** Zod v4 in `src/schemas/`. Uses `z.uuid()` (Zod v4 API — not `z.string().uuid()`). UUIDs are the ID type everywhere.

**Discount logic:** `discount` field on `Clothes` and `OrderItem` is a multiplier (default `1` = no discount). A value < 1 means discounted. Apply as `price * discount`.

**Sale statuses** (admin-facing): `PENDING | COOKING | READY | SENDING | PENDING_PAYMENT | COMPLETED | CANCELLED | PAUSED`

**Order statuses** (e-commerce): `PENDING | PROCESSING | APPROVED | SHIPPED | DELIVERED | CANCELLED`

**Tax:** `TAX_RATE` constant in `src/data/tax.ts` — used in order total calculations.
