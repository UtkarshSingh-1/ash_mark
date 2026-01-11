"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Filter, X } from "lucide-react"
import { ProductFilters } from "./product-filters"
import { useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export function MobileFilters() {
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()

  const activeFiltersCount = [
    searchParams.get('category'),
    searchParams.get('minPrice'),
    searchParams.get('maxPrice'),
    searchParams.get('search'),
    searchParams.get('featured'),
    searchParams.get('trending'),
  ].filter(Boolean).length

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter Options</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 sm:w-96">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Products
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <ProductFilters />
        </div>
      </SheetContent>
    </Sheet>
  )
}