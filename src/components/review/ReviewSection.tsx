'use client'

import { useReviews } from '@/hooks/useReviews'
import ReviewItem from './ReviewItem'
import ReviewForm from './ReviewForm'
import RatingGraph from './RatingGraph'

export default function ReviewSection({ productId }: { productId: string }) {
  const {
    reviews,
    total,
    page,
    setPage,
    sort,
    setSort,
    order,
    setOrder,
    withImages,
    setWithImages,
    averageRating,
    ratingDistribution,
    setReviews,
    limit
  } = useReviews(productId)

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="p-4 border rounded space-y-2">
        <div className="text-3xl font-bold">{averageRating.toFixed(1)} ⭐</div>
        <RatingGraph ratingDistribution={ratingDistribution} />
      </div>

      {/* Review Form */}
      <ReviewForm
        productId={productId}
        onAdd={(review: any) => setReviews(prev => [review, ...prev])}
      />

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <select
          className="border p-2 rounded"
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          <option value="createdAt">Newest</option>
          <option value="rating">Top Rated</option>
        </select>

        <select
          className="border p-2 rounded"
          value={order}
          onChange={e => setOrder(e.target.value as 'asc' | 'desc')}
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={withImages}
            onChange={e => setWithImages(e.target.checked)}
          />
          With Images
        </label>
      </div>

      {/* Reviews List */}
      {reviews.map(review => (
        <ReviewItem key={review.id} review={review} />
      ))}

      {/* Load More */}
      {reviews.length < total && (
        <button
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Load More ({reviews.length}/{total})
        </button>
      )}
    </div>
  )
}
