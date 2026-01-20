import { prisma } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { OTPPurpose } from "@prisma/client"

export async function POST(request: NextRequest) {
  const { name, email, password, otp } = await request.json()

  if (!name || !email || !password || !otp) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 })
  }

  const record = await prisma.emailOTP.findFirst({
    where: { email, purpose: OTPPurpose.VERIFY_EMAIL },
    orderBy: { createdAt: "desc" }
  })

  if (!record) return NextResponse.json({ error: "OTP not found" }, { status: 400 })
  if (record.otp !== otp) return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
  if (record.expiresAt < new Date()) return NextResponse.json({ error: "OTP expired" }, { status: 400 })

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 })

  const hashed = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: { name, email, password: hashed }
  })

  return NextResponse.json({ message: "User verified & created" })
}
