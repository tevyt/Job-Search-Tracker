"use client";

import { useActionState } from "react";
import {
  createApplication,
  updateApplication,
} from "@/lib/actions/applications";
import { STATUS_LABELS, WORK_MODE_LABELS } from "@/lib/constants";
import {
  ApplicationStatus,
  WorkMode,
} from "@/app/generated/prisma/enums";

interface ApplicationData {
  id: string;
  companyName: string;
  jobTitle: string;
  status: ApplicationStatus;
  dateApplied: Date;
  url: string | null;
  salaryRange: string | null;
  contact: string | null;
  location: string | null;
  workMode: WorkMode | null;
  notes: string | null;
}

interface ApplicationFormProps {
  initialData?: ApplicationData;
}

function formatDateForInput(date: Date): string {
  return date.toISOString().split("T")[0];
}

const inputStyles =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100";
const labelStyles = "block text-sm font-medium text-gray-700 dark:text-gray-300";

async function handleCreate(_prevState: string | null, formData: FormData) {
  try {
    await createApplication(formData);
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "Something went wrong.";
  }
}

async function handleUpdate(
  id: string,
  _prevState: string | null,
  formData: FormData,
) {
  try {
    await updateApplication(id, formData);
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "Something went wrong.";
  }
}

export default function ApplicationForm({ initialData }: ApplicationFormProps) {
  const isEdit = !!initialData;

  const action = isEdit
    ? handleUpdate.bind(null, initialData.id)
    : handleCreate;

  const [error, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Company Name */}
        <div>
          <label htmlFor="companyName" className={labelStyles}>
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            required
            defaultValue={initialData?.companyName ?? ""}
            className={inputStyles}
          />
        </div>

        {/* Job Title */}
        <div>
          <label htmlFor="jobTitle" className={labelStyles}>
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            required
            defaultValue={initialData?.jobTitle ?? ""}
            className={inputStyles}
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className={labelStyles}>
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={initialData?.status ?? "APPLIED"}
            className={inputStyles}
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Applied */}
        <div>
          <label htmlFor="dateApplied" className={labelStyles}>
            Date Applied
          </label>
          <input
            type="date"
            id="dateApplied"
            name="dateApplied"
            defaultValue={
              initialData
                ? formatDateForInput(initialData.dateApplied)
                : formatDateForInput(new Date())
            }
            className={inputStyles}
          />
        </div>

        {/* URL */}
        <div>
          <label htmlFor="url" className={labelStyles}>
            Job URL
          </label>
          <input
            type="url"
            id="url"
            name="url"
            placeholder="https://..."
            defaultValue={initialData?.url ?? ""}
            className={inputStyles}
          />
        </div>

        {/* Salary Range */}
        <div>
          <label htmlFor="salaryRange" className={labelStyles}>
            Salary Range
          </label>
          <input
            type="text"
            id="salaryRange"
            name="salaryRange"
            placeholder="e.g. $80k - $100k"
            defaultValue={initialData?.salaryRange ?? ""}
            className={inputStyles}
          />
        </div>

        {/* Contact */}
        <div>
          <label htmlFor="contact" className={labelStyles}>
            Contact
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            placeholder="Recruiter name or email"
            defaultValue={initialData?.contact ?? ""}
            className={inputStyles}
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className={labelStyles}>
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="e.g. San Francisco, CA"
            defaultValue={initialData?.location ?? ""}
            className={inputStyles}
          />
        </div>

        {/* Work Mode */}
        <div>
          <label htmlFor="workMode" className={labelStyles}>
            Work Mode
          </label>
          <select
            id="workMode"
            name="workMode"
            defaultValue={initialData?.workMode ?? ""}
            className={inputStyles}
          >
            <option value="">— Select —</option>
            {Object.entries(WORK_MODE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className={labelStyles}>
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={initialData?.notes ?? ""}
          className={inputStyles}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isPending
            ? "Saving..."
            : isEdit
              ? "Update Application"
              : "Add Application"}
        </button>
        <a
          href="/dashboard"
          className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
