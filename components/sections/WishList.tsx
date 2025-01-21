"use client";

import { useWishlist } from "@/app/context/WishlistContext";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import { Products } from "@/typing";

export default function WishlistPage() {
  const router = useRouter();
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();
  const { dispatch: cartDispatch } = useCart();

  // Move a single product to the cart
  const moveToCart = (product: Products) => {
    cartDispatch({
      type: "ADD_TO_CART",
      product: { ...product, quantity: 1 },
    });
    wishlistDispatch({ type: "REMOVE_FROM_WISHLIST", id: product._id });
  };

  // Move all products to the cart and redirect
  const moveAllToCartAndRedirect = () => {
    wishlistState.wishlist.forEach((product) => {
      cartDispatch({
        type: "ADD_TO_CART",
        product: { ...product, quantity: 1 },
      });
    });
    wishlistDispatch({ type: "CLEAR_WISHLIST" });
    router.push("/cart");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">My Wishlist</h1>
        {wishlistState.wishlist.length > 0 && (
          <button
            onClick={moveAllToCartAndRedirect}
            className="bg-primary text-white px-6 py-2 rounded-[5px] hover:bg-accent transition-colors flex items-center gap-2"
          >
            <FaShoppingCart />
            Move All to Cart
          </button>
        )}
      </div>

      {wishlistState.wishlist.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 text-xl">Your wishlist is empty</p>
          <Link
            href="/"
            className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-[5px] hover:bg-accent transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {wishlistState.wishlist.map((product) => (
            <div
              key={product._id}
              className="flex items-center justify-between border-b-2 py-3 gap-5 w-full rounded-[5px]"
            >
              <Link
                href={`/product/${product.slug.current}`}
                className="flex items-center gap-4 flex-1"
              >
                <div className="relative w-24 h-24">
                  <Image
                    src={urlFor(product.image).url()}
                    alt={product.title}
                    fill
                    className="object-cover rounded-[5px]"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.title}
                  </h3>
                  <p className="text-gray-600">${product.price.toFixed(2)}</p>
                </div>
              </Link>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => moveToCart(product)}
                  className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
                  aria-label="Move to Cart"
                >
                  <FaShoppingCart className="w-6 h-6" />
                </button>
                <button
                  onClick={() =>
                    wishlistDispatch({
                      type: "REMOVE_FROM_WISHLIST",
                      id: product._id,
                    })
                  }
                  className="p-2 text-red-600 hover:text-red-700 transition-colors"
                  aria-label="Remove from Wishlist"
                >
                  <FaTrash className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}