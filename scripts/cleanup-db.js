const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.argv[2];

async function main() {
  if (!ADMIN_EMAIL) {
    throw new Error(
      "ADMIN_EMAIL is required. Provide it via env or as the first argument."
    );
  }

  const adminUser = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
    select: { id: true, email: true },
  });

  if (!adminUser) {
    throw new Error(`Admin user not found for email: ${ADMIN_EMAIL}`);
  }

  const allProducts = await prisma.product.findMany({
    select: { id: true, name: true, slug: true },
  });

  const cyberpunkProducts = allProducts.filter((product) => {
    const haystack = `${product.name} ${product.slug}`.toLowerCase();
    return haystack.includes("cyberpunk");
  });

  if (cyberpunkProducts.length > 0) {
    const cyberIds = cyberpunkProducts.map((product) => product.id);

    await prisma.orderItem.deleteMany({
      where: { productId: { in: cyberIds } },
    });

    await prisma.cartItem.deleteMany({
      where: { productId: { in: cyberIds } },
    });

    await prisma.wishlistItem.deleteMany({
      where: { productId: { in: cyberIds } },
    });

    await prisma.review.deleteMany({
      where: { productId: { in: cyberIds } },
    });

    await prisma.product.deleteMany({
      where: { id: { in: cyberIds } },
    });
  }

  await prisma.returnRequest.deleteMany({});
  await prisma.exchangeRequest.deleteMany({});

  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});

  await prisma.walletTransaction.deleteMany({});
  await prisma.promoCodeUsage.deleteMany({});

  await prisma.cartItem.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.address.deleteMany({});

  await prisma.session.deleteMany({
    where: { userId: { not: adminUser.id } },
  });
  await prisma.account.deleteMany({
    where: { userId: { not: adminUser.id } },
  });

  await prisma.user.deleteMany({
    where: { id: { not: adminUser.id } },
  });

  await prisma.emailOTP.deleteMany({});

  return {
    adminEmail: adminUser.email,
    removedCyberpunk: cyberpunkProducts.map((product) => product.slug),
  };
}

main()
  .then(async (result) => {
    await prisma.$disconnect();
    console.log(
      JSON.stringify(
        {
          status: "ok",
          adminEmail: result.adminEmail,
          removedCyberpunk: result.removedCyberpunk,
        },
        null,
        2
      )
    );
  })
  .catch(async (error) => {
    console.error("Cleanup failed:", error.message || error);
    await prisma.$disconnect();
    process.exit(1);
  });
