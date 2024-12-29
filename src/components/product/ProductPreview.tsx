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
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="relative w-full h-full">
            {/* Base product image */}
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain"
            />
            
            {/* Info overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white flex flex-col justify-end">
              {selectedArtwork ? (
                <>
                  <p className="text-sm text-white/90 mb-1">by {selectedArtwork.student.name}</p>
                  <h3 className="text-lg font-medium mb-1">{selectedArtwork.title}</h3>
                  {selectedArtwork.description && (
                    <p className="text-sm text-white/80 line-clamp-2">{selectedArtwork.description}</p>
                  )}
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium mb-1">{product.name}</h3>
                  {product.description && (
                    <p className="text-sm text-white/80 line-clamp-2">{product.description}</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};