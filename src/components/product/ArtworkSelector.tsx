import { ArtworkWithStudent } from "@/types/database";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <div>
        <h2 className="text-lg font-serif font-semibold mb-4">Select Artwork</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-serif font-semibold mb-4">Select Artwork</h2>
      <ScrollArea className="h-[400px] pr-4">
        <div className="grid grid-cols-2 gap-4">
          {artwork?.map((art) => (
            <div
              key={art.id}
              className={`relative aspect-square rounded-lg border overflow-hidden cursor-pointer transition-all hover:border-primary ${
                selectedArtwork === art.id ? 'ring-2 ring-primary border-primary' : ''
              }`}
              onClick={() => onArtworkSelect(art.id)}
            >
              <img
                src={art.image_url}
                alt={art.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white p-2">
                <p className="text-sm font-medium truncate">{art.title}</p>
                <p className="text-xs truncate">by {art.student.name}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};