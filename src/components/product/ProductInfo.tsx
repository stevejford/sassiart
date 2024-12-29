import { Product } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, ArrowLeft, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!isArtworkSelected) {
      return;
    }
    onAddToCart();
  };

  return (
    <div className={`space-y-6 ${isFeatured ? 'mt-8' : ''}`}>
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

      <div className="pt-4 space-y-4">
        <Button
          className="w-full bg-black hover:bg-black/90 text-white"
          size="lg"
          onClick={handleAddToCart}
          disabled={!isArtworkSelected}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {isArtworkSelected ? 'Add to Cart' : 'Select Artwork First'}
        </Button>

        {isArtworkSelected && (
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/gallery')}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/cart")}
              className="w-full"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};