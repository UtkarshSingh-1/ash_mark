import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import OrderPageClient from "./pageClient";

export default async function OrderDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const session = await auth();

  if (!session?.user) redirect("/login");

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id },
    include: {
      items: {
        include: {
          product: { include: { category: true } },
        },
      },
      shippingAddress: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!order) notFound();

  return (
    <>
      <Navbar />
      <OrderPageClient order={JSON.parse(JSON.stringify(order))} />
      <Footer />
    </>
  );
}
