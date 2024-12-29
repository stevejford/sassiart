import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";

export const Navbar = () => {
  const navigate = useNavigate();
  const { items } = useCart();

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 
          onClick={() => navigate("/")} 
          className="text-2xl font-serif font-bold cursor-pointer"
        >
          Student Art Shop
        </h1>
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
          {itemCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {itemCount}
            </Badge>
          )}
        </div>
      </div>
    </nav>
  );
};