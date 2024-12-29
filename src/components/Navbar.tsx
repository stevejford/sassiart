import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { cn } from "../lib/utils";

export function Navbar() {
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-xl font-bold text-primary hover:text-primary/90 transition-colors"
        >
          SassiArt
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link to="/gallery" className="text-sm font-medium hover:text-primary transition-colors">Gallery</Link>
          <Link to="/artists" className="text-sm font-medium hover:text-primary transition-colors">Artists</Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
          <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</Link>
        </nav>

        {/* Cart and Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative hover:text-primary">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn("md:hidden transition-all duration-200", isMenuOpen ? "max-h-screen" : "max-h-0 overflow-hidden")}> 
        <div className="flex justify-between items-center p-4 border-b">
          <Link to="/" className="text-xl font-bold text-primary" onClick={() => setIsMenuOpen(false)}>SassiArt</Link>
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
            <X className="h-6 w-6" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>
        <nav className="flex flex-col p-4 space-y-4">
          <Link to="/gallery" className="text-lg font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Gallery</Link>
          <Link to="/artists" className="text-lg font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Artists</Link>
          <Link to="/about" className="text-lg font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>About</Link>
          <Link to="/contact" className="text-lg font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</Link>
        </nav>
      </div>
    </header>
  );
}