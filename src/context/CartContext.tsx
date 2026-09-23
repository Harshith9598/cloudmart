import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Cart, CartItemDto } from '@/types';
import { mockProducts, productToCartItem, buildCart } from '@/services/mock-data';

interface CartContextValue {
  cart: Cart;
  addToCart: (productId: string, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'cloudmart_cart';

const emptyCart: Cart = {
  id: 'cart-mock',
  userId: 'mock-user',
  items: [],
  subtotal: 0,
  totalItems: 0,
  updatedAt: new Date().toISOString(),
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemDto[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  const persist = useCallback((newItems: CartItemDto[]) => {
    setItems(newItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  }, []);

  const addToCart = useCallback((productId: string, quantity = 1) => {
    const product = mockProducts.find((p) => p.id === productId);
    if (!product) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      let newItems: CartItemDto[];
      if (existing) {
        newItems = prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: Math.min(i.quantity + quantity, i.stock) }
            : i,
        );
      } else {
        newItems = [...prev, productToCartItem(product, Math.min(quantity, product.stock))];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => {
        const newItems = prev.filter((i) => i.id !== itemId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
        return newItems;
      });
      return;
    }
    setItems((prev) => {
      const newItems = prev.map((i) =>
        i.id === itemId ? { ...i, quantity: Math.min(quantity, i.stock) } : i,
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => {
      const newItems = prev.filter((i) => i.id !== itemId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const cart = buildCart(items);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems: cart.totalItems,
        subtotal: cart.subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
