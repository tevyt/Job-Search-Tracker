"use client";

import { useState } from "react";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  STATUS_ORDER,
  WORK_MODE_LABELS,
} from "@/lib/constants";
import { ApplicationStatus, WorkMode } from "@/app/generated/prisma/enums";

interface Application {
  id: string;
  companyName: string;
  jobTitle: string;
  status: ApplicationStatus;
  dateApplied: Date;
  workMode: WorkMode | null;
}

interface ApplicationTableProps {
  applications: Application[];
}

type SortField = "companyName" | "jobTitle" | "status" | "dateApplied" | "workMode";
type SortDirection = "asc" | "desc";

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ApplicationTable({
  applications,
}: ApplicationTableProps) {
  const [sortField, setSortField] = useState<SortField>("status");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [workModeFilter, setWorkModeFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  const filtered = applications.filter((app) => {
    if (statusFilter !== "ALL" && app.status !== statusFilter) return false;
    if (workModeFilter !== "ALL" && app.workMode !== workModeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !app.companyName.toLowerCase().includes(q) &&
        !app.jobTitle.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDirection === "asc" ? 1 : -1;

    if (sortField === "status") {
      const aIdx = STATUS_ORDER.indexOf(a.status);
      const bIdx = STATUS_ORDER.indexOf(b.status);
      if (aIdx !== bIdx) return (aIdx - bIdx) * dir;
      return a.companyName.localeCompare(b.companyName);
    }

    if (sortField === "dateApplied") {
      return (new Date(a.dateApplied).getTime() - new Date(b.dateApplied).getTime()) * dir;
    }

    if (sortField === "workMode") {
      const aVal = a.workMode ?? "";
      const bVal = b.workMode ?? "";
      return aVal.localeCompare(bVal) * dir;
    }

    const aVal = a[sortField];
    const bVal = b[sortField];
    return aVal.localeCompare(bVal) * dir;
  });

  const sortIndicator = (field: SortField) =>
    sortField === field ? (sortDirection === "asc" ? " ↑" : " ↓") : "";

  const thStyles =
    "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-200";

  return (
    <div>
      {/* Filters & Search */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search company or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-auto dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm sm:w-auto dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="ALL">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={workModeFilter}
          onChange={(e) => setWorkModeFilter(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm sm:w-auto dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="ALL">All Work Modes</option>
          {Object.entries(WORK_MODE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className={thStyles} onClick={() => handleSort("companyName")}>
                Company{sortIndicator("companyName")}
              </th>
              <th className={thStyles} onClick={() => handleSort("jobTitle")}>
                Job Title{sortIndicator("jobTitle")}
              </th>
              <th className={thStyles} onClick={() => handleSort("status")}>
                Status{sortIndicator("status")}
              </th>
              <th className={thStyles} onClick={() => handleSort("dateApplied")}>
                Date Applied{sortIndicator("dateApplied")}
              </th>
              <th className={thStyles} onClick={() => handleSort("workMode")}>
                Work Mode{sortIndicator("workMode")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No applications match your filters.
                </td>
              </tr>
            ) : (
              sorted.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <a
                      href={`/applications/${app.id}/edit`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {app.companyName}
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                    {app.jobTitle}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <span
                      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                      style={{ backgroundColor: STATUS_COLORS[app.status] }}
                    >
                      {STATUS_LABELS[app.status]}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {formatDate(app.dateApplied)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {app.workMode ? WORK_MODE_LABELS[app.workMode] : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {sorted.length} of {applications.length} application{applications.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
