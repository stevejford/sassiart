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
        {/* Base product image */}
        <img
          src={product.image_url}
          alt={product.name}
          className={`w-full h-full object-contain p-4 ${isFeatured ? 'opacity-90' : ''}`}
        />
        
        {/* Selected artwork overlay */}
        {selectedArtwork && (
          <div className={`absolute inset-0 flex items-center justify-center p-8 ${
            isFeatured ? 'mix-blend-multiply bg-white/10' : ''
          }`}>
            <img
              src={selectedArtwork.image_url}
              alt={selectedArtwork.title}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
};