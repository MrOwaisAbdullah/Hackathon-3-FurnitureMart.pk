import { Product } from "@/typing";

// Helper function to group cart items by seller
export const groupCartItemsBySeller = (cartItems: Product[]): { [sellerId: string]: Product[] } => {
  const groupedItems: { [sellerId: string]: Product[] } = {};

  cartItems.forEach((item) => {
    const sellerId = item.seller?._id; // Use the seller ID from the product
    if (!sellerId) {
      console.error("Product has no seller:", item);
      return; // Skip products without a seller
    }

    if (!groupedItems[sellerId]) {
      groupedItems[sellerId] = [];
    }
    groupedItems[sellerId].push(item);
  });

  return groupedItems;
};