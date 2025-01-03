import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ProductTable } from "@/components/admin/ProductTable"
import { AddProductDialog } from "@/components/admin/AddProductDialog"

export default function Products() {
  const { data: products, refetch } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      return data || []
    },
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Manage your store's products and inventory
          </p>
        </div>
        <AddProductDialog onProductAdded={refetch} />
      </div>

      <div className="bg-white rounded-lg border">
        {products && <ProductTable products={products} onUpdate={refetch} />}
      </div>
    </div>
  )
}