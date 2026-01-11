import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { itemId } = await params
    const body = await request.json()
    const quantity = Math.max(1, Math.min(99, Number(body.quantity)))

    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: 'Quantity must be >= 1' }, { status: 400 })
    }

    const item = await prisma.cartItem.findUnique({ where: { id: itemId } })
    if (!item || item.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update cart item error:', error)
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { itemId } = await params
    const item = await prisma.cartItem.findUnique({ where: { id: itemId } })
    if (!item || item.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.cartItem.delete({ where: { id: itemId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete cart item error:', error)
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 })
  }
}