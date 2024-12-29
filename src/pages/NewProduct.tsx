import { useSearchParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { toast } from "sonner"

export default function NewProduct() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const artworkId = searchParams.get('artworkId')
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    base_price: '',
    category: 'Custom',
  })

  const { data: artwork } = useQuery({
    queryKey: ['artwork', artworkId],
    queryFn: async () => {
      if (!artworkId) return null
      const { data } = await supabase
        .from('artwork')
        .select(`
          *,
          student:students(name)
        `)
        .eq('id', artworkId)
        .single()
      return data
    },
    enabled: !!artworkId,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!artwork) return

    const { error } = await supabase
      .from('products')
      .insert([
        {
          name: productData.name,
          description: productData.description,
          base_price: parseFloat(productData.base_price),
          category: productData.category,
          image_url: artwork.image_url,
        }
      ])

    if (error) {
      toast.error("Failed to create product")
      return
    }

    toast.success("Product created successfully")
    navigate('/admin/products')
  }

  if (!artwork) return <div>Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Create Custom Product</h1>
      
      <div className="mb-8">
        <img
          src={artwork.image_url}
          alt={artwork.title}
          className="w-full aspect-video object-cover rounded-lg"
        />
        <div className="mt-4">
          <h2 className="text-xl font-semibold">{artwork.title}</h2>
          <p className="text-muted-foreground">By {artwork.student.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={productData.name}
            onChange={(e) => setProductData({ ...productData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={productData.description}
            onChange={(e) => setProductData({ ...productData, description: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Base Price</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={productData.base_price}
            onChange={(e) => setProductData({ ...productData, base_price: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={productData.category}
            onChange={(e) => setProductData({ ...productData, category: e.target.value })}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Create Product
        </Button>
      </form>
    </div>
  )
}