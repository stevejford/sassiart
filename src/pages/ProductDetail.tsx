import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product, ArtworkWithStudent } from "@/types/database";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ArtworkSelector } from "@/components/product/ArtworkSelector";
import { ProductPreview } from "@/components/product/ProductPreview";

const ProductDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const artworkId = searchParams.get('artworkId');
  const source = searchParams.get('source') || 'direct';
  const { toast } = useToast();
  const { addItem } = useCart();
  const [selectedArtwork, setSelectedArtwork] = useState<string | null>(artworkId || null);

  useEffect(() => {
    console.log('ProductDetail: Initialized with:', {
      productId: id,
      artworkId,
      source,
    });
  }, [id, artworkId, source]);

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
    queryKey: ['public-artwork'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artwork')
        .select(`
          *,
          student:students(name)
        `)
        .eq('is_private', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ArtworkWithStudent[];
    },
  });

  const selectedArtworkDetails = artwork?.find(a => a.id === selectedArtwork);

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
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-100 animate-pulse rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 animate-pulse rounded" />
            <div className="h-4 w-1/2 bg-gray-100 animate-pulse rounded" />
            <div className="h-24 bg-gray-100 animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-lg text-muted-foreground">
          Product not found
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <ProductPreview 
            product={product} 
            selectedArtwork={selectedArtworkDetails}
          />
        </div>
        
        <div className="lg:col-span-5 space-y-8">
          <ProductInfo 
            product={product}
            onAddToCart={handleAddToCart}
            isArtworkSelected={!!selectedArtwork}
          />
          
          <div className="pt-8 border-t">
            <ArtworkSelector
              artwork={artwork}
              selectedArtwork={selectedArtwork}
              onArtworkSelect={setSelectedArtwork}
              isLoading={artworksLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;