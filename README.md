# Job Search Tracker

A web application for tracking job applications and monitoring progress through the hiring pipeline. Users can add, edit, and review applications, and generate visual reports on their job search activity.

This project also serves as an experiment in **Spec Driven Development** — all features are defined through detailed requirements and technical specifications before implementation begins. See `requirements.md`, `specs.md`, and `tasks/` for the full spec-to-implementation workflow.

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma 7
- **Charts**: Recharts

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```
4. Push the database schema:
   ```bash
   npx prisma db push
   ```
5. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
requirements.md          # Functional & non-functional requirements
specs.md                 # Technical specification
tasks/                   # Implementation plans, notes, and tracking
app/                     # Next.js App Router pages
components/              # React components
lib/                     # Shared utilities, actions, queries
prisma/                  # Database schema
```
