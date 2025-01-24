"use client";

import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useCart } from "./CartContext";
import { WishlistItem } from "@/typing";

// Define the shape of our wishlist state
interface WishlistState {
  wishlist: WishlistItem[];
}

// Define what values our context will provide
interface WishlistContextValue {
  state: WishlistState;
  dispatch: React.Dispatch<WishlistAction>;
  totalItems: number;
  moveToCart: (product: WishlistItem) => void; // Function to move items to cart
}

// Define the action types for the wishlist
type WishlistAction =
  | { type: "SET_WISHLIST"; product?: WishlistItem }
  | { type: "ADD_TO_WISHLIST"; product: WishlistItem }
  | { type: "REMOVE_FROM_WISHLIST"; id: string }
  | { type: "CLEAR_WISHLIST" };

// Create our reducer to handle wishlist state changes
const wishlistReducer = (
  state: WishlistState,
  action: WishlistAction
): WishlistState => {
  switch (action.type) {
    case "SET_WISHLIST":
      // Replace entire wishlist (useful for initialization)
      return { wishlist: action.product ? [action.product] : [] };

    case "ADD_TO_WISHLIST": {
      // Don't add if product already exists in wishlist
      if (
        action.product &&
        !state.wishlist.some((item) => item._id === action.product._id)
      ) {
        return {
          ...state,
          wishlist: [...state.wishlist, action.product],
        };
      }
      return state;
    }

    case "REMOVE_FROM_WISHLIST":
      // Remove specific product from wishlist
      return {
        ...state,
        wishlist: state.wishlist.filter((item) => item._id !== action.id),
      };

    case "CLEAR_WISHLIST":
      // Empty the wishlist
      return { wishlist: [] };

    default:
      return state;
  }
};

// Create the context
const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined
);

// Create the provider component
export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  // Initialize reducer with localStorage data if available
  const [state, dispatch] = useReducer(
    wishlistReducer,
    { wishlist: [] },
    (initialState) => {
      if (typeof window !== "undefined") {
        try {
          const storedWishlist = localStorage.getItem("wishlist");
          return storedWishlist
            ? { wishlist: JSON.parse(storedWishlist) }
            : initialState;
        } catch (error) {
          console.error("Error loading wishlist from localStorage:", error);
          return initialState;
        }
      }
      return initialState;
    }
  );

  // Calculate total items in wishlist
  const totalItems = state.wishlist.length;

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
    } catch (error) {
      console.error("Error saving wishlist to localStorage:", error);
    }
  }, [state.wishlist]);

  const { dispatch: cartDispatch } = useCart(); // Get cart dispatch

  // Function to move item from wishlist to cart
  const moveToCart = (product: WishlistItem) => {
    cartDispatch({
      type: "ADD_TO_CART",
      product: { ...product, quantity: 1 },
    });
    dispatch({ type: "REMOVE_FROM_WISHLIST", id: product._id });
  };

  const contextValue: WishlistContextValue = {
    state,
    dispatch,
    totalItems,
    moveToCart,
  };

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use the wishlist
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};