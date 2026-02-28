import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { storeMediaFile } from "@/lib/media"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const purpose = (formData.get("purpose") as string) || "product_image"
    const folder = (formData.get("folder") as string) || "general"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const uploaded = await storeMediaFile(file, purpose, folder)

    return NextResponse.json({
      success: true,
      url: uploaded.url,
      type: uploaded.type,
    })
  } catch (error) {
    console.error("Error uploading review media:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload media" },
      { status: 500 }
    )
  }
}
