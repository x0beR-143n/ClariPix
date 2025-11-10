"use client"

import { useState } from "react"
import { Upload, Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ImageUploadSection from "./components/image-upload-section"
import CollectionForm from "./components/collection-form"
import PreviewImages from "./components/preview-images"

type Tab = "upload" | "collection"

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState<Tab>("upload")
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleImagesAdded = (files: File[]) => {
    setUploadedImages((prev) => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (!uploadedImages.length || isUploading) return
    setIsUploading(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || ""
      // Try common token keys; adjust to your auth storage if needed
      const token =
        typeof window !== "undefined"
          ?
            (localStorage.getItem("token") ||
              localStorage.getItem("access_token") ||
              localStorage.getItem("authToken") ||
              "")
          : ""

      // Optional: enforce 10MB per image as hinted in Tips
      const maxBytes = 10 * 1024 * 1024
      const toUpload = uploadedImages.filter((f) => f.size <= maxBytes)
      if (toUpload.length !== uploadedImages.length) {
        console.warn("Some files exceed 10MB and were skipped.")
      }

      for (const file of toUpload) {
        const form = new FormData()
        form.append("image", file)
        // form.append("description", "") // optionally send description

        const headers: Record<string, string> = {}
        if (token) headers["Authorization"] = `Bearer ${token}`

        // If NEXT_PUBLIC_API_URL is not set, this will call relative path
        const res = await fetch(`${baseUrl}/images/upload`, {
          method: "POST",
          headers,
          body: form,
        })

        if (!res.ok) {
          const text = await res.text()
          console.error("Upload failed:", res.status, text)
        }
      }
    } catch (err) {
      console.error("Upload error:", err)
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
                    <PreviewImages images={uploadedImages} onRemove={removeImage} />
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
