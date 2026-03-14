import { prisma } from "@/lib/db";

export async function getApplicationsByUser(userId: string) {
  return prisma.jobApplication.findMany({
    where: { userId },
  });
}

export async function getApplicationById(id: string, userId: string) {
  return prisma.jobApplication.findFirst({
    where: { id, userId },
  });
}
