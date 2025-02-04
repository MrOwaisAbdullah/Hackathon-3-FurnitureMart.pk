import { Product, Payments, ShippingDetails } from "@/typing";

export const createOrder = async (orderDetails: {
  cart: Product[];
  shipping: ShippingDetails;
  tracking?: string;
  payment: Payments;
}): Promise<{ id: string }> => {
  return new Promise((resolve) => {
      resolve({
        id: `order${Math.random().toString(36).substr(2, 9)}`, // Generate a unique order ID
        ...orderDetails,
      });

  });
};