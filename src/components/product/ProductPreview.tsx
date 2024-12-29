import { Product, ArtworkWithStudent } from "@/types/database";

interface ProductPreviewProps {
  product: Product;
  selectedArtwork: ArtworkWithStudent | undefined;
}

export const ProductPreview = ({ product, selectedArtwork }: ProductPreviewProps) => {
  return (
    <div className="sticky top-24">
      <div className="aspect-square overflow-hidden rounded-lg border bg-white relative">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-contain p-4"
        />
        {selectedArtwork && (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <img
              src={selectedArtwork.image_url}
              alt="Selected artwork"
              className="max-w-full max-h-full object-contain mix-blend-multiply"
            />
          </div>
        )}
      </div>
    </div>
  );
};