import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
export const dynamic = 'force-dynamic'
export async function GET(_request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const [
      pendingCount,
      processingCount,
      issuesCount,
      todaysRevenueAgg,
      totalOrdersCount,
      statusGroups,
    ] = await Promise.all([
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'PROCESSING' } }),
      prisma.order.count({ where: { OR: [{ paymentStatus: 'FAILED' }, { status: 'CANCELLED' }, { status: 'RETURNED' }] } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: startOfToday }, paymentStatus: 'PAID' },
      }),
      prisma.order.count(),
      prisma.order.groupBy({ by: ['status'], _count: { status: true } }),
    ])

    type StatusGroup = (typeof statusGroups)[number]

    const statusCounts = statusGroups.reduce(
      (acc: Record<string, number>, statusGroup: StatusGroup) => {
        acc[statusGroup.status] = statusGroup._count.status
        return acc
      },
      {}
    )

    return NextResponse.json({
      // Header tiles
      pending: pendingCount,
      processing: processingCount,
      issues: issuesCount,
      todaysRevenue: Number(todaysRevenueAgg._sum.total || 0),
      // Summary tiles used by AdminOrdersStats
      totalOrders: totalOrdersCount,
      pendingOrders: statusCounts['PENDING'] || 0,
      completedOrders: statusCounts['DELIVERED'] || 0,
      cancelledOrders: statusCounts['CANCELLED'] || 0,
    })
  } catch (error) {
    console.error('Error fetching admin order stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
