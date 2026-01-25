"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MoreVertical, Trash2, ThumbsUp, ThumbsDown } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

interface Media {
  url: string
  type: "image" | "video"
}

interface Review {
  id: string
  rating: number
  title: string | null
  comment: string | null
  createdAt: string
  media?: Media[]
  helpful: number
  notHelpful: number
  user: {
    id: string
    name: string | null
    image: string | null
  }
}

interface ReviewListProps {
  productId: string
  onReviewDeleted?: () => void
}

export function ReviewList({ productId, onReviewDeleted }: ReviewListProps) {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [ratingDistribution, setRatingDistribution] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  async function fetchReviews(pageNum = 1, reset = false) {
    try {
      setLoading(true)
      const res = await fetch(`/api/reviews?productId=${productId}&page=${pageNum}&limit=5`)
      const data = await res.json()

      if (reset) {
        setReviews(data.reviews)
      } else {
        setReviews(prev => [...prev, ...data.reviews])
      }

      setAverageRating(data.averageRating || 0)
      setRatingDistribution(data.ratingDistribution || {})
      setHasMore(data.pagination.page < data.pagination.pages)
    } catch (err) {
      console.error("Error fetching reviews:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews(1, true)
  }, [productId])

  async function handleDeleteReview(reviewId: string) {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" })
      if (!res.ok) throw new Error()

      toast({ title: "Review Deleted", description: "Your review has been removed." })
      setReviews(prev => prev.filter(r => r.id !== reviewId))
      onReviewDeleted?.()
      fetchReviews(1, true)
    } catch {
      toast({ title: "Error", description: "Could not delete review", variant: "destructive" })
    }
  }

  async function vote(reviewId: string, type: "helpful" | "notHelpful") {
    const res = await fetch("/api/reviews/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId, vote: type }),
    })

    const data = await res.json()
    if (!res.ok) {
      toast({ title: "Error", description: data.error, variant: "destructive" })
      return
    }

    fetchReviews(1, true)
  }

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        )}
      />
    ))

  return (
    <div className="space-y-6">

      {/* SUMMARY */}
      {reviews.length > 0 && (
        <Card>
          <CardContent className="p-6 flex gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
              <div className="flex items-center gap-1 justify-center">
                {renderStars(Math.round(averageRating))}
              </div>
              <div className="text-sm text-muted-foreground">
                Based on {reviews.length} reviews
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* LIST */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>

          {reviews.length === 0 ? (
            <p className="text-center text-muted-foreground">No reviews yet</p>
          ) : (
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review.id} className="border-b pb-4 last:border-0">
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-1">

                      {/* STARS + TITLE */}
                      <div className="flex items-center gap-2 mb-1">
                        {renderStars(review.rating)}
                        {review.title && <span className="font-medium">{review.title}</span>}
                      </div>

                      {/* USER + TIME */}
                      <div className="text-sm text-muted-foreground mb-1">
                        {review.user.name || "Anonymous"} •{" "}
                        {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                      </div>

                      {/* COMMENT */}
                      {review.comment && (
                        <p className="text-sm leading-relaxed mb-2">{review.comment}</p>
                      )}

                      {/* MEDIA */}
                      {Array.isArray(review.media) && review.media.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-2">
                          {review.media.map((m, i) =>
                            m.type === "image" ? (
                              <Image
                                key={i}
                                src={m.url}
                                alt="Review media"
                                width={100}
                                height={100}
                                className="object-cover rounded border cursor-pointer hover:opacity-90"
                                onClick={() => window.open(m.url, "_blank")}
                              />
                            ) : (
                              <video
                                key={i}
                                src={m.url}
                                className="w-28 h-28 rounded border"
                                controls
                              />
                            )
                          )}
                        </div>
                      )}

                      {/* VOTING */}
                      <div className="flex gap-4 mt-3">
                        <button
                          className="flex items-center gap-1 text-xs text-green-600 hover:underline"
                          onClick={() => vote(review.id, "helpful")}
                        >
                          <ThumbsUp className="h-3 w-3" /> Helpful ({review.helpful})
                        </button>
                        <button
                          className="flex items-center gap-1 text-xs text-red-600 hover:underline"
                          onClick={() => vote(review.id, "notHelpful")}
                        >
                          <ThumbsDown className="h-3 w-3" /> Not Helpful ({review.notHelpful})
                        </button>
                      </div>
                    </div>

                    {/* DELETE MENU */}
                    {session?.user?.id === review.user.id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Review
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              ))}

              {hasMore && (
                <div className="text-center pt-4">
                  <Button
                    variant="outline"
                    disabled={loading}
                    onClick={() => {
                      setPage(prev => prev + 1)
                      fetchReviews(page + 1)
                    }}
                  >
                    {loading ? "Loading..." : "Load More Reviews"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
