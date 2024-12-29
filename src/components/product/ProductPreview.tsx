import { Product, ArtworkWithStudent } from "@/types/database";

interface ProductPreviewProps {
  product: Product;
  selectedArtwork: ArtworkWithStudent | undefined;
}

export const ProductPreview = ({ product, selectedArtwork }: ProductPreviewProps) => {
  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-lg border relative">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {selectedArtwork && (
          <div className="absolute inset-0 flex items-center justify-center p-8 bg-white/10">
            <img
              src={selectedArtwork.image_url}
              alt="Selected artwork"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
};