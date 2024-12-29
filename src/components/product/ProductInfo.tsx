import { Product } from "@/types/database";
import { Button } from "@/components/ui/button";

interface ProductInfoProps {
  product: Product;
  onAddToCart: () => void;
  isArtworkSelected: boolean;
}

export const ProductInfo = ({ product, onAddToCart, isArtworkSelected }: ProductInfoProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">{product.name}</h1>
        <p className="text-lg text-muted-foreground">${product.base_price.toFixed(2)}</p>
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={onAddToCart}
        disabled={!isArtworkSelected}
      >
        Add to Cart
      </Button>

      {product.description && (
        <div>
          <h2 className="text-xl font-serif font-semibold mb-2">Description</h2>
          <p className="text-muted-foreground">{product.description}</p>
        </div>
      )}
    </div>
  );
};