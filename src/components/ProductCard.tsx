import { Product } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  console.log('ProductCard: Rendering for product:', {
    id: product.id,
    name: product.name,
    price: product.base_price
  });

  const navigate = useNavigate();

  const handleClick = () => {
    console.log('ProductCard: Navigating to product detail:', product.id);
    navigate(`/product/${product.id}`);
  };

  return (
    <Card 
      className="group cursor-pointer transition-all hover:shadow-lg"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="aspect-square relative overflow-hidden rounded-t-lg">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onLoad={() => console.log('ProductCard: Product image loaded successfully:', product.image_url)}
            onError={() => console.error('ProductCard: Failed to load product image:', product.image_url)}
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            ${product.base_price.toFixed(2)}
          </p>
          {product.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}