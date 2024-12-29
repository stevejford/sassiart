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
            
            {/* Selected artwork overlay */}
            {selectedArtwork && (
              <div className="absolute inset-0">
                <img
                  src={selectedArtwork.image_url}
                  alt={selectedArtwork.title}
                  className="w-full h-full object-contain p-4"
                />
              </div>
            )}
            
            {/* Info overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end text-white">
              {selectedArtwork ? (
                <>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-white/90">Artist</p>
                    <h3 className="text-xl font-semibold">{selectedArtwork.student.name}</h3>
                    <p className="text-lg font-medium">{selectedArtwork.title}</p>
                    {selectedArtwork.description && (
                      <p className="text-sm text-white/80 line-clamp-2 mt-2">
                        {selectedArtwork.description}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  {product.description && (
                    <p className="text-sm text-white/80 line-clamp-2">
                      {product.description}
                    </p>
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