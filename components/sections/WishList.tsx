"use client";

import { useWishlist } from "@/app/context/WishlistContext";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { ShoppingCart, Trash2, Package } from "lucide-react";
import { Products } from "@/typing";

export default function WishlistPage() {
  const router = useRouter();
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();
  const { dispatch: cartDispatch } = useCart();

  const moveToCart = (product: Products) => {
    cartDispatch({
      type: "ADD_TO_CART",
      product: { ...product, quantity: 1 },
    });
    wishlistDispatch({ type: "REMOVE_FROM_WISHLIST", id: product._id });
  };

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
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-gray-800">Home</Link></li>
            <li>/</li>
            <li className="font-medium text-gray-800">Wishlist</li>
          </ol>
        </nav>

        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-medium text-gray-900">Wishlist</h1>
              <p className="text-sm text-gray-500 mt-1">
                {wishlistState.wishlist.length} {wishlistState.wishlist.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
            {wishlistState.wishlist.length > 0 && (
              <button
                onClick={moveAllToCartAndRedirect}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded bg-primary text-white hover:bg-accent transition-colors duration-200"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add All to Cart
              </button>
            )}
          </div>

          {/* Empty State */}
          {wishlistState.wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-xl font-medium text-gray-900">Your wishlist is empty</h2>
                <p className="text-sm text-gray-500">
                  Browse our collection and save your favorite pieces for later
                </p>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded bg-primary text-white hover:bg-accent transition-colors duration-200"
              >
                Explore Furniture
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {wishlistState.wishlist.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-md border border-gray-100 hover:border-gray-200 transition-all duration-200"
                >
                  <div className="flex items-center gap-4 p-4">
                    <Link
                      href={`/product/${product.slug.current}`}
                      className="relative w-[100px] h-[100px] bg-[#F5F5F5] rounded-md overflow-hidden flex-shrink-0"
                    >
                      <Image
                        src={urlFor(product.image).url()}
                        alt={product.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${product.slug.current}`}
                        className="block group"
                      >
                        <h3 className="text-base font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
                          {product.title}
                        </h3>
                        <p className="mt-1 text-lg font-medium text-gray-900">
                          ${product.price.toFixed(2)}
                        </p>
                      </Link>
                      
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => moveToCart(product)}
                          className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded bg-primary text-white hover:bg-accent transition-colors duration-200"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() =>
                            wishlistDispatch({
                              type: "REMOVE_FROM_WISHLIST",
                              id: product._id,
                            })
                          }
                          className="inline-flex items-center justify-center rounded px-6 py-2.5 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}