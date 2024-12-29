import React, { createContext, useContext, useState } from 'react';
import { Product, ArtworkWithStudent } from '@/types/database';

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
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (product: Product, artwork: ArtworkWithStudent) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        item => item.product.id === product.id && item.artwork.id === artwork.id
      );

      if (existingItem) {
        return currentItems.map(item =>
          item.product.id === product.id && item.artwork.id === artwork.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentItems, { product, artwork, quantity: 1 }];
    });
  };

  const removeItem = (productId: string, artworkId: string) => {
    setItems(items.filter(
      item => !(item.product.id === productId && item.artwork.id === artworkId)
    ));
  };

  const updateQuantity = (productId: string, artworkId: string, quantity: number) => {
    setItems(items.map(item =>
      item.product.id === productId && item.artwork.id === artworkId
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce(
    (sum, item) => sum + (item.product.base_price * item.quantity),
    0
  );

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}