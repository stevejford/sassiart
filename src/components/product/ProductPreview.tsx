import { Product, ArtworkWithStudent } from "@/types/database";

interface ProductPreviewProps {
  product: Product;
  selectedArtwork: ArtworkWithStudent | undefined;
}

export const ProductPreview = ({ product, selectedArtwork }: ProductPreviewProps) => {
  return (
    <div className="space-y-6">
      <div className="aspect-square overflow-hidden rounded-lg border relative">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {selectedArtwork && (
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={selectedArtwork.image_url}
              alt="Selected artwork"
              className="w-3/4 h-3/4 object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
};