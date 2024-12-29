import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Product, ArtworkWithStudent } from "@/types/database";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [selectedArtwork, setSelectedArtwork] = useState<string | null>(null);

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Product;
    },
  });

  const { data: artworks, isLoading: artworksLoading } = useQuery({
    queryKey: ['artworks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artwork')
        .select(`
          *,
          student:students(name)
        `);
      
      if (error) throw error;
      return data as ArtworkWithStudent[];
    },
  });

  const handleAddToCart = () => {
    if (!selectedArtwork) {
      toast({
        title: "Please select artwork",
        description: "You need to select artwork to customize this product",
        variant: "destructive",
      });
      return;
    }
    
    // TODO: Implement cart functionality
    toast({
      title: "Added to cart",
      description: "Your customized product has been added to the cart",
    });
  };

  if (productLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <p className="text-center text-lg text-muted-foreground">
            Product not found
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="aspect-square overflow-hidden rounded-lg border">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {selectedArtwork && (
              <div className="aspect-square overflow-hidden rounded-lg border">
                <img
                  src={artworks?.find(a => a.id === selectedArtwork)?.image_url}
                  alt="Selected artwork"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">{product.name}</h1>
              <p className="text-lg text-muted-foreground">${product.base_price.toFixed(2)}</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-4">Select Artwork</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {artworksLoading ? (
                  Array(6).fill(0).map((_, i) => (
                    <Skeleton key={i} className="aspect-square" />
                  ))
                ) : (
                  artworks?.map((artwork) => (
                    <div
                      key={artwork.id}
                      className={`aspect-square rounded-lg border overflow-hidden cursor-pointer transition-all ${
                        selectedArtwork === artwork.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedArtwork(artwork.id)}
                    >
                      <img
                        src={artwork.image_url}
                        alt={artwork.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>

            {product.description && (
              <div>
                <h2 className="text-xl font-serif font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;