import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ count: 0 })
    }

    const count = await prisma.cartItem.aggregate({
      where: { userId: session.user.id },
      _sum: { quantity: true },
    })

    return NextResponse.json({ count: count._sum.quantity || 0 })
  } catch (error) {
    console.error('Error fetching cart count:', error)
    return NextResponse.json({ count: 0 })
  }
}
