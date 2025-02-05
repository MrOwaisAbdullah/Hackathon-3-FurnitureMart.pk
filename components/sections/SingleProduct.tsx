"use client";
import { useCart } from "@/app/context/CartContext";
import { PiShoppingCart } from "react-icons/pi";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Products } from "@/typing";
import { useNotifications } from "@/app/context/NotificationContext"; // Import the notifications context
import SocialSharing from "../ui/SocialSharing";
import { WishlistButton } from "../ui/WishListButton";

const SingleProduct = ({ product }: { product: Products }) => {
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const productUrl = `${window.location.origin}/products/${product.slug?.current}`;

  // Use the notifications context
  const { addNotification } = useNotifications();

  // Quantity change handler
  const handleQuantityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setQuantity(value < 1 ? 1 : value);
  }, []);

  // Add to cart handler
  const handleAddToCart = useCallback(() => {
    setIsLoading(true);
    try {
      dispatch({
        type: "ADD_TO_CART",
        product: {
          _id: product._id,
          title: product.title,
          price: product.price,
          image: product.image ? urlFor(product.image).url() : null,
          quantity: quantity,
          slug: { current: product?.slug?.current || "" },
          seller: product.seller,
        },
      });
      // Trigger a success notification
      addNotification("Added to cart successfully!", "success");
      setQuantity(1); // Reset quantity after adding
    } catch (error) {
      // Trigger an error notification
      addNotification("Failed to add to cart. Please try again.", "error");
      console.error(error);
    } finally {
      setIsLoading(false); // End loading state
    }
  }, [dispatch, product, quantity, addNotification]);

  return (
    <div className="flex flex-col md:flex-row gap-8 justify-center px-4 md:px-6 lg:px-16 py-8">
      {/* Product Image */}
      <div className="w-full md:w-1/2 relative aspect-square md:aspect-[4/3] rounded-xl overflow-hidden">
        {product.image ? (
          <Image
            className="object-cover w-full h-full"
            src={urlFor(product.image).url()}
            alt={product.title}
            priority
            fill // Automatically fills the parent container
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500 text-center">No Image Available</p>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
        <h1 className="text-3xl lg:text-5xl font-bold">{product.title}</h1>
        <p className="bg-primary py-1 px-4 font-medium my-6 text-lg text-white rounded-full inline-block">
          ${product.price} USD
        </p>
        <p className="text-lg py-4 border-t text-[#7d7b8e]">
          {product.description}
        </p>
        <div className="flex items-center gap-4 mb-4">
          <label htmlFor="quantity" className="text-sm font-medium">
            Quantity:
          </label>
          <input
            type="number"
            id="quantity"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="border rounded px-3 py-1 w-20 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <WishlistButton product={product} />
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className={`flex gap-2 items-center bg-primary text-white px-6 rounded py-3 
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
        >
          <PiShoppingCart className="text-2xl" />
          {isLoading ? "Adding..." : "Add to Cart"}
        </button>

        {/* Social Sharing Component */}
        <div className="mt-8 w-full">
          <h3 className="text-lg font-semibold mb-4">Share this product:</h3>
          <SocialSharing productUrl={productUrl} productTitle={product.title} />
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;