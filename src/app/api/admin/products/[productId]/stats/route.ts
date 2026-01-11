import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId } = await params

    // Get basic stats from existing schema data
    const [
      totalSales,
      totalRevenue,
      wishlistCount,
      orderGroups,
    ] = await Promise.all([
      // Total units sold from order items
      prisma.orderItem.aggregate({
        where: { productId },
        _sum: { quantity: true }
      }),
      
      // Total revenue from order items
      prisma.orderItem.aggregate({
        where: { 
          productId,
          order: {
            status: { not: 'CANCELLED' }
          }
        },
        _sum: { 
          price: true 
        }
      }),
      
      // Wishlist count
      prisma.wishlistItem.count({
        where: { productId }
      }),
      
      // Order count
      prisma.orderItem.groupBy({
        by: ['orderId'],
        where: { 
          productId,
          order: {
            status: { not: 'CANCELLED' }
          }
        }
      }),
    ])

    return NextResponse.json({
      totalSales: totalSales._sum.quantity || 0,
      totalRevenue: totalRevenue._sum.price || 0,
      wishlistCount,
      orderCount: orderGroups.length,
    })

  } catch (error) {
    console.error('Error fetching product stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product stats' },
      { status: 500 }
    )
  }
}