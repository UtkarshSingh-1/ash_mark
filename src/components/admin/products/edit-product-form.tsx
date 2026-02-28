"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Upload,
  X,
  Plus,
  Image as ImageIcon,
  AlertCircle,
  Package,
  Tag,
  Palette,
  Trash2,
  Move
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  comparePrice: number | null
  categoryId: string
  images: string[]
  sizes: string[]
  colors: string[]
  stock: number
  featured: boolean
  trending: boolean
  slug: string
  storyTitle?: string | null
  storyContent?: string | null
  storyImages?: string[]
  category: {
    id: string
    name: string
  }
}

interface EditProductFormProps {
  product: Product
}

interface ProductFormData {
  name: string
  description: string
  price: number
  comparePrice: number | null
  categoryId: string
  images: string[]
  sizes: string[]
  colors: string[]
  stock: number
  featured: boolean
  trending: boolean
  hasStory: boolean
  storyTitle: string
  storyContent: string
  storyImages: string[]
}

export function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [newSize, setNewSize] = useState("")
  const [newColor, setNewColor] = useState("")
  const [hasChanges, setHasChanges] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())


  const [formData, setFormData] = useState<ProductFormData>({
    name: product.name,
    description: product.description || "",
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    categoryId: product.categoryId,
    images: product.images,
    sizes: product.sizes,
    colors: product.colors,
    stock: product.stock,
    featured: product.featured,
    trending: product.trending,
    hasStory: Boolean((product.storyTitle || "").trim() || (product.storyContent || "").trim() || (product.storyImages || []).length > 0),
    storyTitle: product.storyTitle || "",
    storyContent: product.storyContent || "",
    storyImages: product.storyImages || [],
  })

  // Track changes
  const originalData = useMemo(() => ({
    name: product.name,
    description: product.description || "",
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    categoryId: product.categoryId,
    images: product.images,
    sizes: product.sizes,
    colors: product.colors,
    stock: product.stock,
    featured: product.featured,
    trending: product.trending,
    hasStory: Boolean((product.storyTitle || "").trim() || (product.storyContent || "").trim() || (product.storyImages || []).length > 0),
    storyTitle: product.storyTitle || "",
    storyContent: product.storyContent || "",
    storyImages: product.storyImages || [],
  }), [product])

  useEffect(() => {
    const hasFormChanges = JSON.stringify(formData) !== JSON.stringify(originalData)
    setHasChanges(hasFormChanges)
  }, [formData, originalData])

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleImageUpload = async (files: FileList) => {
    if (files.length === 0) return

    setUploading(true)
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('purpose', 'product_image')
      formData.append('folder', 'products')

      try {
        const response = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          return data.url
        } else {
          throw new Error('Upload failed')
        }
      } catch (error) {
        console.error('Error uploading image:', error)
        toast({
          title: "Upload Error",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        })
        return null
      }
    })

    try {
      const uploadedUrls = await Promise.all(uploadPromises)
      const validUrls = uploadedUrls.filter(url => url !== null)

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...validUrls]
      }))

      toast({
        title: "Success",
        description: `${validUrls.length} image(s) uploaded successfully`,
      })
    } catch {
      toast({
        title: "Error",
        description: "Some images failed to upload",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const moveImageUp = (index: number) => {
    if (index === 0) return
    setFormData(prev => {
      const newImages = [...prev.images]
      const temp = newImages[index - 1]
      newImages[index - 1] = newImages[index]
      newImages[index] = temp
      return { ...prev, images: newImages }
    })
  }

  const moveImageDown = (index: number) => {
    if (index === formData.images.length - 1) return
    setFormData(prev => {
      const newImages = [...prev.images]
      const temp = newImages[index + 1]
      newImages[index + 1] = newImages[index]
      newImages[index] = temp
      return { ...prev, images: newImages }
    })
  }

  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()]
      }))
      setNewSize("")
    }
  }

  const removeSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size)
    }))
  }

  const addColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, newColor.trim()]
      }))
      setNewColor("")
    }
  }

  const removeColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }))
  }

  const handleStoryImageUpload = async (files: FileList) => {
    if (files.length === 0) return

    setUploading(true)
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('purpose', 'story_image')
      formData.append('folder', 'products')

      try {
        const response = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          return data.url
        } else {
          throw new Error('Upload failed')
        }
      } catch (error) {
        console.error('Error uploading story image:', error)
        toast({
          title: "Upload Error",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        })
        return null
      }
    })

    try {
      const uploadedUrls = await Promise.all(uploadPromises)
      const validUrls = uploadedUrls.filter(url => url !== null)

      setFormData(prev => ({
        ...prev,
        storyImages: [...prev.storyImages, ...validUrls]
      }))

      toast({
        title: "Success",
        description: `${validUrls.length} story image(s) uploaded successfully`,
      })
    } catch {
      toast({
        title: "Error",
        description: "Some story images failed to upload",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }


  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Product name is required",
        variant: "destructive",
      })
      return
    }

    if (!formData.categoryId) {
      toast({
        title: "Validation Error",
        description: "Please select a category",
        variant: "destructive",
      })
      return
    }

    if (formData.images.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one product image is required",
        variant: "destructive",
      })
      return
    }

    if (formData.hasStory && (!formData.storyTitle.trim() || !formData.storyContent.trim())) {
      toast({
        title: "Validation Error",
        description: "Story title and content are required when story is enabled",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const productData = {
        ...formData,
        slug: generateSlug(formData.name),
      }

      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Success",
          description: "Product updated successfully",
        })
        setHasChanges(false)
        router.push(`/admin/products/${product.id}`)
      } else {
        const errorText = await response.text()
        console.error(
          'Update product failed:',
          `status=${response.status}`,
          `statusText=${response.statusText}`,
          `contentType=${response.headers.get('content-type')}`,
          `body=${errorText}`
        )
        let message = 'Failed to update product'

        if (errorText) {
          try {
            const error = JSON.parse(errorText)
            if (Array.isArray(error.details) && error.details[0]?.message) {
              message = error.details[0].message
            } else {
              message = error.error || error.message || message
            }
          } catch {
            message = errorText
          }
        }

        throw new Error(message)
      }
    } catch (error) {
      console.error('Error updating product:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update product",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const discardChanges = () => {
    if (!hasChanges) return

    if (confirm('Are you sure you want to discard all changes?')) {
      // Reset form data to original values
      setFormData({
        name: product.name,
        description: product.description || "",
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
        categoryId: product.categoryId,
        images: product.images,
        sizes: product.sizes,
        colors: product.colors,
        stock: product.stock,
        featured: product.featured,
        trending: product.trending,
        hasStory: Boolean((product.storyTitle || "").trim() || (product.storyContent || "").trim() || (product.storyImages || []).length > 0),
        storyTitle: product.storyTitle || "",
        storyContent: product.storyContent || "",
        storyImages: product.storyImages || [],
      })
      setNewSize("")
      setNewColor("")
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        {/* Changes Indicator */}
        {hasChanges && (
          <Card className="border-0 shadow-md border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-600">Unsaved Changes</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={discardChanges}
                  className="border-0 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600"
                >
                  Discard Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Basic Information */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter product name"
                className="border-0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your product..."
                rows={4}
                className="border-0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
                <SelectTrigger className="border-0">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="border-0">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  className="border-0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comparePrice">Compare Price (₹)</Label>
                <Input
                  id="comparePrice"
                  type="number"
                  value={formData.comparePrice || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, comparePrice: parseFloat(e.target.value) || null }))}
                  placeholder="0.00"
                  className="border-0"
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-muted-foreground">
                  Original price for discount calculation
                </p>
              </div>
            </div>

            {formData.comparePrice && formData.comparePrice > formData.price && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400">
                <p className="text-sm text-green-700 dark:text-green-300">
                  Discount: {Math.round(((formData.comparePrice - formData.price) / formData.comparePrice) * 100)}% off
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Images */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Product Images * ({formData.images.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group aspect-square bg-muted">
                  {imageErrors.has(index) ? (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-xs">Image failed to load</p>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={image}
                      alt={`Product ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={() => {
                        console.error('Image load error:', image)
                        setImageErrors(prev => new Set(prev).add(index))
                      }}
                    />
                  )}

                  {/* Main Image Badge */}
                  {index === 0 && (
                    <Badge className="absolute top-2 left-2 bg-crimson-600 text-xs border-0">
                      Main
                    </Badge>
                  )}

                  {/* Image Controls */}
                  {!imageErrors.has(index) && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-8 w-8 p-0 border-0"
                        onClick={() => moveImageUp(index)}
                        disabled={index === 0}
                      >
                        <Move className="h-3 w-3 rotate-180" />
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-8 w-8 p-0 border-0"
                        onClick={() => moveImageDown(index)}
                        disabled={index === formData.images.length - 1}
                      >
                        <Move className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="h-8 w-8 p-0 border-0"
                        onClick={() => removeImage(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              <div
                className="aspect-square border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer flex flex-col items-center justify-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground text-center">
                  {uploading ? "Uploading..." : "Add Images"}
                </span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
            />

            <p className="text-xs text-muted-foreground">
              Upload additional images. First image will be the main product image. Drag to reorder.
            </p>
          </CardContent>
        </Card>

        {/* Variants */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Variants
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sizes */}
            <div className="space-y-3">
              <Label>Sizes</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.sizes.map((size) => (
                  <Badge key={size} variant="outline" className="border-0 bg-muted/50">
                    {size}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-4 w-4 p-0"
                      onClick={() => removeSize(size)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="Add size (e.g., S, M, L, XL)"
                  className="border-0"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                />
                <Button type="button" onClick={addSize} variant="outline" className="border-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-3">
              <Label>Colors</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.colors.map((color) => (
                  <Badge key={color} variant="outline" className="border-0 bg-muted/50">
                    {color}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-4 w-4 p-0"
                      onClick={() => removeColor(color)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="Add color (e.g., Red, Blue, Black)"
                  className="border-0"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                />
                <Button type="button" onClick={addColor} variant="outline" className="border-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Inventory
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                placeholder="0"
                className="border-0"
                min="0"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Tags & Settings */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Product Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            <Separator />

            {/* Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="featured">Featured Product</Label>
                  <p className="text-sm text-muted-foreground">
                    Display this product prominently on the homepage
                  </p>
                </div>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="trending">Trending Product</Label>
                  <p className="text-sm text-muted-foreground">
                    Mark this product as trending
                  </p>
                </div>
                <Switch
                  id="trending"
                  checked={formData.trending}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, trending: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Story */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Product Story
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="hasStory">Include Product Story</Label>
                <p className="text-sm text-muted-foreground">
                  Add a compelling story behind this product
                </p>
              </div>
              <Switch
                id="hasStory"
                checked={formData.hasStory}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasStory: checked }))}
              />
            </div>

            {formData.hasStory && (
              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="storyTitle">Story Title *</Label>
                  <Input
                    id="storyTitle"
                    value={formData.storyTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, storyTitle: e.target.value }))}
                    placeholder="Enter the story title..."
                    className="border-0"
                    required={formData.hasStory}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storyContent">Story Content *</Label>
                  <Textarea
                    id="storyContent"
                    value={formData.storyContent}
                    onChange={(e) => setFormData(prev => ({ ...prev, storyContent: e.target.value }))}
                    placeholder="Tell the story behind this product..."
                    className="border-0 min-h-[120px]"
                    required={formData.hasStory}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Story Images</Label>
                  <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                    {formData.storyImages.map((image, index) => (
                      <div key={index} className="relative group aspect-square bg-muted">
                        <Image
                          src={image}
                          alt={`Story image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 border-0"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            storyImages: prev.storyImages.filter((_, i) => i !== index)
                          }))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}

                    <div
                      className="aspect-square border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer flex flex-col items-center justify-center"
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.multiple = true
                        input.accept = 'image/*'
                        input.onchange = (e) => {
                          const files = (e.target as HTMLInputElement).files
                          if (files) handleStoryImageUpload(files)
                        }
                        input.click()
                      }}
                    >
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1">
                        {uploading ? "Uploading..." : "Add Story Images"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/admin/products/${product.id}`)}
                className="border-0 bg-muted/30"
              >
                Cancel
              </Button>



              <Button
                type="submit"
                disabled={loading}
                className="bg-crimson-600 hover:bg-crimson-700 border-0"
              >
                {loading ? "Updating..." : "Update Product"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
