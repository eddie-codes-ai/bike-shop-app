"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  ReactNode,
} from "react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface CartItem {
  variantId: string;
  bikeId: string;
  bikeName: string;
  image: string | null;
  size: string;
  color: string;
  unitPrice: number; // basePrice + priceAdjustment, snapshotted at add-to-cart time
  quantity: number;
  stockQuantity: number; // ceiling for the quantity stepper, re-validated server-side at checkout
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; variantId: string }
  | { type: "SET_QUANTITY"; variantId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; items: CartItem[] };

const STORAGE_KEY = "ridgeback-cart";

// ─────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE": {
      return { items: action.items };
    }

    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.variantId === action.item.variantId
      );

      if (existing) {
        // Same variant already in cart — bump quantity instead of duplicating the row,
        // capped at available stock.
        const nextQuantity = Math.min(
          existing.quantity + action.item.quantity,
          existing.stockQuantity
        );
        return {
          items: state.items.map((i) =>
            i.variantId === action.item.variantId
              ? { ...i, quantity: nextQuantity }
              : i
          ),
        };
      }

      return { items: [...state.items, action.item] };
    }

    case "REMOVE_ITEM": {
      return {
        items: state.items.filter((i) => i.variantId !== action.variantId),
      };
    }

    case "SET_QUANTITY": {
      const clampedQuantity = Math.max(1, action.quantity);
      return {
        items: state.items.map((i) =>
          i.variantId === action.variantId
            ? {
                ...i,
                quantity: Math.min(clampedQuantity, i.stockQuantity),
              }
            : i
        ),
      };
    }

    case "CLEAR_CART": {
      return { items: [] };
    }

    default:
      return state;
  }
}

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  itemCount: number; // total units, for the header badge
  subtotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  isHydrated: boolean; // true once localStorage has been read — avoids SSR/client mismatch flashes
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage once, on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const items: CartItem[] = JSON.parse(raw);
        dispatch({ type: "HYDRATE", items });
      }
    } catch {
      // Corrupt or missing localStorage data — start with an empty cart rather than crashing.
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist on every change, but only after the initial hydration read has happened —
  // otherwise the empty initial state would overwrite a real saved cart before it loads.
  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // Storage full or unavailable (private browsing) — cart still works in-memory for this session.
    }
  }, [state.items, isHydrated]);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, i) => sum + i.unitPrice * i.quantity,
    0
  );

  const value: CartContextValue = {
    items: state.items,
    itemCount,
    subtotal,
    addItem: (item) => dispatch({ type: "ADD_ITEM", item }),
    removeItem: (variantId) => dispatch({ type: "REMOVE_ITEM", variantId }),
    setQuantity: (variantId, quantity) =>
      dispatch({ type: "SET_QUANTITY", variantId, quantity }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
    isHydrated,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}