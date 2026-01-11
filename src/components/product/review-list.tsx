"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MoreVertical, Edit, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

interface Review {
  id: string
  rating: number
  title: string | null
  comment: string | null
  createdAt: string
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

  const fetchReviews = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/reviews?productId=${productId}&page=${pageNum}&limit=5`
      )
      
      if (response.ok) {
        const data = await response.json()
        
        if (reset) {
          setReviews(data.reviews)
        } else {
          setReviews(prev => [...prev, ...data.reviews])
        }
        
        setAverageRating(data.averageRating || 0)
        setRatingDistribution(data.ratingDistribution || {})
        setHasMore(data.pagination.page < data.pagination.pages)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews(1, true)
  }, [productId])

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Review Deleted",
          description: "Your review has been deleted",
        })
        setReviews(prev => prev.filter(review => review.id !== reviewId))
        onReviewDeleted?.()
        // Refresh reviews to update average rating
        fetchReviews(1, true)
      } else {
        throw new Error('Failed to delete review')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      })
    }
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchReviews(nextPage, false)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        )}
      />
    ))
  }

  if (loading && reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted w-1/4"></div>
                <div className="h-3 bg-muted w-1/2"></div>
                <div className="h-3 bg-muted w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Average Rating Summary */}
      {reviews.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
                <div className="flex items-center gap-1">
                  {renderStars(Math.round(averageRating))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Based on {reviews.length} review{reviews.length > 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingDistribution[star] || 0
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                  
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-sm w-4">{star}</span>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">
                        {count}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reviews yet</p>
              <p className="text-sm text-muted-foreground">
                Be the first to review this product!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                        {review.title && (
                          <h4 className="font-medium">{review.title}</h4>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span className="font-medium">
                          {review.user.name || 'Anonymous'}
                        </span>
                        <span>•</span>
                        <span>
                          {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      
                      {review.comment && (
                        <p className="text-sm leading-relaxed">{review.comment}</p>
                      )}
                    </div>
                    
                    {/* Review Actions (only for user's own reviews) */}
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
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Review
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
                    onClick={loadMore}
                    disabled={loading}
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