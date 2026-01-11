import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get real-time user statistics
    const [orderStats, user] = await Promise.all([
      prisma.order.aggregate({
        where: { 
          userId: session.user.id,
          paymentStatus: 'PAID'
        },
        _count: { id: true },
        _sum: { total: true },
      }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { createdAt: true },
      }),
    ])

    // Calculate loyalty points (example: 1 point per ₹10 spent)
    const totalSpent = Number(orderStats._sum.total) || 0
    const loyaltyPoints = Math.floor(totalSpent / 10)

    // Determine member tier based on total spent
    // let memberTier = 'Bronze'
    // if (totalSpent >= 50000) memberTier = 'Platinum'
    // else if (totalSpent >= 20000) memberTier = 'Gold'
    // else if (totalSpent >= 5000) memberTier = 'Silver'

    return NextResponse.json({
      totalOrders: orderStats._count.id,
      // totalSpent,
      loyaltyPoints,
      // memberTier,
      memberSince: user?.createdAt.toISOString().split('T'),
    })
  } catch (error) {
    console.error('Error fetching profile stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile statistics' },
      { status: 500 }
    )
  }
}
