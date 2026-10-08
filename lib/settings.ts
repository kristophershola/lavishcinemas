import { prisma } from "./db";

const SETTINGS_ID = "singleton";

export async function getFeaturedMovieTmdbId(): Promise<number | null> {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: SETTINGS_ID }
  });
  return settings?.featuredMovieTmdbId ?? null;
}

export async function setFeaturedMovieTmdbId(tmdbId: number | null): Promise<void> {
  await prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: { featuredMovieTmdbId: tmdbId },
    create: { id: SETTINGS_ID, featuredMovieTmdbId: tmdbId }
  });
}
