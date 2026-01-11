import { NextRequest, NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// PUT /api/addresses/[addressId]/set-default - Set address as default
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ addressId: string }> }
) {
  try {
    const { addressId } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: session.user.id,
      },
    })

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    // If already default, return success
    if (existingAddress.isDefault) {
      return NextResponse.json({ 
        success: true,
        message: 'Address is already set as default' 
      })
    }

    // Use transaction to ensure consistency
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Remove default from all other addresses
      await tx.address.updateMany({
        where: { 
          userId: session.user.id,
          isDefault: true 
        },
        data: { isDefault: false },
      })

      // Set this address as default
      await tx.address.update({
        where: { id: addressId },
        data: { 
          isDefault: true,
          updatedAt: new Date()
        },
      })
    })

    return NextResponse.json({ 
      success: true,
      message: 'Default address updated successfully' 
    })
  } catch (error) {
    console.error('Error setting default address:', error)
    return NextResponse.json(
      { error: 'Failed to update default address' },
      { status: 500 }
    )
  }
}