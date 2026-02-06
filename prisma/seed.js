const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const slug = "cyberpunk-tshirt-test";
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!product) {
    return "Seed complete: Cyberpunk test product not found.";
  }

  const orderItems = await prisma.orderItem.findMany({
    where: { productId: product.id },
    select: { orderId: true },
  });

  const orderIds = [...new Set(orderItems.map((item) => item.orderId))];

  if (orderIds.length > 0) {
    await prisma.order.deleteMany({
      where: { id: { in: orderIds } },
    });
  }

  await prisma.orderItem.deleteMany({
    where: { productId: product.id },
  });

  await prisma.cartItem.deleteMany({
    where: { productId: product.id },
  });

  await prisma.wishlistItem.deleteMany({
    where: { productId: product.id },
  });

  await prisma.review.deleteMany({
    where: { productId: product.id },
  });

  await prisma.product.delete({
    where: { id: product.id },
  });

  return "Seed complete: Cyberpunk test product and related data removed.";
}

main()
  .then(async (message) => {
    await prisma.$disconnect();
    console.log(message);
  })
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
