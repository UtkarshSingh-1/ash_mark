import { prisma } from "@/lib/db"

const MB = 1024 * 1024

export type MediaPurpose =
  | "product_image"
  | "story_image"
  | "review_image"
  | "review_video"
  | "reel_video"

const IMAGE_LIMITS_MB: Record<MediaPurpose, number> = {
  product_image: 10,
  story_image: 10,
  review_image: 5,
  review_video: 0,
  reel_video: 0,
}

const VIDEO_LIMITS_MB: Record<MediaPurpose, number> = {
  product_image: 0,
  story_image: 0,
  review_image: 0,
  review_video: 15,
  reel_video: 50,
}

export function getMediaLimitBytes(purpose: MediaPurpose, kind: "image" | "video") {
  const limitMb = kind === "image" ? IMAGE_LIMITS_MB[purpose] : VIDEO_LIMITS_MB[purpose]
  return limitMb * MB
}

export function buildMediaUrl(folder: string, id: string) {
  return `/api/media/${folder}/${id}`
}

export async function storeMediaFile(file: File, purpose: string, folder: string = "general") {
  const isVideo = file.type.startsWith("video")
  const isImage = file.type.startsWith("image")

  if (!isVideo && !isImage) {
    throw new Error("Only image/video uploads are allowed")
  }

  const limit = getMediaLimitBytes(purpose as MediaPurpose, isVideo ? "video" : "image")

  if (limit > 0 && file.size > limit) {
    const limitMb = Math.floor(limit / MB)
    throw new Error(`${isVideo ? "Video" : "Image"} size must be <= ${limitMb}MB`)
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  const created = await prisma.media.create({
    data: {
      mimeType: file.type || (isVideo ? "video/mp4" : "image/jpeg"),
      size: file.size,
      folder: folder.toLowerCase(),
      kind: isVideo ? "VIDEO" : "IMAGE",
      data: buffer,
    },
    select: { id: true, folder: true },
  })

  return {
    id: created.id,
    url: buildMediaUrl(created.folder, created.id),
    type: isVideo ? "video" : "image",
  }
}
