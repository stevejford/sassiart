import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 
          onClick={() => navigate("/")} 
          className="text-2xl font-serif font-bold cursor-pointer"
        >
          Student Art Shop
        </h1>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/cart")}
        >
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
};