import { ProductGrid } from "@/components/ProductGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArtworkWithStudent } from "@/types/database";

const Index = () => {
  const { data: featuredArtwork } = useQuery({
    queryKey: ['featured-artwork'],
    queryFn: async () => {
      const { data: artworkData, error: artworkError } = await supabase
        .from('artwork')
        .select(`
          *,
          student:students(name)
        `)
        .limit(3);
      
      if (artworkError) throw artworkError;
      return artworkData as ArtworkWithStudent[];
    },
  });

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">Student Artwork Shop</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Support young artists by purchasing their artwork on custom products
          </p>
        </header>

        {featuredArtwork && featuredArtwork.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-serif font-bold mb-6">Featured Artwork</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredArtwork.map((artwork) => (
                <div key={artwork.id} className="relative group overflow-hidden rounded-lg">
                  <img
                    src={artwork.image_url}
                    alt={artwork.title}
                    className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                    <h3 className="font-medium">{artwork.title}</h3>
                    <p className="text-sm">by {artwork.student.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-serif font-bold mb-6">Our Products</h2>
          <ProductGrid />
        </section>
      </main>
    </div>
  );
};

export default Index;