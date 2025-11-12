"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { createCollection } from "@/api/collections"
import { toast } from "sonner"

interface CollectionFormProps {
  uploadedImages?: File[]
}

export default function CollectionForm({ uploadedImages = [] }: CollectionFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await createCollection({ name, description })
      toast.success("Thành công", { description: "Tạo bộ sưu tập thành công" })
      setName("")
      setDescription("")
      setIsPublic(false)
    } catch (err: any) {
      const message = err?.response?.data?.message || "Tạo bộ sưu tập thất bại"
      toast.error("Thất bại", { description: message })
      // eslint-disable-next-line no-console
      console.error("Create collection failed:", err)
    } finally {
      setIsSubmitting(false)
    }
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
