"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductSortProps {
  value: string
}

export function ProductSort({ value }: ProductSortProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (nextValue: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", nextValue)
    params.delete("page")
    router.push(`?${params.toString()}`)
  }

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="createdAt">Latest</SelectItem>
        <SelectItem value="price">Price: Low to High</SelectItem>
        <SelectItem value="name">Name: A to Z</SelectItem>
      </SelectContent>
    </Select>
  )
}
