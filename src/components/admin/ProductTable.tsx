import { useState } from "react"
import { Product } from "@/types/database"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trash2, Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface ProductTableProps {
  products: Product[]
  onUpdate: () => void
}

export const ProductTable = ({ products, onUpdate }: ProductTableProps) => {
  const { toast } = useToast()
  const [uploading, setUploading] = useState<string | null>(null)

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const { error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating product",
        description: error.message
      })
    } else {
      toast({
        title: "Product updated",
        description: "The product has been updated successfully."
      })
      onUpdate()
    }
  }

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      toast({
        variant: "destructive",
        title: "Error deleting product",
        description: error.message
      })
    } else {
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully."
      })
      onUpdate()
    }
  }

  const handleImageUpload = async (id: string, file: File) => {
    try {
      setUploading(id)
      const fileExt = file.name.split('.').pop()
      const filePath = `${id}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      await updateProduct(id, { image_url: publicUrl })
      
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
      setUploading(null)
    }
  }

  const calculateTotalPrice = (basePrice: number, markup: number) => {
    return basePrice * (1 + markup / 100)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Cost Price</TableHead>
          <TableHead>Markup (%)</TableHead>
          <TableHead>Total Price</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div className="space-y-2">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(product.id, file)
                    }}
                    className="hidden"
                    id={`image-${product.id}`}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById(`image-${product.id}`)?.click()}
                    disabled={uploading === product.id}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading === product.id ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Input
                defaultValue={product.name}
                onBlur={(e) => updateProduct(product.id, { name: e.target.value })}
              />
            </TableCell>
            <TableCell>
              <Textarea
                defaultValue={product.description || ''}
                onBlur={(e) => updateProduct(product.id, { description: e.target.value })}
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                defaultValue={product.base_price}
                onBlur={(e) => updateProduct(product.id, { base_price: parseFloat(e.target.value) })}
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                defaultValue="30"
                onBlur={(e) => {
                  const markup = parseFloat(e.target.value)
                  const totalPrice = calculateTotalPrice(product.base_price, markup)
                  // Note: You might want to store the markup in the database
                }}
              />
            </TableCell>
            <TableCell>
              {calculateTotalPrice(product.base_price, 30).toFixed(2)}
            </TableCell>
            <TableCell>
              <Input
                defaultValue={product.category}
                onBlur={(e) => updateProduct(product.id, { category: e.target.value })}
              />
            </TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteProduct(product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}