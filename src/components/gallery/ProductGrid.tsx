import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ProductCard"
import { Product } from "@/types/database"

interface ProductGridProps {
  products: Product[]
  onBack: () => void
  onProductSelect: (productId: string) => void
}

export function ProductGrid({ products, onBack, onProductSelect }: ProductGridProps) {
  return (
    <div>
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={onBack}
      >
        ← Back to Gallery
      </Button>
      <h2 className="text-2xl font-bold mb-6">Choose a Product to Customize</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <div key={product.id} onClick={() => onProductSelect(product.id)}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}