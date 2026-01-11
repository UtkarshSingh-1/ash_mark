"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, StarIcon } from "lucide-react"
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
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!session?.user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Please log in to write a review
          </p>
        </CardContent>
      </Card>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting your review",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          rating,
          title: title.trim() || null,
          comment: comment.trim() || null,
        }),
      })

      if (response.ok) {
        toast({
          title: "Review Submitted",
          description: "Thank you for your review!",
        })
        setRating(0)
        setTitle("")
        setComment("")
        onReviewSubmitted?.()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit review')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to submit review',
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div>
            <label className="text-sm font-medium">Rating *</label>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1"
                >
                  <Star
                    className={cn(
                      "h-6 w-6 transition-colors",
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {rating > 0 && `${rating} star${rating > 1 ? 's' : ''}`}
              </span>
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label htmlFor="title" className="text-sm font-medium">
              Review Title (Optional)
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              className="mt-2"
            />
          </div>

          {/* Review Comment */}
          <div>
            <label htmlFor="comment" className="text-sm font-medium">
              Your Review (Optional)
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience with this product"
              className="mt-2 min-h-[100px]"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}