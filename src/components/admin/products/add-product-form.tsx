"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Upload, 
  X, 
  Plus, 
  Image as ImageIcon, 
  Save, 
  Eye,
  Tag,
  Ruler,
  Palette,
  Package
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"

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

export function AddProductForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [newSize, setNewSize] = useState("")
  const [newColor, setNewColor] = useState("")

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    comparePrice: null,
    categoryId: "",
    images: [],
    sizes: [],
    colors: [],
    stock: 0,
    featured: false,
    trending: false,
    hasStory: false,
    storyTitle: "",
    storyContent: "",
    storyImages: [],
  })

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        console.log('Categories fetched:', data.categories)
        setCategories(data.categories)
      } else {
        console.error('Failed to fetch categories:', response.status)
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
      formData.append('folder', 'products')

      try {
        const response = await fetch('/api/upload', {
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
      formData.append('folder', 'products')

      try {
        const response = await fetch('/api/upload', {
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


  const handleSubmit = async (e: React.FormEvent, draft = false) => {
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

    setLoading(true)

    try {
      const productData = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      }

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Success",
          description: `Product ${draft ? 'saved as draft' : 'created'} successfully`,
        })
        router.push(`/admin/products/${result.product.id}`)
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create product')
      }
    } catch (error) {
      console.error('Error creating product:', error)
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={(e) => handleSubmit(e, false)}>
        {/* Basic Information */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
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
              <Label htmlFor="category">Category</Label>
              <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
                <SelectTrigger className="border-0">
                  <SelectValue placeholder={categories.length === 0 ? "No categories available" : "Select a category"} />
                </SelectTrigger>
                <SelectContent className="border-0">
                  {categories.length > 0 && (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
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
              Product Images *
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group aspect-square bg-muted">
                  <Image
                    src={image}
                    alt={`Product ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 border-0"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  {index === 0 && (
                    <Badge className="absolute bottom-2 left-2 bg-crimson-600 text-xs border-0">
                      Main
                    </Badge>
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
              Upload up to 10 images. First image will be the main product image.
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

        {/* Inventory & Shipping */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="w-5 h-5" />
              Inventory & Shipping
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
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
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Product Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

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
                      <span className="text-xs text-muted-foreground mt-1">Add Story Images</span>
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
                onClick={(e) => handleSubmit(e, true)}
                disabled={loading}
                className="border-0 bg-muted/30"
              >
                <Save className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                className="border-0 bg-muted/30"
                onClick={() => handleSubmit(new Event('submit') as any, true)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              
              <Button 
                type="submit"
                disabled={loading}
                className="bg-crimson-600 hover:bg-crimson-700 border-0"
              >
                {loading ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
