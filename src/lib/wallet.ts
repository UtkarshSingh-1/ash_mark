import { prisma } from "./db";

export async function creditWallet(userId: string, orderId: string, amount: number) {
  await prisma.user.update({
    where: { id: userId },
    data: { walletBalance: { increment: amount } }
  });

  await prisma.walletTransaction.create({
    data: {
      userId,
      orderId,
      amount,
      type: "CREDIT",
      reason: "REFUND"
    }
  });
}

export async function debitWallet(userId: string, orderId: string, amount: number) {
  await prisma.user.update({
    where: { id: userId },
    data: { walletBalance: { decrement: amount } }
  });

  await prisma.walletTransaction.create({
    data: {
      userId,
      orderId,
      amount,
      type: "DEBIT",
      reason: "PURCHASE"
    }
  });
}
