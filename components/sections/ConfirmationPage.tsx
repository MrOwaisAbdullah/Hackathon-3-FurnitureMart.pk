import { Product } from "@/typing";
import React from "react";

interface Props {
  orderDetails: { items: Product[]; total: number } | null;
}

const ConfirmationPage = ({ orderDetails }: Props) => {
  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Order Confirmed!</h1>
      <p className="text-gray-600 mb-8">
        Thank you for your purchase. Your order has been successfully placed.
      </p>
      <div className="space-y-4">
        <div>
          <strong>Order ID:</strong> {Math.random().toString(36).substr(2, 9)}
        </div>
        <div>
          <strong>Total:</strong> ${orderDetails?.total.toFixed(2) || "0.00"}
        </div>
        <div>
          <strong>Tracking ID:</strong> {Math.random().toString(36).substr(2, 9)}
        </div>
      </div>
      <button
        onClick={() => (window.location.href = "/")}
        className="mt-8 w-full bg-primary text-white py-3 rounded-lg hover:bg-accent transition-colors"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default ConfirmationPage;