import { Product } from "@/typing";
import Link from "next/link";
import React from "react";

interface Props {
  orderDetails: { items: Product[]; total: number } | null;
  orderId: string | null; // Actual order ID passed as prop
  trackingId: string | null; // Actual tracking ID passed as prop
  shippingCost: number; // Shipping cost passed as prop
}

const ConfirmationPage = ({
  orderDetails,
  orderId,
  trackingId,
  shippingCost,
}: Props) => {
  // Calculate total amount (product total + shipping cost)
  const totalAmount = orderDetails ? orderDetails.total + shippingCost : 0;

  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Order Confirmed!</h1>
      <p className="text-gray-600 mb-8">
        Thank you for your purchase. Your order has been successfully placed.
      </p>
      <div className="space-y-4">
        <div>
          <strong>Order ID:</strong> {orderId || "N/A"}
        </div>
        <div>
          <strong>Product Total:</strong> ${orderDetails?.total.toFixed(2) || "0.00"}
        </div>
        <div>
          <strong>Shipping Cost:</strong> ${shippingCost.toFixed(2)}
        </div>
        <div>
          <strong>Total Amount:</strong> ${totalAmount.toFixed(2)}
        </div>
        <div>
          <strong>Tracking ID:</strong> {trackingId || "N/A"}
        </div>
      </div>
      <div className="flex flex-col space-y-2 mt-8 gap-2 md:flex-row md:space-y-0 md:space-x-4">
        <Link
          href={"/shop"}
          className="w-full bg-primary text-white py-3 rounded hover:bg-accent transition-colors"
        >
          Continue Shopping
        </Link>
        <Link
          href={`/track/${trackingId}`}
          className="w-full bg-primary text-white py-3 rounded hover:bg-accent transition-colors"
        >
          Track Your Order
        </Link>
      </div>
    </div>
  );
};

export default ConfirmationPage;