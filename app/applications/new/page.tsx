import ApplicationForm from "@/components/application-form";

export default function NewApplicationPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Add Application</h1>
      <ApplicationForm />
    </div>
  );
}
