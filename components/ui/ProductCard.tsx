"use client";
import React from "react";
import { inter } from "../../app/fonts";
import { PiShoppingCart } from "react-icons/pi";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { ProductCards } from "@/typing";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import { useNotifications } from "@/app/context/NotificationContext";

const ProductCard = ({ product }: { product: ProductCards }) => {
  const { dispatch } = useCart();
  const { addNotification } = useNotifications();

  const handleAddToCart = () => {
    try {
      dispatch({
        type: "ADD_TO_CART",
        product: {
          _id: product._id,
          title: product.title,
          price: product.price,
          image: product.image ? urlFor(product.image).url() : null,
          quantity: 1, // Default quantity is 1
          slug: { current: product.slug.current || "" },
        },
      });
      addNotification("Added to cart successfully!", "success");
    } catch (error) {
      addNotification("Failed to add to cart. Please try again.", "error");
      console.error(error);
    }
  };

  return (
    <div
      className={`${inter.className} w-full sm:max-w-[250px] flex flex-col cursor-pointer group mt-5 justify-center`}
    >
      {/* Card Image Container */}
      <div className="relative bg-gray-200 rounded overflow-hidden aspect-square">
        <Link href={`/product/${product?.slug.current}`}>
          {product.image ? (
            <Image
              className="object-cover w-full h-full scale-110 sm:scale-100 hover:scale-110 duration-200"
              src={urlFor(product.image).url()}
              alt={product?.title || "Product image"}
              fill // Automatically fills the parent container
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500 text-center">No Image Available</p>
            </div>
          )}
        </Link>

        {/* Discount and New Tags */}
        {product?.isDiscounted && (
          <div className="bg-highlight absolute top-3 left-3 z-10 px-2 py-1 rounded text-white text-xs">
            SALE!
          </div>
        )}
        {product?.isNew && (
          <div
            className={`${
              product?.isDiscounted
                ? "bg-highlight2 absolute top-10 left-3 z-10"
                : "bg-highlight2 absolute top-3 left-3 z-10"
            } px-2 py-1 rounded text-white text-xs`}
          >
            NEW
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex flex-col">
          <Link href={`/product/${product.slug.current}`}>
            <h2 className="group-hover:text-primary mb-1">{product?.title}</h2>
          </Link>
          <div className="flex gap-1 items-center -mt-1">
            <p className="text-lg font-semibold">{`$${product?.price}`}</p>
            {product?.priceWithoutDiscount && (
              <p className="text-sm text-[#9A9CAA] line-through">
                {`$${product?.priceWithoutDiscount}`}
              </p>
            )}
          </div>
        </div>
        <div className="flex bg-secondary p-2 rounded-[8px] hover:bg-primary cursor-pointer hover:text-white">
          <button onClick={handleAddToCart}>
            <PiShoppingCart className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;