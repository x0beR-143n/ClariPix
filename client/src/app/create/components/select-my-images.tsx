"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getMyImages, type MyImage } from "@/api/users"
import { addImagesToCollection } from "@/api/collections"
import { toast } from "sonner"

export default function SelectMyImages(props: {
  collectionId: string
  onDone: () => void
  onCancel: () => void
}) {
  const { collectionId, onDone, onCancel } = props
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<MyImage[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const { images } = await getMyImages(1, 50)
        setImages(images)
      } catch {
        toast.error("Thất bại", { description: "Không tải được danh sách ảnh của bạn" })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const confirm = async () => {
    try {
      if (selected.size > 0) {
        await addImagesToCollection(collectionId, Array.from(selected))
        toast.success("Thành công", { description: `Đã thêm ${selected.size} ảnh vào bộ sưu tập` })
      }
      onDone()
    } catch {
      toast.error("Thất bại", { description: "Không thể thêm ảnh vào bộ sưu tập" })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Chọn ảnh để thêm vào bộ sưu tập</h1>
        <Card className="p-6">
          {loading ? (
            <p className="text-sm text-muted-foreground">Đang tải ảnh của bạn…</p>
          ) : images.length === 0 ? (
            <p className="text-sm text-muted-foreground">Bạn chưa có ảnh nào.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((img) => {
                const isSel = selected.has(img.id)
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => toggle(img.id)}
                    className={`relative aspect-square rounded-lg overflow-hidden border transition ${
                      isSel ? "border-primary ring-2 ring-primary/40" : "border-border hover:shadow"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.image_url} alt={img.description || "image"} className="w-full h-full object-cover" />
                    {isSel && (
                      <span className="absolute top-2 right-2 inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground">✓</span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
          <div className="flex gap-3 mt-6">
            <Button onClick={confirm} disabled={loading} className="bg-red-600 text-white hover:bg-red-700">Xác nhận</Button>
            <Button variant="outline" onClick={onCancel}>Bỏ qua</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
