import { client } from '@/sanity/lib/client';

export async function getUserOrders(clerkId: string) {
  const query = `*[_type == "order" && customer.clerkId == $clerkId]{
    _id,
    total,
    status,
    createdAt,
    products[]{
      product->{
        title,
        price
      },
      quantity
    }
  }`;

  const orders = await client.fetch(query, { clerkId });
  return orders;
}