import { ArtworkWithStudent } from "@/types/database";
import { Skeleton } from "@/components/ui/skeleton";

interface ArtworkSelectorProps {
  artwork: ArtworkWithStudent[] | undefined;
  selectedArtwork: string | null;
  onArtworkSelect: (artworkId: string) => void;
  isLoading: boolean;
}

export const ArtworkSelector = ({ 
  artwork, 
  selectedArtwork, 
  onArtworkSelect,
  isLoading 
}: ArtworkSelectorProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {Array(6).fill(0).map((_, i) => (
          <Skeleton key={i} className="aspect-square" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-serif font-semibold mb-4">Select Artwork</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {artwork?.map((art) => (
          <div
            key={art.id}
            className={`aspect-square rounded-lg border overflow-hidden cursor-pointer transition-all ${
              selectedArtwork === art.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onArtworkSelect(art.id)}
          >
            <img
              src={art.image_url}
              alt={art.title}
              className="w-full h-full object-cover"
            />
            <div className="p-2 bg-black/50 text-white absolute bottom-0 left-0 right-0">
              <p className="text-sm font-medium truncate">{art.title}</p>
              <p className="text-xs">by {art.student.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};