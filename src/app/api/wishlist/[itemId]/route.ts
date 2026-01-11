import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { itemId } = await params
    const item = await prisma.wishlistItem.findUnique({ 
      where: { id: itemId },
      include: { user: true }
    })
    
    if (!item || item.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.wishlistItem.delete({ where: { id: itemId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete wishlist item error:', error)
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 })
  }
}