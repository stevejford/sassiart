import { Product } from "@/types/database";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Icons } from "@/components/ui/icons";

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

  const navigate = useNavigate();

  const handleKeepShopping = () => {
    onAddToCart();
    navigate("/");
  };

  const handleViewCart = () => {
    onAddToCart();
    navigate("/cart");
  };

  const handleBuyNow = () => {
    onAddToCart();
    navigate("/checkout");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-2xl font-bold mt-2">{formatPrice(product.base_price)}</p>
      </div>
      
      {product.description && (
        <div className="prose max-w-none">
          <p>{product.description}</p>
        </div>
      )}

      <div className="space-y-3">
        <Button 
          className="w-full bg-black text-white hover:bg-gray-800 h-14"
          disabled={!isArtworkSelected}
          onClick={handleBuyNow}
        >
          <Icons.stripe className="mr-2 h-5 w-5" />
          Buy now with Stripe
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="w-full h-14"
            disabled={!isArtworkSelected}
            onClick={handleKeepShopping}
          >
            Keep shopping
          </Button>
          <Button
            variant="outline"
            className="w-full h-14"
            disabled={!isArtworkSelected}
            onClick={handleViewCart}
          >
            View cart
          </Button>
        </div>
      </div>
    </div>
  );
};