"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { createBrowserSupabaseClient, isSupabaseBrowserConfigured } from "@/lib/supabaseClient";
import type { CartLine, Product } from "@/lib/types";

const CART_STORAGE_KEY = "partforge-3d-cart";

type CartContextValue = {
  items: CartLine[];
  isOpen: boolean;
  count: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

type RemoteCartRow = {
  quantity: number;
  products: Product | Product[] | null;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved) as CartLine[]);
      } catch {
        window.localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!isSupabaseBrowserConfigured) return;

    const supabase = createBrowserSupabaseClient();

    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      if (data.user?.id) {
        void loadRemoteCart(data.user.id);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
      if (session?.user.id) {
        void loadRemoteCart(session.user.id);
      }
    });

    async function loadRemoteCart(profileId: string) {
      const { data } = await supabase
        .from("cart_items")
        .select("quantity, products(*)")
        .eq("user_id", profileId);

      const remoteItems = ((data ?? []) as unknown as RemoteCartRow[]).flatMap((row) => {
        const product = Array.isArray(row.products) ? row.products[0] : row.products;
        return product ? [{ product, quantity: row.quantity }] : [];
      });

      if (remoteItems.length) {
        setItems(remoteItems);
      }
    }

    return () => listener.subscription.unsubscribe();
  }, []);

  const syncLine = useCallback(
    async (productId: string, quantity: number) => {
      if (!userId || !isSupabaseBrowserConfigured) return;
      const supabase = createBrowserSupabaseClient();

      if (quantity <= 0) {
        await supabase.from("cart_items").delete().eq("user_id", userId).eq("product_id", productId);
        return;
      }

      await supabase
        .from("cart_items")
        .upsert({ user_id: userId, product_id: productId, quantity }, { onConflict: "user_id,product_id" });
    },
    [userId]
  );

  const addItem = useCallback(
    (product: Product, quantity = 1) => {
      setItems((current) => {
        const existing = current.find((line) => line.product.id === product.id);
        const next = existing
          ? current.map((line) => (line.product.id === product.id ? { ...line, quantity: line.quantity + quantity } : line))
          : [...current, { product, quantity }];
        const nextQuantity = next.find((line) => line.product.id === product.id)?.quantity ?? quantity;
        void syncLine(product.id, nextQuantity);
        return next;
      });
      toast.success(`${product.name} added to cart`);
      setIsOpen(true);
    },
    [syncLine]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      setItems((current) => {
        const next = quantity <= 0 ? current.filter((line) => line.product.id !== productId) : current.map((line) => (line.product.id === productId ? { ...line, quantity } : line));
        void syncLine(productId, quantity);
        return next;
      });
    },
    [syncLine]
  );

  const removeItem = useCallback(
    (productId: string) => {
      setItems((current) => current.filter((line) => line.product.id !== productId));
      void syncLine(productId, 0);
    },
    [syncLine]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    window.localStorage.removeItem(CART_STORAGE_KEY);

    if (userId && isSupabaseBrowserConfigured) {
      const supabase = createBrowserSupabaseClient();
      void supabase.from("cart_items").delete().eq("user_id", userId);
    }
  }, [userId]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = items.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

    return {
      items,
      isOpen,
      count,
      subtotal,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      updateQuantity,
      removeItem,
      clearCart
    };
  }, [addItem, clearCart, isOpen, items, removeItem, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
