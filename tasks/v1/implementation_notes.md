# Job Search Tracker v1 — Implementation Notes

## Phase 1: Project Foundation & Authentication

### Prisma 7 Breaking Changes

Prisma 7 introduced significant changes from earlier versions:

- **Connection URLs removed from `schema.prisma`**: The `url` and `directUrl` properties are no longer allowed in the `datasource` block. They must be configured in `prisma.config.ts` instead.
- **Client output location**: Prisma 7 defaults to generating the client in `app/generated/prisma` rather than `node_modules/.prisma/client`.
- **No barrel export**: Prisma 7 does not generate an `index.ts` barrel file, so importing from `@/app/generated/prisma` directly does not work. Each module must be imported individually:
  - Enums: `@/app/generated/prisma/enums`
  - Client: `@/app/generated/prisma/client`
  - Models/types: `@/app/generated/prisma/models`
- **Environment loading**: `prisma.config.ts` uses `dotenv` to load environment variables. The default `import "dotenv/config"` loads `.env`, not `.env.local`. We switched to `dotenv.config({ path: ".env.local" })` to load the correct file.

### Supabase + Prisma Connection Issues

- **Pooled connections hang for migrations**: `prisma migrate dev` and `prisma db push` hang indefinitely when using the Supabase pooled connection (port `6543`). The `directUrl` config in `prisma.config.ts` did not resolve this for `db push`.
- **Workaround**: Used `prisma db push` with the direct URL (port `5432`) set as the primary `url` in the config, then restored the pooled URL after. For future migrations, either temporarily swap URLs or use the direct URL.
- **Both connections are reachable**: TCP connectivity to both the pooler and direct host was confirmed via `openssl s_client`. The issue is specific to how Prisma interacts with PgBouncer in transaction mode.

### Stale `.env` File

Prisma `init` generates a `.env` file with a localhost `DATABASE_URL`. Since `dotenv/config` loads `.env` by default (not `.env.local`), this stale file caused Prisma to try connecting to localhost instead of Supabase. We deleted `.env` and pointed `prisma.config.ts` at `.env.local` explicitly.

### Clerk Integration

Clerk setup was straightforward with no issues:
- `ClerkProvider` wraps the root layout
- `clerkMiddleware` with `createRouteMatcher` protects all routes except `/sign-in` and `/sign-up`
- `auth()` from `@clerk/nextjs/server` provides `userId` in Server Components
- Sign-in/sign-up pages use Clerk's pre-built `<SignIn />` and `<SignUp />` components

### Design Decision: Supabase over Vercel Postgres

Switched from Vercel Postgres to Supabase mid-implementation. Since we use Prisma as the ORM and Clerk for auth, we only use Supabase as a PostgreSQL host — no Supabase client SDK or Supabase-specific features are needed. The connection string format is standard PostgreSQL.
