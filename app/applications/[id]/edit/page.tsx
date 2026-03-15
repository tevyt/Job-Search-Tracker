import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { getApplicationById } from "@/lib/queries/applications";
import ApplicationForm from "@/components/application-form";
import DeleteConfirmation from "@/components/delete-confirmation";

export default async function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    notFound();
  }

  const { id } = await params;
  const application = await getApplicationById(id, userId);
  if (!application) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Application</h1>
        <DeleteConfirmation id={application.id} />
      </div>
      <ApplicationForm initialData={application} />
    </div>
  );
}
