import { client } from "./client";
import { ProductCards, Seller } from "@/typing";



// Fetch Products
export async function getProducts(): Promise<ProductCards[]> {
  const query = `*[_type == "products"]{
    price,
    image,
    title,
    slug,
    _id,
    priceWithoutDiscount,
    "isDiscounted": priceWithoutDiscount > 0,
    "isNew": dateTime(createdAt) > dateTime(now()) - 7 * 24 * 60 * 60 * 1000,
    category->{ _id, title }, 
    tags,
    inventory,
    seller->{_id, name}
  }`
  const result = await client.fetch(query);
  return result;
}

//Fetch Categories
export async function getCategories(): Promise<string[]> {
  const query = `*[_type == "categories" ]{
  image,
    title,
    _id
}`;
  const result = await client.fetch(query);
  return result.map((cat: { title: string }) => cat.title);
}

//Fetch Sellers
export async function getSellers(): Promise<Seller[]> {
  const query = `*[_type == "seller"]{
    _id,
    shopName,
  }`;
  const result = await client.fetch(query, {}, { cache: 'no-store' }); // Disable caching
  return result;
}