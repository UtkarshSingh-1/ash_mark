import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const addressSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Valid pincode is required"),
  country: z.string().default("India"),
  type: z.enum(['home', 'work', 'other']).default('home'),
  isDefault: z.boolean().default(false),
})

// GET /api/addresses - Fetch user's addresses
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isDefault: 'desc' }, // Default addresses first
        { createdAt: 'desc' }   // Then by creation date
      ],
    })

    return NextResponse.json({ 
      addresses,
      count: addresses.length 
    })
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    )
  }
}

// POST /api/addresses - Create new address
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = addressSchema.parse(body)

    // If this is being set as default, remove default from other addresses
    if (validatedData.isDefault) {
      await prisma.address.updateMany({
        where: { 
          userId: session.user.id,
          isDefault: true 
        },
        data: { isDefault: false },
      })
    }

    // If user has no addresses, make this the default
    const existingAddressCount = await prisma.address.count({
      where: { userId: session.user.id },
    })

    const isFirstAddress = existingAddressCount === 0
    if (isFirstAddress) {
      validatedData.isDefault = true
    }

    const address = await prisma.address.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ 
      address,
      message: 'Address created successfully' 
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating address:', error)
    return NextResponse.json(
      { error: 'Failed to create address' },
      { status: 500 }
    )
  }
}