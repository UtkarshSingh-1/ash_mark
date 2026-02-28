"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Upload, X, Save, Trash2 } from "lucide-react"

type ProductStoryFormProps = {
  product: {
    id: string
    name: string
    category: { name: string }
    storyTitle?: string | null
    storyContent?: string | null
    storyImages: string[]
  }
}

export function ProductStoryForm({ product }: ProductStoryFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [storyTitle, setStoryTitle] = useState(product.storyTitle ?? "")
  const [storyContent, setStoryContent] = useState(product.storyContent ?? "")
  const [storyImages, setStoryImages] = useState<string[]>(product.storyImages || [])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [saving, setSaving] = useState(false)

  const hasStory = Boolean(storyTitle.trim() || storyContent.trim() || storyImages.length)

  const handleImageUpload = async (files: FileList) => {
    setUploadingImages(true)
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("purpose", "story_image")

        const response = await fetch("/api/media/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        const data = await response.json()
        return data.url as string
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      setStoryImages((prev) => [...prev, ...uploadedUrls])

      toast({
        title: "Success",
        description: `${uploadedUrls.length} image(s) uploaded successfully`,
      })
    } catch (error) {
      console.error("Error uploading images:", error)
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      })
    } finally {
      setUploadingImages(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const removeImage = (index: number) => {
    setStoryImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!storyTitle.trim() || !storyContent.trim()) {
      toast({
        title: "Error",
        description: "Story title and content are required",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/admin/products/${product.id}/story`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyTitle: storyTitle.trim(),
          storyContent: storyContent.trim(),
          storyImages,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update story")
      }

      toast({
        title: "Success",
        description: "Product story updated successfully",
      })
      router.push(`/admin/products/${product.id}`)
    } catch (error) {
      console.error("Error saving story:", error)
      toast({
        title: "Error",
        description: "Failed to save product story",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!hasStory || !confirm("Are you sure you want to remove the story for this product?")) {
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/admin/products/${product.id}/story`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to remove story")
      }

      toast({
        title: "Success",
        description: "Product story removed successfully",
      })
      setStoryTitle("")
      setStoryContent("")
      setStoryImages([])
    } catch (error) {
      console.error("Error removing story:", error)
      toast({
        title: "Error",
        description: "Failed to remove product story",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {product.name} • {product.category.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={saving || !hasStory}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remove Story
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Story"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Story Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="storyTitle">Story Title</Label>
              <Input
                id="storyTitle"
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                placeholder="Enter the story title..."
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="storyContent">Story Content</Label>
              <Textarea
                id="storyContent"
                value={storyContent}
                onChange={(e) => setStoryContent(e.target.value)}
                placeholder="Tell the story behind this product..."
                className="mt-2 min-h-[200px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Story Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="imageUpload">Upload Images</Label>
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    id="imageUpload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImages}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadingImages ? "Uploading..." : "Choose Images"}
                  </Button>
                </div>
              </div>

              {storyImages.length > 0 && (
                <div>
                  <Label>Current Images ({storyImages.length})</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {storyImages.map((image, index) => (
                      <div key={image + index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden">
                          <Image src={image} alt={`Story image ${index + 1}`} fill className="object-cover" />
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Button
        variant="ghost"
        onClick={() => router.push(`/admin/products/${product.id}`)}
        className="mt-4 w-fit"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Product
      </Button>
    </div>
  )
}

