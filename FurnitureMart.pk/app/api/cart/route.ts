import { client } from "@/sanity/lib/client";
import { Products } from "@/typing";
import { NextResponse } from "next/server";

// Function to validate the cart using Sanity
const validateCart = async (cart: Products[]): Promise<Products[]> => {
  try {
    // Extract product IDs from the cart
    const productIds = cart.map((item) => item._id);

    // Fetch product details from Sanity
    const products = await client.fetch(
      `*[_type == "product" && _id in $productIds]{
        _id,
        price
      }`,
      { productIds }
    );

    // Validate the cart
    const validatedCart = cart
      .map((item) => {
        const product = products.find((p: { _id: string }) => p._id === item._id);
        if (product) {
          return {
            ...item,
            price: product.price, // Overwrite price to match the database
          };
        }
        return null; // Remove invalid items
      })
      .filter(Boolean);

    return validatedCart as Products[];
  } catch (error) {
    console.error("Error validating cart:", error);
    return cart; // Return the original cart if validation fails
  }
};

export async function POST(req: Request) {
  try {
    // Extract the cart from the request body
    const { cart }: { cart: Products[] } = await req.json();

    // Validate the cart using Sanity
    const validatedCart = await validateCart(cart);

    // Return the validated cart as a JSON response
    return NextResponse.json(validatedCart);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process the cart" },
      { status: 500 }
    );
  }
}