import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const addressUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  phone: z.string().min(10, "Valid phone number is required").optional(),
  street: z.string().min(1, "Street address is required").optional(),
  city: z.string().min(1, "City is required").optional(),
  state: z.string().min(1, "State is required").optional(),
  pincode: z.string().min(6, "Valid pincode is required").optional(),
  country: z.string().optional(),
  type: z.enum(['home', 'work', 'other']).optional(),
  isDefault: z.boolean().optional(),
})

// GET /api/addresses/[addressId] - Get specific address
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ addressId: string }> }
) {
  try {
    const { addressId } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: session.user.id,
      },
    })

    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    return NextResponse.json({ address })
  } catch (error) {
    console.error('Error fetching address:', error)
    return NextResponse.json(
      { error: 'Failed to fetch address' },
      { status: 500 }
    )
  }
}

// PUT /api/addresses/[addressId] - Update address
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

    const body = await request.json()
    const validatedData = addressUpdateSchema.parse(body)

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

    // If setting as default, remove default from other addresses
    if (validatedData.isDefault === true) {
      await prisma.address.updateMany({
        where: { 
          userId: session.user.id,
          id: { not: addressId },
          isDefault: true 
        },
        data: { isDefault: false },
      })
    }

    // If removing default, ensure at least one address remains default
    if (validatedData.isDefault === false && existingAddress.isDefault) {
      const otherAddresses = await prisma.address.findMany({
        where: { 
          userId: session.user.id,
          id: { not: addressId }
        },
        orderBy: { createdAt: 'asc' }
      })

      if (otherAddresses.length > 0) {
        // Make the oldest other address default
        await prisma.address.update({
          where: { id: otherAddresses[0].id },
          data: { isDefault: true }
        })
      } else {
        // If this is the only address, keep it as default
        validatedData.isDefault = true
      }
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ 
      address: updatedAddress,
      message: 'Address updated successfully' 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating address:', error)
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    )
  }
}

// DELETE /api/addresses/[addressId] - Delete address
export async function DELETE(
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

    // Check if there are any pending orders using this address
    const ordersUsingAddress = await prisma.order.findMany({
      where: {
        addressId: addressId,
        status: {
          in: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED']
        }
      }
    })

    if (ordersUsingAddress.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete address with pending orders' },
        { status: 400 }
      )
    }

    // If deleting default address, make another address default
    if (existingAddress.isDefault) {
      const otherAddress = await prisma.address.findFirst({
        where: { 
          userId: session.user.id,
          id: { not: addressId }
        },
        orderBy: { createdAt: 'asc' }
      })

      if (otherAddress) {
        await prisma.address.update({
          where: { id: otherAddress.id },
          data: { isDefault: true }
        })
      }
    }

    await prisma.address.delete({
      where: { id: addressId },
    })

    return NextResponse.json({ 
      success: true,
      message: 'Address deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    )
  }
}