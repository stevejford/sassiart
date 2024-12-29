import { Product } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ProductInfoProps {
  product: Product;
  onAddToCart: () => void;
  isArtworkSelected: boolean;
  isFeatured?: boolean;
}

export const ProductInfo = ({ 
  product, 
  onAddToCart, 
  isArtworkSelected,
  isFeatured = false 
}: ProductInfoProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-serif font-bold mb-2">{product.name}</h1>
        <p className="text-2xl font-medium text-primary">${product.base_price.toFixed(2)}</p>
      </div>

      <Separator />

      {product.description && (
        <div>
          <h2 className="text-lg font-serif font-semibold mb-2">About this product</h2>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
        </div>
      )}

      <div className="pt-4">
        <Button
          className="w-full"
          size="lg"
          onClick={onAddToCart}
          disabled={!isArtworkSelected}
        >
          {isArtworkSelected ? 'Add to Cart' : 'Select Artwork First'}
        </Button>
      </div>
    </div>
  );
};