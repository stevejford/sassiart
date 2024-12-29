import { Button } from "@/components/ui/button"
import { Artwork } from "@/types/database"

interface ArtworkGridProps {
  artwork: Artwork[]
  onArtworkSelect: (artworkId: string) => void
}

export function ArtworkGrid({ artwork, onArtworkSelect }: ArtworkGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {artwork?.map((art) => (
        <div key={art.id} className="group relative">
          <img
            src={art.image_url}
            alt={art.title}
            className="w-full aspect-square object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <div className="text-white text-center p-4">
              <h3 className="text-xl font-bold mb-2">{art.title}</h3>
              <p className="text-sm mb-4 text-gray-300">{art.description}</p>
              <Button 
                variant="outline"
                onClick={() => onArtworkSelect(art.id)}
                className="border-white text-white hover:bg-white hover:text-black"
              >
                Customize on Products
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}