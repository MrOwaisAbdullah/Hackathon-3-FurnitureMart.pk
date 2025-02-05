// components/ui/OrderSummary.tsx
import { Product } from "@/typing";
import React from "react";

interface OrderSummaryProps {
  items: Product[]; // Cart items
  total: number; // Total price of products
  shippingCost: number; // Shipping cost
  totalQuantity: number; // Total quantity of items
}

const OrderSummary = ({
  total,
  shippingCost,
  totalQuantity,
}: OrderSummaryProps) => {
  const totalAmount = total + shippingCost;

  return (
    <div className="sticky top-10 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
      <div className="space-y-2">
        {/* Number of Items */}
        <div className="flex justify-between">
          <span>Items:</span>
          <span>{totalQuantity}</span>
        </div>

        {/* Product Total */}
        <div className="flex justify-between">
          <span>Product Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {/* Shipping Cost */}
        <div className="flex justify-between">
          <span>Shipping Cost:</span>
          <span>${shippingCost.toFixed(2)}</span>
        </div>

        {/* Total Amount */}
        <div className="flex justify-between font-semibold border-t pt-2">
          <span>Total Amount:</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;