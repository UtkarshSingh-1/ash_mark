import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { OTPPurpose } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, otp } = await request.json()

    if (!email || !password || !otp) {
      return NextResponse.json(
        { error: "Email, password and OTP are required" },
        { status: 400 }
      )
    }

    // 🔍 Check if email is already registered
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      )
    }

    // 🔐 Validate OTP
    const record = await prisma.emailOTP.findFirst({
      where: {
        email,
        purpose: OTPPurpose.VERIFY_EMAIL,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    if (!record) {
      return NextResponse.json(
        { error: "OTP not found or not requested" },
        { status: 400 }
      )
    }

    if (record.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    if (record.expiresAt < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 })
    }

    // 🧂 Hash password
    const hash = await bcrypt.hash(password, 10)

    // 🎯 Create user
    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hash,
      },
      select: { id: true, email: true, name: true },
    })

    return NextResponse.json(
      { message: "Signup successful", user },
      { status: 201 }
    )

  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Failed to sign up" },
      { status: 500 }
    )
  }
}
