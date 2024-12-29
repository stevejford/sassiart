import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Product, ArtworkWithStudent } from "@/types/database";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const artworkId = searchParams.get('artworkId');
  const { toast } = useToast();
  const { addItem } = useCart();
  const [selectedArtwork, setSelectedArtwork] = useState<string | null>(artworkId || null);

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

  const { data: artwork, isLoading: artworksLoading } = useQuery({
    queryKey: ['artwork', artworkId],
    queryFn: async () => {
      if (!artworkId) {
        const { data, error } = await supabase
          .from('artwork')
          .select(`
            *,
            student:students(name)
          `);
        
        if (error) throw error;
        return data as ArtworkWithStudent[];
      } else {
        const { data, error } = await supabase
          .from('artwork')
          .select(`
            *,
            student:students(name)
          `)
          .eq('id', artworkId)
          .single();
        
        if (error) throw error;
        return [data] as ArtworkWithStudent[];
      }
    },
  });

  const handleAddToCart = () => {
    if (!selectedArtwork || !product) {
      toast({
        title: "Please select artwork",
        description: "You need to select artwork to customize this product",
        variant: "destructive",
      });
      return;
    }
    
    const artworkItem = artwork?.find(a => a.id === selectedArtwork);
    if (!artworkItem) {
      toast({
        title: "Error",
        description: "Selected artwork not found",
        variant: "destructive",
      });
      return;
    }

    addItem(product, artworkItem);
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
            <div className="aspect-square overflow-hidden rounded-lg border relative">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {selectedArtwork && artwork?.find(a => a.id === selectedArtwork) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={artwork.find(a => a.id === selectedArtwork)?.image_url}
                    alt="Selected artwork"
                    className="w-3/4 h-3/4 object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">{product.name}</h1>
              <p className="text-lg text-muted-foreground">${product.base_price.toFixed(2)}</p>
            </div>

            {artworkId ? (
              <div>
                <h2 className="text-xl font-serif font-semibold mb-4">Selected Artwork</h2>
                {artwork && artwork[0] && (
                  <div className="border rounded-lg p-4">
                    <img
                      src={artwork[0].image_url}
                      alt={artwork[0].title}
                      className="w-full aspect-square object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-medium">{artwork[0].title}</h3>
                    <p className="text-sm text-muted-foreground">by {artwork[0].student.name}</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-serif font-semibold mb-4">Select Artwork</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {artworksLoading ? (
                    Array(6).fill(0).map((_, i) => (
                      <Skeleton key={i} className="aspect-square" />
                    ))
                  ) : (
                    artwork?.map((art) => (
                      <div
                        key={art.id}
                        className={`aspect-square rounded-lg border overflow-hidden cursor-pointer transition-all ${
                          selectedArtwork === art.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedArtwork(art.id)}
                      >
                        <img
                          src={art.image_url}
                          alt={art.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={handleAddToCart}
              disabled={!selectedArtwork}
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
