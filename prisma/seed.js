// Run with: npm run db:seed
// Uses upsert (matched on slug), so re-running this after editing prices,
// descriptions, or image paths below updates existing rows instead of
// silently skipping them.

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const HALLS = [
  {
    name: "Hall 1",
    slug: "hall-1",
    capacity: 6,
    description: "Private hall, seats up to 6 guests."
  },
  {
    name: "Hall 2",
    slug: "hall-2",
    capacity: 4,
    description: "Private hall, seats up to 4 guests."
  }
];

// Shared across both halls. imageUrl points at /public/packages/*, put the
// actual image files there, Next.js serves anything in /public at the root.
const PACKAGES = [
  {
    name: "Crunch and Drink",
    slug: "crunch-and-drink",
    price: 2500000,
    sortOrder: 1,
    description: "Popcorn and a soft drink each, no fuss, straight to the film.",
    imageUrl: "/packages/crunch-and-drink.png"
  },
  {
    name: "Crunch and Wine",
    slug: "crunch-and-wine",
    price: 3000000,
    sortOrder: 2,
    description: "Popcorn and a glass of wine each, for the low-key date night.",
    imageUrl: "/packages/crunch-and-wine.png"
  },
  {
    name: "BYOF",
    slug: "byof",
    price: 2700000,
    sortOrder: 3,
    description: "Bring your own food, we bring the hall. No catering, no markup.",
    imageUrl: "/packages/byof.jpeg"
  },
  {
    name: "Slice and Drink",
    slug: "slice-and-drink",
    price: 4000000,
    sortOrder: 4,
    description: "Pizza and a soft drink each, built for a proper group hangout.",
    imageUrl: "/packages/slice-and-drink.png"
  },
  {
    name: "Slice and Wine",
    slug: "slice-and-wine",
    price: 4500000,
    sortOrder: 5,
    description: "Pizza and wine each, our most requested package.",
    imageUrl: "/packages/slice-and-wine.jpg"
  },
  {
    name: "Executive",
    slug: "executive",
    price: 5500000,
    sortOrder: 6,
    description: "The full spread, food and drink included, for the group that wants everything sorted.",
    imageUrl: "/packages/executive.png"
  }
];

async function main() {
  for (const hall of HALLS) {
    await prisma.hall.upsert({
      where: { slug: hall.slug },
      update: hall,
      create: hall
    });
  }

  for (const pkg of PACKAGES) {
    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: pkg,
      create: pkg
    });
  }

  console.log("Seeded halls and packages.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
