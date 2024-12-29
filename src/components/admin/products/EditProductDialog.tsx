import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "../artwork/ImageUpload"
import { Product } from "@/types/database"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { PriceFields } from "./PriceFields"

interface EditProductDialogProps {
  product: Product | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
}

export function EditProductDialog({
  product,
  isOpen,
  onOpenChange,
  onUpdate,
}: EditProductDialogProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    base_price: 0,
    category: "",
    image_url: "",
    is_popular: false,
  })

  useEffect(() => {
    if (product && isOpen) {
      setForm({
        name: product.name,
        description: product.description || "",
        base_price: product.base_price,
        category: product.category,
        image_url: product.image_url,
        is_popular: product.is_popular,
      })
    }
  }, [product, isOpen])

  const handleImageUpload = (url: string) => {
    setForm(prev => ({ ...prev, image_url: url }))
  }

  const handleUpdate = async (updates: Partial<Product> = form) => {
    if (!product) return

    try {
      const { error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", product.id)

      if (error) throw error

      toast.success("Product updated successfully")
      onOpenChange(false)
      onUpdate()
    } catch (error) {
      toast.error("Failed to update product")
      console.error(error)
    }
  }

  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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
          <div className="space-y-2">
            <Label>Pricing</Label>
            <PriceFields product={product} onUpdate={handleUpdate} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="popular">Popular Product</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="popular"
                checked={form.is_popular}
                onCheckedChange={(checked) => setForm({ ...form, is_popular: checked })}
              />
              <span className="text-sm text-muted-foreground">
                Feature this product in the shop
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Current Image</Label>
            {form.image_url && (
              <img
                src={form.image_url}
                alt={form.name}
                className="w-32 h-32 object-cover rounded-lg"
              />
            )}
            <ImageUpload onUpload={handleImageUpload} />
          </div>
          <Button onClick={() => handleUpdate()} className="w-full">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}