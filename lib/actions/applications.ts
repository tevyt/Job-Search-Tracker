"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  ApplicationStatus,
  WorkMode,
} from "@/app/generated/prisma/enums";

const VALID_STATUSES = Object.values(ApplicationStatus);
const VALID_WORK_MODES = Object.values(WorkMode);

function parseFormData(formData: FormData) {
  const companyName = formData.get("companyName") as string | null;
  const jobTitle = formData.get("jobTitle") as string | null;

  if (!companyName?.trim() || !jobTitle?.trim()) {
    throw new Error("Company name and job title are required.");
  }

  const status = (formData.get("status") as string) || "APPLIED";
  if (!VALID_STATUSES.includes(status as ApplicationStatus)) {
    throw new Error("Invalid status value.");
  }

  const workModeRaw = formData.get("workMode") as string | null;
  let workMode: WorkMode | null = null;
  if (workModeRaw && workModeRaw.trim()) {
    if (!VALID_WORK_MODES.includes(workModeRaw as WorkMode)) {
      throw new Error("Invalid work mode value.");
    }
    workMode = workModeRaw as WorkMode;
  }

  const dateAppliedRaw = formData.get("dateApplied") as string | null;
  const dateApplied = dateAppliedRaw ? new Date(dateAppliedRaw) : new Date();

  return {
    companyName: companyName.trim(),
    jobTitle: jobTitle.trim(),
    status: status as ApplicationStatus,
    dateApplied,
    url: (formData.get("url") as string)?.trim() || null,
    salaryRange: (formData.get("salaryRange") as string)?.trim() || null,
    contact: (formData.get("contact") as string)?.trim() || null,
    location: (formData.get("location") as string)?.trim() || null,
    workMode,
    notes: (formData.get("notes") as string)?.trim() || null,
  };
}

export async function createApplication(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const data = parseFormData(formData);

  await prisma.jobApplication.create({
    data: {
      userId,
      ...data,
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateApplication(id: string, formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.jobApplication.findFirst({
    where: { id, userId },
  });
  if (!existing) {
    throw new Error("Application not found.");
  }

  const data = parseFormData(formData);

  await prisma.jobApplication.update({
    where: { id },
    data,
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deleteApplication(id: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.jobApplication.findFirst({
    where: { id, userId },
  });
  if (!existing) {
    throw new Error("Application not found.");
  }

  await prisma.jobApplication.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard")
}
