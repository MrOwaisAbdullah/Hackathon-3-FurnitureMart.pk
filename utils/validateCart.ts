import { client } from "@/sanity/lib/client";
import { Products } from "@/typing";

export const validateCart = async (cart: Products[]): Promise<Products[]> => {
  try {
    // Add logging to debug
    console.log("Starting cart validation with cart:", cart);

    if (!cart || cart.length === 0) {
      console.log("Cart is empty");
      return [];
    }

    // Extract product IDs from the cart
    const productIds = cart.map((item) => item._id);

    // Fetch product details from Sanity
    const query = `*[_type == "products" && _id in $productIds]{
      _id,
      price,
      name,
      quantity
    }`;
    
    const products = await client.fetch(query, { productIds });

    // Validate the cart
    const validatedCart = cart
      .map((item) => {
        const product = products.find((p: { _id: string }) => p._id === item._id);
        if (product) {
          return {
            ...item,
            price: product.price, // Use the price from Sanity
          };
        }
        console.warn(`Product with ID ${item._id} not found in Sanity.`);
        return null;
      })
      .filter((item): item is Products => item !== null);

    console.log("Validated cart:", validatedCart);

    return validatedCart;
  } catch (error) {
    console.error("Error in validateCart:", error);
    throw error; // Throw the error instead of returning the original cart
  }
};