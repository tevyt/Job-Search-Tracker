interface StatsSummaryProps {
  total: number;
  responseRate: number;
  interviewRate: number;
}

export default function StatsSummary({
  total,
  responseRate,
  interviewRate,
}: StatsSummaryProps) {
  const cards = [
    { label: "Total Applications", value: String(total) },
    { label: "Response Rate", value: `${responseRate.toFixed(1)}%` },
    { label: "Interview Rate", value: `${interviewRate.toFixed(1)}%` },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {card.label}
          </p>
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
