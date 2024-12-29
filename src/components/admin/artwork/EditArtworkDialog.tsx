import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "./ImageUpload"
import { ArtworkWithStudent } from "@/types/database"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"

interface EditArtworkDialogProps {
  artwork: ArtworkWithStudent | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
}

export function EditArtworkDialog({
  artwork,
  isOpen,
  onOpenChange,
  onUpdate,
}: EditArtworkDialogProps) {
  const [form, setForm] = useState({
    title: artwork?.title || "",
    description: artwork?.description || "",
    image_url: artwork?.image_url || "",
  })

  const handleImageUpload = (url: string) => {
    setForm(prev => ({ ...prev, image_url: url }))
  }

  const handleUpdate = async () => {
    if (!artwork) return

    try {
      const { error } = await supabase
        .from("artwork")
        .update({
          title: form.title,
          description: form.description,
          image_url: form.image_url,
        })
        .eq("id", artwork.id)

      if (error) throw error

      toast.success("Artwork updated successfully")
      onOpenChange(false)
      onUpdate()
    } catch (error) {
      toast.error("Failed to update artwork")
      console.error(error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Artwork</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <ImageUpload 
            currentImage={form.image_url} 
            onUpload={handleImageUpload} 
          />
          <Button onClick={handleUpdate} className="w-full">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}