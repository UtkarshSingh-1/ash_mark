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
    const status = searchParams.get('status') || undefined
    const paymentStatus = searchParams.get('paymentStatus') || undefined
    const search = searchParams.get('search') || undefined

    const where: any = {}
    if (status && status !== 'all') where.status = status
    if (paymentStatus && paymentStatus !== 'all') where.paymentStatus = paymentStatus
    if (search) {
      where.OR = [
        { id: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
      ]
    }

    const orderInclude = {
      user: { select: { name: true, email: true } },
      shippingAddress: true,
      items: true,
    } as const

    const orders = await prisma.order.findMany({
      where,
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    })

    const headers = [
      'Order ID',
      'Date',
      'Status',
      'Payment Status',
      'Customer Name',
      'Customer Email',
      'Items',
      'Total',
      'City',
      'State',
      'Pincode',
    ]

    type OrderWithRelations = (typeof orders)[number]
    type OrderItem = OrderWithRelations['items'][number]

    const rows = orders.map((order: OrderWithRelations) => [
      order.id,
      order.createdAt.toISOString(),
      order.status,
      order.paymentStatus,
      order.user?.name ?? '',
      order.user?.email ?? '',
      order.items.reduce((sum: number, item: OrderItem) => sum + item.quantity, 0).toString(),
      Number(order.total).toString(),
      order.shippingAddress ? order.shippingAddress.city : '',
      order.shippingAddress ? order.shippingAddress.state : '',
      order.shippingAddress ? order.shippingAddress.pincode : '',
    ])

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value: string) => `"${String(value).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n')

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename=orders-${new Date().toISOString().slice(0,10)}.csv`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Error exporting orders:', error)
    return NextResponse.json({ error: 'Failed to export orders' }, { status: 500 })
  }
}

