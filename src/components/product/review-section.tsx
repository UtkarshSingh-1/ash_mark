"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReviewForm } from "./review-form"
import { ReviewList } from "./review-list"

interface ReviewSectionProps {
  productId: string
}

export function ReviewSection({ productId }: ReviewSectionProps) {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleReviewSubmitted = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleReviewDeleted = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="write">Write Review</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reviews" className="mt-6">
          <ReviewList 
            key={refreshKey}
            productId={productId} 
            onReviewDeleted={handleReviewDeleted}
          />
        </TabsContent>
        
        <TabsContent value="write" className="mt-6">
          <ReviewForm 
            productId={productId} 
            onReviewSubmitted={handleReviewSubmitted}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}