# Job Search Tracker — Technical Specification

## 1. Architecture Overview

The application follows a standard Next.js App Router architecture with server-side rendering, Server Actions for mutations, and Clerk for authentication. Data is stored in PostgreSQL via Prisma ORM.

```
┌─────────────────────────────────────────────┐
│                   Client                     │
│  React Components + Recharts + Clerk UI      │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│              Next.js App Router              │
│  ┌─────────────┐  ┌──────────────────────┐  │
│  │ Server       │  │ Server Actions       │  │
│  │ Components   │  │ (mutations)          │  │
│  └──────┬──────┘  └──────────┬───────────┘  │
│         │                    │               │
│  ┌──────▼────────────────────▼───────────┐  │
│  │         Prisma Client                  │  │
│  └──────────────────┬────────────────────┘  │
└─────────────────────┼───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│          PostgreSQL (Supabase)         │
└──────────────────────────────────────────────┘
```

**Authentication flow**: Clerk middleware protects all routes except the sign-in/sign-up pages. Clerk provides the `userId` which is used as the foreign key to scope all database queries.

---

## 2. Database Schema

### 2.1 Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

enum ApplicationStatus {
  APPLIED
  SCREENING
  INTERVIEWING
  OFFER
  ACCEPTED
  REJECTED
  WITHDRAWN
}

enum WorkMode {
  REMOTE
  HYBRID
  ONSITE
}

model JobApplication {
  id          String            @id @default(cuid())
  userId      String
  companyName String
  jobTitle    String
  status      ApplicationStatus @default(APPLIED)
  dateApplied DateTime          @default(now())
  url         String?
  salaryRange String?
  contact     String?
  location    String?
  workMode    WorkMode?
  notes       String?
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  @@index([userId])
  @@index([userId, status])
}
```

### 2.2 Schema Notes

- `userId` stores the Clerk user ID (string). No local `User` table is needed since Clerk manages user data.
- `@@index([userId])` ensures efficient dashboard queries scoped to a single user.
- `@@index([userId, status])` supports filtering by status and reporting queries.
- `dateApplied` is separate from `createdAt` — users may backfill applications they applied to previously.
- Status progress order for default sorting (highest to lowest): `ACCEPTED`, `OFFER`, `INTERVIEWING`, `SCREENING`, `APPLIED`, `WITHDRAWN`, `REJECTED`.

---

## 3. Project Structure

```
app/
├── layout.tsx                  # Root layout with ClerkProvider
├── page.tsx                    # Redirect to /dashboard or /sign-in
├── sign-in/[[...sign-in]]/
│   └── page.tsx                # Clerk sign-in page
├── sign-up/[[...sign-up]]/
│   └── page.tsx                # Clerk sign-up page
├── dashboard/
│   ├── page.tsx                # Dashboard — list of applications
│   └── loading.tsx             # Loading skeleton
├── applications/
│   ├── new/
│   │   └── page.tsx            # Add new application form
│   └── [id]/
│       └── edit/
│           └── page.tsx        # Edit application form
├── reports/
│   └── page.tsx                # Reports & statistics page
└── api/
    └── export/
        └── csv/
            └── route.ts        # CSV export API route

lib/
├── db.ts                       # Prisma client singleton
├── actions/
│   └── applications.ts         # Server Actions (create, update, delete)
├── queries/
│   └── applications.ts         # Data fetching functions
├── constants.ts                # Status order, labels, colors
└── utils.ts                    # Shared utilities (CSV generation, etc.)

components/
├── application-table.tsx       # Sortable, filterable application list
├── application-form.tsx        # Shared form for create/edit
├── search-bar.tsx              # Free-text search input
├── status-filter.tsx           # Status dropdown filter
├── work-mode-filter.tsx        # Work mode dropdown filter
├── sort-controls.tsx           # Sort column/direction controls
├── delete-confirmation.tsx     # Delete confirmation dialog
├── status-bar-chart.tsx        # Recharts bar chart (status breakdown)
├── timeline-chart.tsx          # Recharts timeline chart
├── stats-summary.tsx           # Summary statistics cards
└── csv-export-button.tsx       # Trigger CSV download

prisma/
├── schema.prisma               # Database schema
└── migrations/                 # Prisma migrations

middleware.ts                   # Clerk auth middleware
```

---

## 4. Authentication

### 4.1 Clerk Setup

- `ClerkProvider` wraps the root layout.
- `middleware.ts` uses Clerk's `clerkMiddleware()` to protect all routes except `/sign-in` and `/sign-up`.
- `auth()` from `@clerk/nextjs/server` provides the `userId` in Server Components and Server Actions.

### 4.2 Data Isolation

Every database query includes a `where: { userId }` clause. Server Actions validate the `userId` from `auth()` before any mutation. No application can be read, updated, or deleted without matching the authenticated user's ID.

---

## 5. Server Actions

Defined in `lib/actions/applications.ts`. All actions call `auth()` to get the `userId` and reject if unauthenticated.

### 5.1 `createApplication(formData: FormData)`

- Validates required fields (companyName, jobTitle).
- Sets defaults: status = `APPLIED`, dateApplied = today.
- Creates record with `prisma.jobApplication.create()`.
- Calls `revalidatePath("/dashboard")`.
- Redirects to `/dashboard`.

### 5.2 `updateApplication(id: string, formData: FormData)`

- Verifies the application belongs to the authenticated user.
- Updates record with `prisma.jobApplication.update()`.
- Calls `revalidatePath("/dashboard")`.
- Redirects to `/dashboard`.

### 5.3 `deleteApplication(id: string)`

- Verifies the application belongs to the authenticated user.
- Deletes record with `prisma.jobApplication.delete()`.
- Calls `revalidatePath("/dashboard")`.

---

## 6. Dashboard

### 6.1 Data Fetching

The dashboard page is a Server Component that fetches all applications for the authenticated user:

```typescript
const applications = await prisma.jobApplication.findMany({
  where: { userId },
  orderBy: [/* handled client-side for interactivity */],
});
```

Applications are passed to the client-side `ApplicationTable` component for sorting, filtering, and searching.

### 6.2 Sorting

Client-side sorting with the following logic:

- **Default**: Status progress order (defined in `lib/constants.ts`), then alphabetical by company name.
- **User-selectable**: Date applied, company name, status. Each toggles ascending/descending.

Status progress order (highest first):
1. Accepted
2. Offer
3. Interviewing
4. Screening
5. Applied
6. Withdrawn
7. Rejected

### 6.3 Filtering & Search

Client-side filtering using React state:

- **Status filter**: Dropdown that filters to a single status or "All".
- **Work mode filter**: Dropdown that filters to a single work mode or "All".
- **Free-text search**: Filters applications where company name or job title includes the search string (case-insensitive).

All three filters compose — they are applied together.

---

## 7. Application Forms

### 7.1 Shared Form Component

`ApplicationForm` is a client component used by both the create and edit pages. It receives optional initial values (for edit) and submits via the appropriate Server Action.

### 7.2 Validation

- Client-side: Required field validation before submission (companyName, jobTitle).
- Server-side: Server Actions validate required fields and reject invalid enum values for status and workMode. Prisma's typed client provides an additional layer of type safety.

### 7.3 Delete Flow

The edit page includes a delete button that triggers a confirmation dialog (`DeleteConfirmation` component). On confirm, it calls the `deleteApplication` Server Action.

---

## 8. Reports Page

### 8.1 Data Fetching

Server Component that fetches all applications for the user, then computes aggregations before passing to chart components.

### 8.2 Status Bar Chart

- **Component**: `StatusBarChart` using Recharts `<BarChart>`.
- **Data**: Count of applications grouped by status.
- **Display**: One bar per status, colored by status type (e.g., green for Accepted, red for Rejected).

### 8.3 Timeline Chart

- **Component**: `TimelineChart` using Recharts `<BarChart>` or `<LineChart>`.
- **Data**: Applications grouped by week or month (based on `dateApplied`).
- **Display**: Shows application volume over time.

### 8.4 Summary Statistics

- **Component**: `StatsSummary` displaying card-style metrics.
- **Metrics**:
  - Total applications
  - Response rate: `(total - APPLIED) / total` — percentage that moved beyond "Applied"
  - Interview rate: `INTERVIEWING + OFFER + ACCEPTED / total`

### 8.5 CSV Export

- **Route**: `GET /api/export/csv`
- Fetches all applications for the authenticated user.
- Generates CSV with all fields as columns.
- Returns response with `Content-Type: text/csv` and `Content-Disposition: attachment` headers.
- Triggered by `CsvExportButton` which opens the route in a new tab or uses `fetch` + `Blob`.

---

## 9. Middleware

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

---

## 10. Environment Variables

```
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database (Supabase)
DATABASE_URL=
DIRECT_URL=
```

---

## 11. Key Dependencies

| Package | Purpose |
|---------|---------|
| `next` | Framework (App Router) |
| `react` / `react-dom` | UI library |
| `@clerk/nextjs` | Authentication |
| `prisma` / `@prisma/client` | ORM & database access |
| `recharts` | Charts & visualizations |
| `tailwindcss` | Styling |

---

## 12. Requirement Traceability

| Requirement | Implementation |
|-------------|---------------|
| FR-AUTH-1, FR-AUTH-2 | Clerk sign-in/sign-up pages, ClerkProvider |
| FR-AUTH-3 | Clerk middleware (`auth.protect()`) |
| FR-AUTH-4 | `userId` scoping on all queries |
| FR-DASH-1 | `dashboard/page.tsx` Server Component |
| FR-DASH-2 | `ApplicationTable` columns |
| FR-DASH-3 | `SortControls` client-side sorting |
| FR-DASH-4 | `StatusFilter`, `WorkModeFilter` dropdowns |
| FR-DASH-5 | `SearchBar` free-text filtering |
| FR-DASH-6 | Single `findMany` query, no pagination |
| FR-DASH-7 | Default sort in `lib/constants.ts` |
| FR-APP-1 | `ApplicationForm` + `createApplication` action |
| FR-APP-2 | `ApplicationForm` + `updateApplication` action |
| FR-APP-3 | `DeleteConfirmation` + `deleteApplication` action |
| FR-APP-4 | `ApplicationStatus` Prisma enum |
| FR-RPT-1 | `reports/page.tsx` |
| FR-RPT-2 | `StatusBarChart` (Recharts) |
| FR-RPT-3 | `TimelineChart` (Recharts) |
| FR-RPT-4 | `StatsSummary` component |
| FR-RPT-5 | `GET /api/export/csv` route |
| NFR-SEC-2 | `userId` check in all Server Actions |
| NFR-SEC-3 | Prisma parameterized queries, React's built-in XSS protection |
