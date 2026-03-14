import { ApplicationStatus, WorkMode } from "@/app/generated/prisma/enums";

export const STATUS_ORDER: ApplicationStatus[] = [
  ApplicationStatus.ACCEPTED,
  ApplicationStatus.OFFER,
  ApplicationStatus.INTERVIEWING,
  ApplicationStatus.SCREENING,
  ApplicationStatus.APPLIED,
  ApplicationStatus.WITHDRAWN,
  ApplicationStatus.REJECTED,
];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.APPLIED]: "Applied",
  [ApplicationStatus.SCREENING]: "Screening",
  [ApplicationStatus.INTERVIEWING]: "Interviewing",
  [ApplicationStatus.OFFER]: "Offer",
  [ApplicationStatus.ACCEPTED]: "Accepted",
  [ApplicationStatus.REJECTED]: "Rejected",
  [ApplicationStatus.WITHDRAWN]: "Withdrawn",
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.APPLIED]: "#3b82f6",      // blue
  [ApplicationStatus.SCREENING]: "#a855f7",     // purple
  [ApplicationStatus.INTERVIEWING]: "#f59e0b",  // amber
  [ApplicationStatus.OFFER]: "#22c55e",         // green
  [ApplicationStatus.ACCEPTED]: "#16a34a",      // dark green
  [ApplicationStatus.REJECTED]: "#ef4444",      // red
  [ApplicationStatus.WITHDRAWN]: "#6b7280",     // gray
};

export const WORK_MODE_LABELS: Record<WorkMode, string> = {
  [WorkMode.REMOTE]: "Remote",
  [WorkMode.HYBRID]: "Hybrid",
  [WorkMode.ONSITE]: "Onsite",
};
