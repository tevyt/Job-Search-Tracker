import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-semibold">
        Dashboard — logged in as {userId}
      </h1>
    </div>
  );
}
