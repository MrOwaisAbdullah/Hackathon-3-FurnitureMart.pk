import { SanityImageSource } from "@sanity/image-url/lib/types/types";


interface Products {
  _id: string;
  title: string;
  price: number;
  priceWithoutDiscount?: number;
  image: SanityImageSource | null;
  description?: string;
  slug?: {
    current: string;
  }
  quantity?: number; 
  seller?: { _id: string };
  weight?: number;
}

interface ProductCards {
  _id: string;
  title: string;
  price: number;
  priceWithoutDiscount?: number;
  image: SanityImageSource | null;
  isDiscounted: boolean;
  isNew: boolean;
  slug: {
    current: string | null;
  };
  quantity?: number;
  category: { _id: string; title: string };
  tags?: string[];
  seller: { _id: string }; 
  inventory: number;
}

interface ProductsSectionProps {
  limit?: number;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  priceWithoutDiscount?: number;
  quantity?: number;
  image: SanityImageSource | null;
  description?: string; 
  slug?: {
    current: string ;
  };
  weight?: number;
  seller?: { _id: string };
}

interface CartState {
  cart: Products[];
}

type CartAction =
  | { type: "SET_CART"; cart: Products[] }
  | { type: "ADD_TO_CART"; product: Product }
  | { type: "REMOVE_FROM_CART"; id: string }
  | { type: "UPDATE_QUANTITY"; id: string; quantity: number }
  | { type: "CLEAR_CART" };

  type ShippingDetails = {
    name: string;
    email: string;
    mobile: string;
    address: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  
  interface Payments {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
}

interface PaymentResult {
  success: boolean;
  transactionId: string;
}

interface Order {
  id: string;
  cart: Products[];
  shipping: ShippingDetails;
  tracking?: string;
  payment: Payments;
}

interface Seller {
  _id: string;
  shopName: string;
  clerkId?: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  address?: string;
  businessType?: "showroom" | "workshop" | "both";
  isApproved?: boolean;
  logoUrl?: string;
}

export interface WishlistAction {
  type: 'ADD_TO_WISHLIST' | 'REMOVE_FROM_WISHLIST' | 'CLEAR_WISHLIST' | 'SET_WISHLIST';
  product?: Products;  
  id?: string;        
}

export interface WishlistItem {
  _id: string;
  title: string;
  price: number;
  image: string;
  slug: { current: string };
}


export interface ShippoRate {
  objectId: string;
  provider: string;
  amount: number;
  currency: string;
  servicelevel: {
    token: string;
    name: string;
  };
  estimatedDays: number;
  arrivesBy: string;
}

export interface ShippoRateDisplay {
  objectId: string;
  provider: string;
  servicelevel: {
    name: string;
  };
  amount: string;
  currency: string;
  transit_days: number;
  estimated_days: number;
}