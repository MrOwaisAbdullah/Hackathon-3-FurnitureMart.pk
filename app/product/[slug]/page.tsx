"use client";
import React, { useState, useEffect } from "react";
import { inter } from "@/app/fonts";
import { client } from "@/sanity/lib/client";
import RelatedProducts from "@/components/ui/RelatedProducts";
import { ProductCards, Products } from "@/typing";
import Link from "next/link";
import SingleProduct from "@/components/sections/SingleProduct";
import Loader from "@/components/ui/Loader";

const Page = ({ params: { slug } }: { params: { slug: string } }) => {
  const [product, setProduct] = useState<Products | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductCards[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch the current product
        const productQuery = `*[_type == "products" && slug.current == "${slug}"][0]{
          price,
          image,
          title,
          slug,
          _id,
          description,
          priceWithoutDiscount,
          "isDiscounted": priceWithoutDiscount > 0,
          "isNew": createdAt > now() - 30 * 24 * 60 * 60 * 1000,
          category->{title},
          tags,
          seller->{_id, name}
        }`;
        const productData = await client.fetch(productQuery);
        setProduct(productData);

        // Fetch related products based on category and tags
        if (productData) {
          const relatedProductsQuery = `*[
            _type == "products" && 
            _id != "${productData?._id}" && 
            (
              category->title == "${productData?.category.title}" || 
              count(tags[@ in ["${productData?.tags.join('","')}"]]) > 0
            )
          ]{
            price,
            image,
            title,
            slug,
            tags,
            "isDiscounted": priceWithoutDiscount > 0,
            "isNew": createdAt > now() - 30 * 24 * 60 * 60 * 1000,
          }[0...5]`;
          const relatedProductsData = await client.fetch(relatedProductsQuery);
          setRelatedProducts(relatedProductsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (isLoading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="flex text-center item-center justify-center font-medium py-10">
        Product not found.
      </div>
    );
  }

  return (
    <div className={`${inter.className} max-w-7xl m-auto xl:px-0 px-5 mt-24`}>
      {/* Breadcrumb */}
      <nav className="mb-6 mx-5">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-gray-800">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/shop" className="hover:text-gray-800">
              Shop
            </Link>
          </li>
          <li>/</li>
          <li className="font-medium text-gray-800 capitalize">
            {product.title}
          </li>
        </ol>
      </nav>

      <SingleProduct product={product} />

      <div className="flex justify-between mx-2 md:mx-5 mb-8 mt-24">
        <h2 className="text-lg md:text-2xl uppercase font-bold">Related Products</h2>
        <Link href={"/shop"}>
          <p className="text-lg font-bold underline underline-offset-4">
            View All
          </p>
        </Link>
      </div>

      {/* Related Products Section */}
      <div className="grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-5 justify-items-center">
        {relatedProducts.length > 0 ? (
          relatedProducts.map((product, index) => (
            <RelatedProducts key={product._id || index} product={product} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No related products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Page;
