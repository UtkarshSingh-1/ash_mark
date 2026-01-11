"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Package, TrendingUp } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TopProducts } from "@/components/admin/top-products"

export function AddProductSection() {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5 text-crimson-600" />
          Product Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-crimson-50 dark:bg-crimson-900/20 rounded-full flex items-center justify-center">
            <Plus className="w-8 h-8 text-crimson-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Add New Product</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create and manage your product catalog
          </p>
          <Button asChild className="bg-crimson-600 hover:bg-crimson-700">
            <Link href="/admin/products/add">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium">Quick Actions</span>
          </div>
          <div className="flex justify-center">
            <Button variant="outline" size="sm" asChild className="border-0 bg-muted/30">
              <Link href="/admin/products">
                <Package className="w-4 h-4 mr-2" />
                View All
              </Link>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-0 bg-muted/30 ml-2">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Top Products
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Top Performing Products</DialogTitle>
                </DialogHeader>
                <TopProducts />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}