import React from 'react'
import ProductCard from '../ui/ProductCard'
import { inter } from '@/app/fonts'
import { ProductCards, ProductsSectionProps } from '@/typing'
import { getProducts } from '@/sanity/lib/fetch'

const Products = async ({ limit }: ProductsSectionProps) => {

  const products = await getProducts();

  const displayedProducts = limit ? products.slice(0, limit) : products;

  return (
    <section className={`${inter.className} flex flex-col justify-center mt-36`}>
      <h2 className="heading text-center px-2 xl:px-0">Our Products</h2>
      <div className="grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-10 xl:px-0 justify-items-center">
        {/* Map over products and pass each product to ProductCard */}
        {displayedProducts.map((product: ProductCards, index: number) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </section>
)
}

export default Products