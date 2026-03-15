export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-8 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-10 w-36 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Filter bar skeleton */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="h-10 w-52 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
        <div className="h-10 w-36 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
        <div className="h-10 w-36 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex gap-4 bg-gray-50 px-4 py-3 dark:bg-gray-800">
          {[120, 160, 80, 100, 80].map((w, i) => (
            <div
              key={i}
              className="h-4 animate-pulse rounded bg-gray-300 dark:bg-gray-600"
              style={{ width: w }}
            />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 border-t border-gray-200 px-4 py-3 dark:border-gray-700"
          >
            {[120, 160, 80, 100, 80].map((w, j) => (
              <div
                key={j}
                className="h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
                style={{ width: w }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
