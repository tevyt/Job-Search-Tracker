# Job Search Tracker — Requirements

## 1. Overview

A web application that allows users to track their job applications and monitor their progress through the hiring pipeline. Users can add, edit, and review applications, and generate visual reports on their job search activity.

---

## 2. Functional Requirements

### 2.1 Authentication

- **FR-AUTH-1**: Users must be able to create an account and log in via Clerk's managed authentication (email/password and OAuth providers supported out of the box).
- **FR-AUTH-2**: Users must be able to log out.
- **FR-AUTH-3**: Only authenticated users may access the dashboard and any application data.
- **FR-AUTH-4**: Each user's data is private and isolated from other users.

### 2.2 Dashboard

- **FR-DASH-1**: After login, the user is presented with a dashboard listing all of their job applications.
- **FR-DASH-2**: Each application entry displays at minimum: company name, job title, current status, and date applied.
- **FR-DASH-3**: Applications should be sortable by date applied, company name, and status.
- **FR-DASH-4**: Applications should be filterable by status and work mode via dropdown/select filters.
- **FR-DASH-5**: Applications should be searchable via free-text input, matching against company name and job title.

- **FR-DASH-6**: All applications load on a single page (no pagination for v1).

- **FR-DASH-7**: Default sort order: by status progress (furthest along first), then alphabetically by company name.

### 2.3 Job Application Management

- **FR-APP-1**: Users can add a new job application with the following fields:
  - Company name (required)
  - Job title (required)
  - Status (required, default: "Applied")
  - Date applied (required, default: today)
  - URL / link to job posting (optional)
  - Salary range (optional, free-text)
  - Contact person (optional)
  - Location (optional)
  - Work mode (optional: Remote, Hybrid, Onsite)
  - Notes (optional, free-text)
- **FR-APP-2**: Users can edit any field of an existing application.
- **FR-APP-3**: Users can delete an application. Deletion requires a confirmation prompt.
- **FR-APP-4**: Application statuses follow a defined set of values:
  - Applied
  - Screening
  - Interviewing
  - Offer
  - Accepted
  - Rejected
  - Withdrawn

### 2.4 Reporting & Statistics

- **FR-RPT-1**: Users can access a reports page showing statistics on their job search.
- **FR-RPT-2**: Display a bar chart showing the number of applications in each status.
- **FR-RPT-3**: Display a timeline chart of applications over time (e.g. applications per week/month).
- **FR-RPT-4**: Show summary statistics: total applications, response rate, interview rate.
- **FR-RPT-5**: Users can export their application data to CSV.

---

## 3. Non-Functional Requirements

### 3.1 Technology Stack

- **NFR-TECH-1**: Frontend built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS.
- **NFR-TECH-2**: Backend API provided via Next.js API routes / Server Actions.
- **NFR-TECH-3**: Database: PostgreSQL, hosted via Supabase.
- **NFR-TECH-4**: ORM: Prisma for schema management, migrations, and typed queries.
- **NFR-TECH-5**: Authentication: Clerk (managed auth with built-in UI components).
- **NFR-TECH-6**: Charting: Recharts for data visualizations.

### 3.2 Performance

- **NFR-PERF-1**: Dashboard should load within 2 seconds on a standard connection.
- **NFR-PERF-2**: Application add/edit operations should complete within 1 second.

### 3.3 Usability

- **NFR-UX-1**: The application must be responsive and usable on mobile, tablet, and desktop.
- **NFR-UX-2**: The UI should follow accessible design practices (WCAG 2.1 AA).

### 3.4 Security

- **NFR-SEC-1**: Passwords must be hashed and never stored in plaintext.
- **NFR-SEC-2**: API routes must validate that the authenticated user owns the requested data.
- **NFR-SEC-3**: All user input must be sanitized to prevent XSS and injection attacks.

### 3.5 Reliability

- **NFR-REL-1**: Data changes should be persisted immediately — no data loss on page refresh.

---

## 4. Out of Scope (v1)

- Email notifications or reminders
- Integration with job boards (LinkedIn, Indeed, etc.)
- Multi-user collaboration or sharing
- Resume/cover letter storage
- Status change history / audit log (future iteration)
- Custom user-defined statuses (future iteration)
- Dashboard pagination (future iteration, when data volume warrants it)
- PDF report export (future iteration)
- Report date range filtering (future iteration)

---

## 5. Remaining Open Questions

No open questions — all major decisions resolved for v1.
