import { NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

const changePasswordSchema = z.object({
	currentPassword: z.string().min(1, "Current password is required"),
	newPassword: z.string().min(8, "New password must be at least 8 characters"),
})

export async function POST(req: Request) {
	try {
		const session = await auth()
		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const body = await req.json()
		const parsed = changePasswordSchema.safeParse(body)
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid input", details: parsed.error.issues },
				{ status: 400 }
			)
		}

		const { currentPassword, newPassword } = parsed.data

		const user = await prisma.user.findUnique({ where: { id: session.user.id } })
		if (!user || !user.password) {
			return NextResponse.json({ error: "User not found" }, { status: 404 })
		}

		const valid = await bcrypt.compare(currentPassword, user.password)
		if (!valid) {
			return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
		}

		const isSame = await bcrypt.compare(newPassword, user.password)
		if (isSame) {
			return NextResponse.json({ error: "New password must be different" }, { status: 400 })
		}

		const hashed = await bcrypt.hash(newPassword, 10)
		await prisma.user.update({ where: { id: user.id }, data: { password: hashed } })

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("change-password error:", error)
		return NextResponse.json({ error: "Internal server error" }, { status: 500 })
	}
}

