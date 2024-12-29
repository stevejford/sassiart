import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface ProductImageProps {
  productId: string
  imageUrl: string | null
  onUpdate: (url: string) => Promise<void>
}

export const ProductImage = ({ productId, imageUrl, onUpdate }: ProductImageProps) => {
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const filePath = `${productId}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      await onUpdate(publicUrl)
      
      toast({
        title: "Success",
        description: "Product image updated successfully"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload image"
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Product"
          className="w-20 h-20 object-cover rounded"
        />
      )}
      <div>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleImageUpload(file)
          }}
          className="hidden"
          id={`image-${productId}`}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => document.getElementById(`image-${productId}`)?.click()}
          disabled={uploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </div>
    </div>
  )
}