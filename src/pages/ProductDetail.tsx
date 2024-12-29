import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product, ArtworkWithStudent } from "@/types/database";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ArtworkSelector } from "@/components/product/ArtworkSelector";
import { ProductPreview } from "@/components/product/ProductPreview";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const artworkId = searchParams.get('artworkId');
  const source = searchParams.get('source') || 'direct';
  const { addItem } = useCart();
  const [selectedArtwork, setSelectedArtwork] = useState<string | null>(artworkId || null);
  const navigate = useNavigate();

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
      toast.error("Please select artwork to customize this product");
      return;
    }
    
    const artworkItem = artwork?.find(a => a.id === selectedArtwork);
    if (!artworkItem) {
      toast.error("Selected artwork not found");
      return;
    }

    addItem(product, artworkItem);
    
    // Show navigation options after adding to cart
    toast(
      <div className="flex flex-col gap-2">
        <h3 className="font-medium mb-1">Item added to cart</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>
            Keep Shopping
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate("/cart")}>
            View Cart
          </Button>
          <Button variant="default" size="sm" className="bg-black text-white hover:bg-gray-800" onClick={() => navigate("/checkout")}>
            Checkout
          </Button>
        </div>
      </div>,
      {
        duration: 5000
      }
    );
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