const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.product.updateMany({
    where: { slug: "cyberpunk-tshirt-test" },
    data: {
      stock: 0,
      featured: false,
      trending: false,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed complete: Cyberpunk test product hidden.");
  })
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
