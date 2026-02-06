import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('paymentStatus')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'createdAt'

    const skip = (page - 1) * limit
    const where: any = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (paymentStatus && paymentStatus !== 'all') {
      where.paymentStatus = paymentStatus
    }

    if (search) {
      where.OR = [
        { id: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
      ]
    }

    const orderBy: any = {}
    orderBy[sort] = 'desc'

    const orderInclude = {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              name: true,
              images: true,
            },
          },
        },
      },
      shippingAddress: {
        select: {
          city: true,
          state: true,
          pincode: true,
        },
      },
    } as const

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: orderInclude,
        skip,
        take: limit,
        orderBy,
      }),
      prisma.order.count({ where }),
    ])

    type AdminOrder = typeof orders[number]
    type AdminOrderItem = AdminOrder['items'][number]

    const serialized = orders.map((order: AdminOrder) => ({
      id: order.id,
      status: order.status,
      paymentStatus: order.paymentStatus,
      total: Number(order.total),
      createdAt: order.createdAt.toISOString(),
      user: {
        id: order.user?.id || '',
        name: order.user?.name || null,
        email: order.user?.email || '',
        image: order.user?.image || null,
      },
      items: order.items.map((item: AdminOrderItem) => ({
        quantity: item.quantity,
        product: {
          name: item.product.name,
          images: item.product.images,
        },
      })),
      shippingAddress: order.shippingAddress
        ? {
            city: order.shippingAddress.city,
            state: order.shippingAddress.state,
            pincode: order.shippingAddress.pincode,
          }
        : null,
    }))

    return NextResponse.json({
      orders: serialized,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching admin orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
