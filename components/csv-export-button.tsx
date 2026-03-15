"use client";

export default function CsvExportButton() {
  return (
    <a
      href="/api/export/csv"
      download="job-applications.csv"
      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
    >
      Export CSV
    </a>
  );
}
