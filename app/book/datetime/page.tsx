import { prisma } from "@/lib/db";
import DateTimeStepClient from "@/components/steps/DateTimeStepClient";

export default async function DateTimeStepPage() {
  const halls = await prisma.hall.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" }
  });
  return <DateTimeStepClient halls={halls} />;
}
