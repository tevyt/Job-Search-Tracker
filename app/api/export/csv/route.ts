import { auth } from "@clerk/nextjs/server";
import { getApplicationsByUser } from "@/lib/queries/applications";

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const applications = await getApplicationsByUser(userId);

  const headers = [
    "Company Name",
    "Job Title",
    "Status",
    "Date Applied",
    "URL",
    "Salary Range",
    "Contact",
    "Location",
    "Work Mode",
    "Notes",
  ];

  const rows = applications.map((app) => [
    escapeCsv(app.companyName),
    escapeCsv(app.jobTitle),
    escapeCsv(app.status),
    new Date(app.dateApplied).toISOString().split("T")[0],
    escapeCsv(app.url ?? ""),
    escapeCsv(app.salaryRange ?? ""),
    escapeCsv(app.contact ?? ""),
    escapeCsv(app.location ?? ""),
    escapeCsv(app.workMode ?? ""),
    escapeCsv(app.notes ?? ""),
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="job-applications.csv"',
    },
  });
}
