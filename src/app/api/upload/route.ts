import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { UTApi } from "uploadthing/server"

const utapi = new UTApi()

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const isVideo = file.type.startsWith("video")
    const isImage = file.type.startsWith("image")

    if (!isVideo && !isImage) {
      return NextResponse.json(
        { error: "Only image/video uploads are allowed" },
        { status: 400 }
      )
    }

    // Size validation: 10MB max for videos, 5MB for images
    if (isVideo && file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Video size must be ≤ 10MB" },
        { status: 400 }
      )
    }

    if (isImage && file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image size must be ≤ 5MB" },
        { status: 400 }
      )
    }

    const uploaded = await utapi.uploadFiles(file)

    if (!uploaded || uploaded.error || !uploaded.data?.url) {
      return NextResponse.json(
        { error: "Upload failed" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      url: uploaded.data.url,
      type: isVideo ? "video" : "image"
    })  
  } catch (error) {
    console.error("Error uploading review media:", error)
    return NextResponse.json(
      { error: "Failed to upload media" },
      { status: 500 }
    )
  }
}
