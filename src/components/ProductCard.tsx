import { Link } from "react-router-dom";
import { Product } from "@/types/database";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  onCustomize?: () => void;
  className?: string;
}

export function ProductCard({ product, onCustomize, className = "" }: ProductCardProps) {
  return (
    <div className={`group relative rounded-lg border p-4 space-y-4 ${className}`}>
      <div className="aspect-square overflow-hidden rounded-lg bg-muted">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div>
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-sm text-muted-foreground">${product.base_price.toFixed(2)}</p>
      </div>
      <Button 
        className="w-full"
        asChild={!onCustomize}
        onClick={onCustomize}
      >
        {onCustomize ? (
          <span>Customize</span>
        ) : (
          <Link to={`/gallery?productId=${product.id}`}>
            Customize
          </Link>
        )}
      </Button>
    </div>
  );
}