import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface ImageUploadProps {
  onUpload: (url: string) => void
  currentImage?: string
}

export const ImageUpload = ({ onUpload, currentImage }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      onUpload(data.publicUrl)
    } catch (error) {
      toast.error('Error uploading image')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Label>Artwork Image</Label>
      {currentImage && (
        <div className="mb-4">
          <img
            src={currentImage}
            alt="Current artwork"
            className="w-32 h-32 object-cover rounded-lg"
          />
        </div>
      )}
      <Input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
    </div>
  )
}