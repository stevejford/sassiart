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
  console.log('ProductPreview: Rendering with product:', {
    productName: product.name,
    productImage: product.image_url,
    hasSelectedArtwork: !!selectedArtwork,
    selectedArtworkDetails: selectedArtwork ? {
      title: selectedArtwork.title,
      imageUrl: selectedArtwork.image_url,
      studentName: selectedArtwork.student.name
    } : null
  });

  return (
    <div className="sticky top-24">
      <div className="aspect-square overflow-hidden rounded-lg border bg-white relative">
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="relative w-full h-full">
            {/* Base product image */}
            {(() => {
              console.log('ProductPreview: Rendering base product image:', product.image_url);
              return (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  onLoad={() => console.log('ProductPreview: Product image loaded successfully')}
                  onError={() => console.error('ProductPreview: Failed to load product image')}
                />
              );
            })()}
            
            {/* Artwork overlay */}
            {selectedArtwork && (() => {
              console.log('ProductPreview: Rendering artwork overlay:', selectedArtwork.image_url);
              return (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <img
                    src={selectedArtwork.image_url}
                    alt={selectedArtwork.title}
                    className="w-full h-full object-contain"
                    onLoad={() => console.log('ProductPreview: Artwork overlay loaded successfully')}
                    onError={() => console.error('ProductPreview: Failed to load artwork overlay')}
                  />
                </div>
              );
            })()}
            
            {/* Info overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-6 text-white flex flex-col justify-end">
              {selectedArtwork ? (
                <>
                  <p className="text-sm font-medium text-white/90 mb-1">
                    by {selectedArtwork.student.name}
                  </p>
                  <h3 className="text-xl font-bold mb-2">{selectedArtwork.title}</h3>
                  {selectedArtwork.description && (
                    <p className="text-sm text-white/80 line-clamp-2">
                      {selectedArtwork.description}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
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