"use client"

import { useState } from "react"
import { Upload, Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ImageUploadSection from "./components/image-upload-section"
import CollectionForm from "./components/collection-form"
import PreviewImages from "./components/preview-images"
import { uploadMultipleImages, type UploadedImage } from "@/api/images"
import { toast } from "sonner"

type Tab = "upload" | "collection"

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState<Tab>("upload")
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedServerImages, setUploadedServerImages] = useState<UploadedImage[]>([])
  const [descriptions, setDescriptions] = useState<Record<number, string>>({})

  const handleImagesAdded = (files: File[]) => {
    setUploadedImages((prev) => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
    // Shift descriptions to keep indexes aligned
    setDescriptions((prev) => {
      const next: Record<number, string> = {}
      Object.entries(prev).forEach(([k, v]) => {
        const i = Number(k)
        if (i < index) next[i] = v
        if (i > index) next[i - 1] = v
      })
      return next
    })
  }

  const handleUpload = async () => {
    if (!uploadedImages.length || isUploading) return
    setIsUploading(true)
    try {
      const maxBytes = 10 * 1024 * 1024
      const toUpload = uploadedImages.filter((f) => f.size <= maxBytes)
      if (toUpload.length !== uploadedImages.length) {
        console.warn("Some files exceed 10MB and were skipped.")
      }

      // Build descriptions array aligned with toUpload order
      const descs = toUpload.map((file) => {
        const idx = uploadedImages.indexOf(file)
        return descriptions[idx] || ""
      })

      const results = await uploadMultipleImages(toUpload, descs)
      setUploadedServerImages((prev) => [...prev, ...results])
      toast.success("Thành công", { description: `Đã upload ${results.length} ảnh` })
      // Optionally clear local files after successful upload
      // setUploadedImages([])
    } catch (err) {
      console.error("Upload error:", err)
      toast.error("Thất bại", { description: "Upload thất bại" })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Create</h1>
          <p className="text-muted-foreground">Upload images or create collections to organize your content</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "upload"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            <Upload className="inline mr-2 h-5 w-5" />
            Upload Images
          </button>
          <button
            onClick={() => setActiveTab("collection")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "collection"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            <Plus className="inline mr-2 h-5 w-5" />
            Create Collection
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === "upload" && (
              <div className="space-y-6">
                <ImageUploadSection onImagesAdded={handleImagesAdded} />

                {uploadedImages.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      Preview ({uploadedImages.length} images)
                    </h2>
                    <PreviewImages
                      images={uploadedImages}
                      descriptions={descriptions}
                      onDescriptionChange={(i, val) =>
                        setDescriptions((prev) => ({ ...prev, [i]: val }))
                      }
                      onRemove={removeImage}
                    />
                  </Card>
                )}

                {uploadedImages.length > 0 && (
                  <Button
                    size="lg"
                    className="w-full"
                    disabled={isUploading}
                    onClick={handleUpload}
                  >
                    {isUploading ? "Uploading..." : `Upload ${uploadedImages.length} Image${uploadedImages.length > 1 ? "s" : ""}`}
                  </Button>
                )}
              </div>
            )}

            {activeTab === "collection" && <CollectionForm uploadedImages={uploadedImages} />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-3">Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Supported formats: JPG, PNG, WebP, GIF</li>
                <li>✓ Max file size: 10MB per image</li>
                <li>✓ Organize images into collections</li>
                <li>✓ Add descriptions and tags</li>
              </ul>
            </Card>

            <Card className="p-6 bg-accent/10">
              <h3 className="font-semibold text-foreground mb-2">Quick Start</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop images here or click to browse your files. You can upload multiple images at once.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
