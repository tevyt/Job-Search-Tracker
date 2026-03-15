export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
        404
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        The page you're looking for doesn't exist.
      </p>
      <a
        href="/dashboard"
        className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Back to Dashboard
      </a>
    </div>
  );
}
