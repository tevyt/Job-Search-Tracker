import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getApplicationsByUser } from "@/lib/queries/applications";
import ApplicationTable from "@/components/application-table";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const applications = await getApplicationsByUser(userId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <a
          href="/applications/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          Add Application
        </a>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            No applications yet. Start tracking your job search!
          </p>
          <a
            href="/applications/new"
            className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Your First Application
          </a>
        </div>
      ) : (
        <ApplicationTable applications={applications} />
      )}
    </div>
  );
}
