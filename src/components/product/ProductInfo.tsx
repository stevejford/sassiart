import { Product } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ProductInfoProps {
  product: Product;
  onAddToCart: () => void;
  isArtworkSelected: boolean;
}

export const ProductInfo = ({ 
  product, 
  onAddToCart,
  isArtworkSelected 
}: ProductInfoProps) => {
  console.log('ProductInfo: Rendering for product:', {
    id: product.id,
    name: product.name,
    price: product.base_price,
    isArtworkSelected
  });

  const handleAddToCart = () => {
    console.log('ProductInfo: Add to cart clicked', {
      productId: product.id,
      isArtworkSelected
    });
    onAddToCart();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-2xl font-bold mt-2">
          ${product.base_price.toFixed(2)}
        </p>
      </div>

      <Separator />

      {product.description && (
        <div className="prose prose-sm">
          <p>{product.description}</p>
        </div>
      )}

      <div className="space-y-4">
        <Button 
          size="lg" 
          className="w-full"
          onClick={handleAddToCart}
          disabled={!isArtworkSelected}
        >
          {isArtworkSelected ? 'Add to Cart' : 'Select Artwork First'}
        </Button>

        {!isArtworkSelected && (
          <p className="text-sm text-muted-foreground text-center">
            Please select artwork to customize this product
          </p>
        )}
      </div>
    </div>
  );
};