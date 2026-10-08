import { prisma } from "@/lib/db";
import PackageStepClient from "@/components/steps/PackageStepClient";

export default async function PackageStepPage() {
  const packages = await prisma.package.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" }
  });
  return <PackageStepClient packages={packages} />;
}
