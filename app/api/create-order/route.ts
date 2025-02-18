import { NextResponse } from "next/server";
import { createOrder } from "@/utils/createOrder";
import { Product, ShippingDetails } from "@/typing";
import { client } from "@/sanity/lib/client";

interface PaymentDetails {
  paymentMethod: string;
  amountPaid: number;
  transactionId?: string;
}

interface OrderRequestBody {
  cart: Product[];
  shipping: ShippingDetails;
  payment: PaymentDetails;
  customerId: string;
  sellerIds: string[]; 
}

export async function POST(request: Request) {
  try {
    const orderDetails: OrderRequestBody = await request.json();

    // Validate customerId (Sanity user ID)
    const customerExists = await client.fetch(
      `*[_type == "user" && _id == $customerId][0]`,
      { customerId: orderDetails.customerId }
    );
    if (!customerExists) {
      return NextResponse.json(
        { error: "Customer does not exist in Sanity." },
        { status: 400 }
      );
    }

    // Validate sellerIds (ensure all sellers exist in Sanity)
    const sellersExist = await Promise.all(
      orderDetails.sellerIds.map(async (sellerId) => {
        const seller = await client.fetch(
          `*[_type == "seller" && _id == $sellerId][0]`,
          { sellerId }
        );
        return !!seller;
      })
    );

    if (!sellersExist.every(Boolean)) {
      return NextResponse.json(
        { error: "One or more sellers do not exist in Sanity." },
        { status: 400 }
      );
    }

    // Proceed with order creation
    const createdOrder = await createOrder(orderDetails);
    return NextResponse.json({ id: createdOrder.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}