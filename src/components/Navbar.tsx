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
        <div className="flex flex-col items-start">
          <h1 
            onClick={() => navigate("/")} 
            className="text-2xl tracking-tighter font-bold cursor-pointer transition-colors hover:text-primary"
            style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.1em" }}
          >
            STUDENT ART SHOP
          </h1>
          <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
            SUPPORTING YOUNG ARTISTS
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="lg"
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2"
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="hidden sm:inline">Cart</span>
          {itemCount > 0 && (
            <Badge 
              variant="destructive" 
              className="ml-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </div>
    </nav>
  );
};