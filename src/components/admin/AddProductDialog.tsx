import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"

interface AddProductDialogProps {
  onProductAdded: () => void
}

export const AddProductDialog = ({ onProductAdded }: AddProductDialogProps) => {
  const { toast } = useToast()
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    base_price: 0,
    category: "",
    image_url: "",
  })

  const createProduct = async () => {
    const { error } = await supabase
      .from('products')
      .insert([newProduct])

    if (error) {
      toast({
        variant: "destructive",
        title: "Error creating product",
        description: error.message
      })
    } else {
      toast({
        title: "Product created",
        description: "The new product has been created successfully."
      })
      setNewProduct({
        name: "",
        description: "",
        base_price: 0,
        category: "",
        image_url: "",
      })
      onProductAdded()
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <Textarea
            placeholder="Description"
            value={newProduct.description || ""}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Base Price"
            value={newProduct.base_price}
            onChange={(e) => setNewProduct({ ...newProduct, base_price: parseFloat(e.target.value) })}
          />
          <Input
            placeholder="Category"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          />
          <Input
            placeholder="Image URL"
            value={newProduct.image_url}
            onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
          />
          <Button onClick={createProduct}>Create Product</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}