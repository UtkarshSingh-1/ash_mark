import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

interface OrderInvoiceParams{
  params: Promise<{
    orderId: string
  }>
}

export async function GET(
  request: NextRequest,
  context: OrderInvoiceParams
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const order = await prisma.order.findFirst({
      where: {
        id: (await context.params).orderId,
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                category: {
                  select: { name: true }
                }
              }
            }
          }
        },
        shippingAddress: true,
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Generate PDF invoice (you would use a PDF generation library here)
    // For now, return order data as JSON
    const invoiceData = {
      orderId: order.id,
      orderDate: order.createdAt,
      customer: {
        name: order.user.name,
        email: order.user.email,
        address: order.shippingAddress
      },
      items: order.items,
      totals: {
        subtotal: order.subtotal,
        tax: order.tax,
        shipping: order.shipping,
        total: order.total
      }
    }

    // In a real implementation, you would:
    // 1. Generate PDF using libraries like puppeteer, jsPDF, or PDFKit
    // 2. Return the PDF as a blob
    
    return NextResponse.json(invoiceData)
  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    )
  }
}
