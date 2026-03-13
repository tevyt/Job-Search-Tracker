# Job Search Tracker v1 — Implementation Plan

## Phase 1: Project Foundation & Authentication

### Task 1.1: Install Dependencies

- Install `@clerk/nextjs`, `prisma`, `@prisma/client`, `recharts`
- Run `npx prisma init` to scaffold `prisma/schema.prisma` and `.env`

### Task 1.2: Environment Configuration

- Create `.env.local` with Clerk and database environment variables (see specs.md §10)
- Add `.env.local` to `.gitignore` (if not already present)
- Create `.env.example` with placeholder values for documentation

### Task 1.3: Prisma Schema & Database Setup

- Write the Prisma schema per specs.md §2.1 (`ApplicationStatus` enum, `WorkMode` enum, `JobApplication` model)
- Run `npx prisma migrate dev --name init` to create the initial migration
- Create `lib/db.ts` — Prisma client singleton with global caching for development

### Task 1.4: Clerk Authentication

- Wrap root `app/layout.tsx` with `ClerkProvider`
- Create `middleware.ts` with Clerk route protection (specs.md §9)
- Create `app/sign-in/[[...sign-in]]/page.tsx` with Clerk's `<SignIn />` component
- Create `app/sign-up/[[...sign-up]]/page.tsx` with Clerk's `<SignUp />` component
- Update `app/page.tsx` to redirect to `/dashboard`

### Task 1.5: Verify Auth Flow

- Start dev server, confirm unauthenticated users are redirected to sign-in
- Confirm sign-up, sign-in, and sign-out work
- Confirm `auth()` returns a valid `userId` in a Server Component

**Phase 1 deliverable**: Authenticated app skeleton — users can sign up, log in, and reach an empty dashboard page.

---

## Phase 2: Shared Constants & Utilities

### Task 2.1: Constants

- Create `lib/constants.ts` with:
  - `STATUS_ORDER` — array defining status progress order for sorting (Accepted > Offer > Interviewing > Screening > Applied > Withdrawn > Rejected)
  - `STATUS_LABELS` — display-friendly labels for each status
  - `STATUS_COLORS` — color mapping for charts and badges
  - `WORK_MODE_LABELS` — display-friendly labels for work modes

### Task 2.2: Query Functions

- Create `lib/queries/applications.ts` with:
  - `getApplicationsByUser(userId: string)` — fetch all applications for a user
  - `getApplicationById(id: string, userId: string)` — fetch single application with ownership check

**Phase 2 deliverable**: Shared constants and data access layer ready for use by all features.

---

## Phase 3: Application Management (CRUD)

### Task 3.1: Server Actions

- Create `lib/actions/applications.ts` with:
  - `createApplication(formData: FormData)` — validate, create, revalidate, redirect
  - `updateApplication(id: string, formData: FormData)` — verify ownership, update, revalidate, redirect
  - `deleteApplication(id: string)` — verify ownership, delete, revalidate
- All actions call `auth()` and reject if unauthenticated
- All actions validate required fields server-side

### Task 3.2: Application Form Component

- Create `components/application-form.tsx` (client component)
  - Accepts optional `initialData` prop for edit mode
  - Fields: company name, job title, status (select), date applied (date picker), URL, salary range, contact, location, work mode (select), notes (textarea)
  - Client-side required field validation
  - Submits via Server Action (`createApplication` or `updateApplication`)

### Task 3.3: New Application Page

- Create `app/applications/new/page.tsx`
  - Renders `ApplicationForm` with no initial data
  - Page title: "Add Application"

### Task 3.4: Edit Application Page

- Create `app/applications/[id]/edit/page.tsx`
  - Server Component that fetches the application by ID (with ownership check)
  - Renders `ApplicationForm` with initial data
  - Includes delete button with `DeleteConfirmation` dialog

### Task 3.5: Delete Confirmation Component

- Create `components/delete-confirmation.tsx` (client component)
  - Modal/dialog that asks "Are you sure you want to delete this application?"
  - Confirm button calls `deleteApplication` Server Action
  - Cancel button dismisses the dialog

**Phase 3 deliverable**: Users can create, edit, and delete job applications.

---

## Phase 4: Dashboard

### Task 4.1: Dashboard Page

- Create `app/dashboard/page.tsx` (Server Component)
  - Fetches all applications for the authenticated user via `getApplicationsByUser`
  - Passes data to `ApplicationTable` client component
  - Includes "Add Application" button linking to `/applications/new`
  - Shows empty state message when no applications exist

### Task 4.2: Application Table Component

- Create `components/application-table.tsx` (client component)
  - Displays applications in a table with columns: company name, job title, status (as colored badge), date applied, work mode
  - Each row links to `/applications/[id]/edit`
  - Manages sorting, filtering, and search state internally

### Task 4.3: Sorting

- Create `components/sort-controls.tsx`
  - Clickable column headers that toggle sort direction
  - Default sort: status progress order, then company name alphabetically
  - Uses `STATUS_ORDER` from constants for status ranking

### Task 4.4: Filtering

- Create `components/status-filter.tsx` — dropdown with "All" + each status value
- Create `components/work-mode-filter.tsx` — dropdown with "All" + each work mode value
- Filters compose with each other and with search

### Task 4.5: Search

- Create `components/search-bar.tsx`
  - Text input with debounced filtering
  - Matches against company name and job title (case-insensitive)

### Task 4.6: Dashboard Loading State

- Create `app/dashboard/loading.tsx` with skeleton UI

**Phase 4 deliverable**: Fully functional dashboard with sorting, filtering, and search.

---

## Phase 5: Reports & Statistics

### Task 5.1: Reports Page

- Create `app/reports/page.tsx` (Server Component)
  - Fetches all applications for the user
  - Computes aggregations (status counts, timeline groupings, summary stats)
  - Passes computed data to chart components
  - Shows empty state when no data available

### Task 5.2: Status Bar Chart

- Create `components/status-bar-chart.tsx` (client component)
  - Recharts `<BarChart>` with one bar per status
  - Uses `STATUS_COLORS` for bar fills
  - Labeled axes, tooltips on hover

### Task 5.3: Timeline Chart

- Create `components/timeline-chart.tsx` (client component)
  - Recharts `<BarChart>` or `<LineChart>` showing applications per month
  - Groups applications by `dateApplied` month
  - X-axis: months, Y-axis: application count

### Task 5.4: Summary Statistics

- Create `components/stats-summary.tsx`
  - Card-style layout showing:
    - Total applications
    - Response rate: `(total - applied_count) / total`
    - Interview rate: `(interviewing + offer + accepted) / total`

### Task 5.5: CSV Export

- Create `app/api/export/csv/route.ts`
  - `GET` handler that authenticates via Clerk, fetches all user applications
  - Generates CSV string with all fields as columns
  - Returns with `Content-Type: text/csv` and `Content-Disposition: attachment; filename="job-applications.csv"`
- Create `components/csv-export-button.tsx` — button that triggers the download

**Phase 5 deliverable**: Reports page with charts, summary stats, and CSV export.

---

## Phase 6: Navigation & Polish

### Task 6.1: Navigation

- Add a shared navigation bar to the root layout or a layout group
  - Links: Dashboard, Reports
  - Clerk `<UserButton />` for account/sign-out
  - Responsive (hamburger menu on mobile)

### Task 6.2: Responsive Design

- Review all pages and components for mobile/tablet/desktop responsiveness
- Ensure table scrolls horizontally on small screens or switches to a card layout
- Verify forms are usable on mobile

### Task 6.3: Empty States

- Dashboard: friendly message + CTA to add first application when list is empty
- Reports: message indicating no data available yet

### Task 6.4: Error Handling

- Server Action error states surfaced to the user (form validation errors)
- 404 handling for invalid application IDs on edit page

**Phase 6 deliverable**: Polished, navigable, responsive application ready for use.

---

## Implementation Order Summary

| Phase | Focus | Key Dependencies |
|-------|-------|-----------------|
| 1 | Foundation & Auth | None — start here |
| 2 | Constants & Queries | Phase 1 (Prisma, Clerk) |
| 3 | CRUD Operations | Phase 2 (queries, constants) |
| 4 | Dashboard | Phase 3 (data to display, CRUD actions) |
| 5 | Reports | Phase 2 (queries, constants) — can parallel with Phase 4 |
| 6 | Navigation & Polish | Phases 4 & 5 (all pages exist) |
