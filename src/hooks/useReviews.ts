'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

export function useReviews(productId: string) {
  const [reviews, setReviews] = useState<any[]>([])
  const [ratingDistribution, setRatingDistribution] = useState<any>({})
  const [averageRating, setAverageRating] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(5)
  const [sort, setSort] = useState("createdAt")
  const [order, setOrder] = useState<"asc" | "desc">("desc")
  const [withImages, setWithImages] = useState(false)
  const [total, setTotal] = useState(0)

  async function load(reset = false) {
    const params = new URLSearchParams()
    params.append("productId", productId)
    params.append("page", (reset ? 1 : page).toString())
    params.append("limit", limit.toString())
    params.append("sort", sort)
    params.append("order", order)
    if (withImages) params.append("withImages", "true")

    const { data } = await axios.get(`/api/reviews?${params.toString()}`)

    if (reset) {
      setReviews(data.reviews)
      setPage(1)
    } else {
      setReviews(prev => [...prev, ...data.reviews])
    }

    setTotal(data.pagination.total)
    setAverageRating(data.averageRating)
    setRatingDistribution(data.ratingDistribution)
  }

  useEffect(() => {
    setPage(1)
    load(true)
  }, [sort, order, withImages])

  useEffect(() => {
    if (page > 1) load(false)
  }, [page])

  return {
    reviews,
    total,
    limit,
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
  }
}
