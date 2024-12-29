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
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain"
              onLoad={() => console.log('ProductPreview: Product image loaded successfully')}
              onError={() => console.error('ProductPreview: Failed to load product image')}
            />
            
            {/* Info overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-6 text-white flex flex-col justify-end">
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              {product.description && (
                <p className="text-sm text-white/80 line-clamp-2">
                  {product.description}
                </p>
              )}
              {selectedArtwork && (
                <div className="mt-2 pt-2 border-t border-white/20">
                  <p className="text-sm font-medium text-white/90">
                    Customized with "{selectedArtwork.title}"
                  </p>
                  <p className="text-sm text-white/80">
                    by {selectedArtwork.student.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};