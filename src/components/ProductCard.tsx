import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types/database";

interface ProductCardProps {
  product: Product;
  onClick?: () => void; // Make onClick optional
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const navigate = useNavigate();

  // Use onClick if provided, otherwise use default navigation
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <Card className="overflow-hidden group animate-fadeIn">
      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 p-4">
        <div className="flex flex-col">
          <h3 className="font-serif text-lg font-medium">{product.name}</h3>
          <p className="text-sm text-muted-foreground">
            {product.product_categories?.name || product.category}
          </p>
        </div>
        <div className="flex items-center justify-between w-full">
          <span className="font-medium">${product.base_price.toFixed(2)}</span>
          <Button 
            variant="secondary"
            onClick={handleClick}
          >
            Customize
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};