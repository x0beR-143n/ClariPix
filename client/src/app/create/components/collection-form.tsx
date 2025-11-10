"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X, Plus } from "lucide-react"
import ImageSelector from "./image-selector"

interface CollectionFormProps {
  uploadedImages?: File[]
}

export default function CollectionForm({ uploadedImages = [] }: CollectionFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImages, setSelectedImages] = useState<number[]>([])

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    console.log({
      name,
      description,
      tags,
      isPublic,
      selectedImages: selectedImages.map((index) => uploadedImages[index]),
    })

    setTimeout(() => {
      setIsSubmitting(false)
      setName("")
      setDescription("")
      setTags([])
      setIsPublic(false)
      setSelectedImages([])
    }, 1000)
  }

  return (
    <Card className="p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Collection Name *</label>
          <Input
            placeholder="e.g., Summer Vibes, Nature Collection..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Description</label>
          <textarea
            placeholder="Describe your collection..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base font-sans"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Tags</label>
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Add a tag and press enter..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
            />
            <Button type="button" onClick={handleAddTag} variant="outline" className="px-3 bg-transparent">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-primary-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Select Images {uploadedImages.length > 0 && "(Optional)"}
          </label>
          <ImageSelector
            images={uploadedImages}
            selectedImages={selectedImages}
            onSelectionChange={setSelectedImages}
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-4 h-4 rounded border-input"
          />
          <label htmlFor="isPublic" className="text-sm font-medium text-foreground">
            Make this collection public
          </label>
        </div>

        <Button type="submit" disabled={!name.trim() || isSubmitting} className="w-full" size="lg">
          {isSubmitting ? "Creating..." : "Create Collection"}
        </Button>
      </form>
    </Card>
  )
}
