"use client";

import { useWishlist } from "@/app/context/WishlistContext";
import { urlFor } from "@/sanity/lib/image";
import { Products } from "@/typing";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface WishlistButtonProps {
  product: Products;
}

export const WishlistButton = ({ product }: WishlistButtonProps) => {
  const { state, dispatch } = useWishlist();

  const isInWishlist = state.wishlist.some((item) => item._id === product._id);

  const toggleWishlist = () => {
    if (isInWishlist) {
      dispatch({ type: "REMOVE_FROM_WISHLIST", id: product._id });
    } else {
      // Only add necessary fields to the wishlist
      dispatch({
        type: "ADD_TO_WISHLIST",
        product: {
          _id: product._id,
          title: product.title,
          price: product.price,
          image: product.image ? urlFor(product.image).url() : "",
          slug: product.slug || { current: "" },
        },
      });
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isInWishlist ? (
        <FaHeart className="w-5 h-5 fill-red-500 stroke-red-500" />
      ) : (
        <FaRegHeart className="w-5 h-5" />
      )}
    </button>
  );
};
