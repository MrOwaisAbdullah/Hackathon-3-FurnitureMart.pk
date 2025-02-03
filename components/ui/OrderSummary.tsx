// components/ui/OrderSummary.tsx
import { Product } from '@/typing';
import React from 'react';

interface OrderSummaryProps {
  items: Product[]; // Cart items
  total: number; // Total price
}

const OrderSummary = ({ items, total }: OrderSummaryProps) => {
  return (
    <div className="sticky top-10 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
      <div className="space-y-2">
        {/* Number of Items */}
        <div className="flex justify-between">
          <span>Items:</span>
          <span>{items.length}</span>
        </div>

        {/* Total Price */}
        <div className="flex justify-between">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;