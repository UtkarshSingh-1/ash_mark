"use client"

import Image from "next/image"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface ReviewFormProps {
  productId: string
  onReviewSubmitted?: () => void
}

export function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const { data: session } = useSession()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [media, setMedia] = useState<{ url: string; type: "image" | "video" }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)

  if (!session?.user) {
    return (
      <Card>
        <CardContent className="text-center p-6">
          <p className="text-muted-foreground">Please log in to write a review</p>
        </CardContent>
      </Card>
    )
  }

  async function handleMediaUpload(e: any) {
    const file = e.target.files?.[0]
    if (!file) return

    const isVideo = file.type.startsWith("video")
    const isImage = file.type.startsWith("image")

    if (!isVideo && !isImage) {
      return toast({ variant: "destructive", title: "Invalid File" })
    }

    if (isVideo && file.size > 15 * 1024 * 1024) {
      return toast({ variant: "destructive", title: "Video ≤ 10MB only" })
    }

    if (isImage && file.size > 5 * 1024 * 1024) {
      return toast({ variant: "destructive", title: "Image ≤ 5MB only" })
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", "reviews")

    const res = await fetch("/api/media/upload", { method: "POST", body: formData })
    const data = await res.json()
    setUploading(false)

    if (data.error) {
      return toast({ variant: "destructive", title: "Upload Failed", description: data.error })
    }

    setMedia(prev => [...prev, { url: data.url, type: data.type }])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      return toast({ variant: "destructive", title: "Select rating first" })
    }

    setIsSubmitting(true)

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        rating,
        title: title.trim() || null,
        comment: comment.trim() || null,
        media,
      }),
    })

    setIsSubmitting(false)

    if (!res.ok) {
      const data = await res.json()
      return toast({ variant: "destructive", title: "Error", description: data.error })
    }

    toast({ title: "Review Submitted" })
    setRating(0)
    setTitle("")
    setComment("")
    setMedia([])
    onReviewSubmitted?.()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm font-medium">Rating *</label>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  <Star
                    className={cn(
                      "h-6 w-6",
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Review Title (optional)" />

          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your experience..."
            className="min-h-[100px]"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Add Media</label>
            <Input type="file" accept="image/*,video/*" onChange={handleMediaUpload} />
            {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}

            <div className="flex flex-wrap gap-2">
              {media.map((m, i) =>
                m.type === "image" ? (
                  <Image
                    key={i}
                    src={m.url}
                    alt="Selected media"
                    width={80}
                    height={80}
                    className="rounded object-cover border"
                  />
                ) : (
                  <video key={i} src={m.url} className="w-24 rounded border" controls />
                )
              )}
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting || uploading || rating === 0} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
