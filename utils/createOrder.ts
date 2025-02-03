import { Product, Payments, ShippingDetails } from "@/typing";

export const createOrder = async (orderDetails: {
  cart: Product[];
  shipping: ShippingDetails;
  tracking?: string;
  payment: Payments;
}): Promise<{ id: string }> => {
  // Simulate API call to create an order
  return new Promise((resolve) => {
      resolve({
        id: `order_${Date.now()}`, // Generate a unique order ID
        ...orderDetails,
      });

  });
};