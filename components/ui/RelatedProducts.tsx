import { urlFor } from "@/sanity/lib/image";
import { ProductCards } from "@/typing";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const RelatedProducts = ({ product }: { product: ProductCards }) => {
  return (
    <div className="relative flex flex-col cursor-pointer group w-full max-w-[250px]">
      {/* Card Image Container */}
      <div className="relative bg-gray-200 rounded overflow-hidden aspect-square">
        <Link href={`/product/${product.slug.current}`}>
          {product.image ? (
            <Image
              className="object-cover w-full h-full scale-110 sm:scale-100 hover:scale-110 duration-200"
              src={urlFor(product.image).url()}
              alt={product.title || "Product image"}
              fill // Automatically fills the parent container
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500 text-center">No Image Available</p>
            </div>
          )}
        </Link>
      </div>

      {/* Product Details */}
      <div className="flex mt-3 justify-between items-center">
        <Link href={`/product/${product.slug.current}`}>
          <h2 className="text-sm font-medium">{product.title}</h2>
        </Link>
        <p className="text-sm font-bold">${product.price}</p>
      </div>
    </div>
  );
};

export default RelatedProducts;