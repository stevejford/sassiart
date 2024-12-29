import React, { createContext, useContext, useState } from 'react';
import { Product, ArtworkWithStudent } from '@/types/database';
import { toast } from "sonner";

interface CartItem {
  product: Product;
  artwork: ArtworkWithStudent;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, artwork: ArtworkWithStudent) => void;
  removeItem: (productId: string, artworkId: string) => void;
  updateQuantity: (productId: string, artworkId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  console.log('CartProvider: Initializing');
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (product: Product, artwork: ArtworkWithStudent) => {
    console.log('CartContext: Attempting to add item to cart:', { 
      product: product.name, 
      artwork: artwork.title 
    });
    
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        item => item.product.id === product.id && item.artwork.id === artwork.id
      );

      if (existingItem) {
        console.log('CartContext: Item already exists in cart - showing error toast');
        toast.error("This item is already in your cart");
        return currentItems;
      }

      console.log('CartContext: Adding new item to cart - showing success toast');
      toast.success("Added to cart");
      return [...currentItems, { product, artwork, quantity: 1 }];
    });
  };

  const removeItem = (productId: string, artworkId: string) => {
    console.log('CartContext: Removing item from cart:', { productId, artworkId });
    setItems(items.filter(
      item => !(item.product.id === productId && item.artwork.id === artworkId)
    ));
  };

  const updateQuantity = (productId: string, artworkId: string, quantity: number) => {
    console.log('CartContext: Updating item quantity:', { productId, artworkId, quantity });
    setItems(items.map(item =>
      item.product.id === productId && item.artwork.id === artworkId
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    console.log('CartContext: Clearing cart');
    setItems([]);
  };

  const total = items.reduce(
    (sum, item) => sum + (item.product.base_price * item.quantity),
    0
  );

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total
  };

  console.log('CartProvider: Rendering with', items.length, 'items');
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    console.error('useCart: Must be used within a CartProvider');
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}