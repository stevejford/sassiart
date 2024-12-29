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
import { Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface ProductTableProps {
  products: Product[]
  onUpdate: () => void
}

export const ProductTable = ({ products, onUpdate }: ProductTableProps) => {
  const { toast } = useToast()

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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
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