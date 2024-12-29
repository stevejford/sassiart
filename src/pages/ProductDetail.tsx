import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const SAMPLE_PRODUCTS = {
  1: {
    id: 1,
    image: "/placeholder.svg",
    title: "Abstract Dreams",
    artist: "Emma Thompson",
    price: 24.99,
    description: "A vibrant exploration of color and emotion through abstract forms.",
  },
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [productType, setProductType] = useState("keychain");

  const product = SAMPLE_PRODUCTS[Number(id)];

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: "Your item has been added to the cart",
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">{product.title}</h1>
              <p className="text-lg text-muted-foreground">by {product.artist}</p>
            </div>
            <p className="text-lg">{product.description}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Product Type
                </label>
                <Select
                  value={productType}
                  onValueChange={setProductType}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="keychain">Keychain - $24.99</SelectItem>
                    <SelectItem value="sticker">Sticker - $4.99</SelectItem>
                    <SelectItem value="tote">Tote Bag - $29.99</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                size="lg" 
                className="w-full"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;