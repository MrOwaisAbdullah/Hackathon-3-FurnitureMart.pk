"use client";

import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { CartAction, Products } from "@/typing";
import { validateCart } from "@/utils/validateCart";


// Define the CartState type
interface CartState {
  cart: Products[];
}

// Define the CartContextValue type
interface CartContextValue {
  state: CartState; // State includes cart
  dispatch: React.Dispatch<CartAction>;
  totalItems: number;
  totalPrice: number;
  validateCartBeforeCheckout: () => Promise<{
    success: boolean;
    message?: string;
    validatedCart: Products[];
  }>;
}

// Cart reducer function
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "SET_CART":
      return { cart: action.cart };
    case "ADD_TO_CART": {
      const existingProductIndex = state.cart.findIndex(
        (item) => item._id === action.product._id
      );
      if (existingProductIndex !== -1) {
        const updatedCart = [...state.cart];
        const existingItem = updatedCart[existingProductIndex];
        updatedCart[existingProductIndex] = {
          ...existingItem,
          quantity:
            (existingItem.quantity || 1) + (action.product.quantity || 1), // Default to 1 if undefined
        };
        return { ...state, cart: updatedCart };
      }
      return {
        ...state,
        cart: [
          ...state.cart,
          { ...action.product, quantity: action.product.quantity || 1 },
        ], // Default to 1 if undefined
      };
    }
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item._id !== action.id),
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item._id === action.id
            ? { ...item, quantity: Math.max(0, action.quantity || 1) } // Default to 1 if undefined
            : item
        ),
      };
    case "CLEAR_CART":
      return { cart: [] };
    default:
      return state;
  }
};

// Create the CartContext
const CartContext = createContext<CartContextValue | undefined>(undefined);

// CartProvider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(
    cartReducer,
    { cart: [] },
    (initialState) => {
      if (typeof window !== "undefined") {
        try {
          const storedCart = localStorage.getItem("cart");
          return storedCart ? { cart: JSON.parse(storedCart) } : initialState;
        } catch (error) {
          console.error("Error loading cart from localStorage:", error);
          return initialState;
        }
      }
      return initialState;
    }
  );

  // Calculate totals
  const totalItems = state.cart.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );
  const totalPrice = state.cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const validateCartBeforeCheckout = async (): Promise<{
    success: boolean;
    message?: string;
    validatedCart: Products[];
  }> => {
    try {
      
      if (!state.cart || state.cart.length === 0) {
        return {
          success: false,
          message: "Your cart is empty",
          validatedCart: []
        };
      }
  
      const validatedCart = await validateCart(state.cart);
  
      if (!validatedCart || validatedCart.length === 0) {
        return {
          success: false,
          message: "No valid items found in cart",
          validatedCart: []
        };
      }
  
      if (validatedCart.length < state.cart.length) {
        return {
          success: false,
          message: "Some items in your cart are no longer available",
          validatedCart: validatedCart
        };
      }
  
      return {
        success: true,
        validatedCart: validatedCart
      };
    } catch (error) {
      console.error("Error validating cart:", error);
      return {
        success: false,
        message: "Failed to validate cart. Please try again.",
        validatedCart: []
      };
    }
  };

  // Sync cart with localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(state.cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [state.cart]);

  // Context value
  const contextValue: CartContextValue = {
    state, // state includes cart
    dispatch,
    totalItems,
    totalPrice,
    validateCartBeforeCheckout,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

// useCart hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
