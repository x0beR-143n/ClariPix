"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface PreviewImagesProps {
  images: File[]
  onRemove: (index: number) => void
}

export default function PreviewImages({ images, onRemove }: PreviewImagesProps) {
  const [descriptions, setDescriptions] = useState<Record<number, string>>({})

  const handleDescriptionChange = (index: number, value: string) => {
    setDescriptions((prev) => ({
      ...prev,
      [index]: value,
    }))
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {images.map((file, index) => {
        const preview = URL.createObjectURL(file)
        return (
          <div key={index} className="group relative">
            <div className="relative overflow-hidden rounded-lg aspect-square bg-muted">
              <img
                src={preview || "/placeholder.svg"}
                alt={`Preview ${index}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => onRemove(index)}
                className="absolute top-2 right-2 p-1 bg-destructive/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4 text-destructive-foreground" />
              </button>
            </div>
            <div className="mt-2 space-y-1">
              <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <Input
                placeholder="Add description..."
                value={descriptions[index] || ""}
                onChange={(e) => handleDescriptionChange(index, e.target.value)}
                className="text-xs h-8"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
