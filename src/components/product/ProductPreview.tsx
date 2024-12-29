import { Product, ArtworkWithStudent } from "@/types/database";

interface ProductPreviewProps {
  product: Product;
  selectedArtwork: ArtworkWithStudent | undefined;
  isFeatured?: boolean;
}

export const ProductPreview = ({ 
  product, 
  selectedArtwork,
  isFeatured = false
}: ProductPreviewProps) => {
  return (
    <div className="sticky top-24">
      <div className="aspect-square overflow-hidden rounded-lg border bg-white relative">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Base product image */}
          <img
            src={product.image_url}
            alt={product.name}
            className="w-3/4 h-3/4 object-contain"
          />
          
          {/* Product info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
            <h3 className="text-lg font-medium mb-1">{product.name}</h3>
            {product.description && (
              <p className="text-sm text-white/80 line-clamp-2">{product.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};