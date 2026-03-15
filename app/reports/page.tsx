import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getApplicationsByUser } from "@/lib/queries/applications";
import { ApplicationStatus } from "@/app/generated/prisma/enums";
import { STATUS_LABELS, STATUS_COLORS, STATUS_ORDER } from "@/lib/constants";
import StatusBarChart from "@/components/status-bar-chart";
import TimelineChart from "@/components/timeline-chart";
import StatsSummary from "@/components/stats-summary";
import CsvExportButton from "@/components/csv-export-button";

export default async function ReportsPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const applications = await getApplicationsByUser(userId);

  if (applications.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Reports</h1>
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            No data available yet. Add some applications to see your reports.
          </p>
          <a
            href="/applications/new"
            className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Application
          </a>
        </div>
      </div>
    );
  }

  // Status counts
  const statusCounts = STATUS_ORDER.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    count: applications.filter((a) => a.status === status).length,
    color: STATUS_COLORS[status],
  })).filter((d) => d.count > 0);

  // Timeline data — group by month
  const timelineMap = new Map<string, number>();
  for (const app of applications) {
    const date = new Date(app.dateApplied);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    timelineMap.set(key, (timelineMap.get(key) ?? 0) + 1);
  }
  const timelineData = Array.from(timelineMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => {
      const [year, m] = month.split("-");
      const label = new Date(Number(year), Number(m) - 1).toLocaleDateString(
        "en-US",
        { month: "short", year: "numeric" },
      );
      return { month: label, count };
    });

  // Summary stats
  const total = applications.length;
  const appliedCount = applications.filter(
    (a) => a.status === ApplicationStatus.APPLIED,
  ).length;
  const interviewPlusCount = applications.filter((a) =>
    [
      ApplicationStatus.INTERVIEWING as string,
      ApplicationStatus.OFFER as string,
      ApplicationStatus.ACCEPTED as string,
    ].includes(a.status),
  ).length;

  const summaryStats = {
    total,
    responseRate: total > 0 ? ((total - appliedCount) / total) * 100 : 0,
    interviewRate: total > 0 ? (interviewPlusCount / total) * 100 : 0,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Reports</h1>
        <CsvExportButton />
      </div>

      <StatsSummary
        total={summaryStats.total}
        responseRate={summaryStats.responseRate}
        interviewRate={summaryStats.interviewRate}
      />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-semibold">Applications by Status</h2>
          <StatusBarChart data={statusCounts} />
        </div>
        <div>
          <h2 className="mb-4 text-lg font-semibold">Applications Over Time</h2>
          <TimelineChart data={timelineData} />
        </div>
      </div>
    </div>
  );
}
