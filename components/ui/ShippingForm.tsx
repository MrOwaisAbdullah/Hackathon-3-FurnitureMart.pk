// components/ui/ShippingForm.tsx
"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useCart } from "@/app/context/CartContext";
import { useNotifications } from "@/app/context/NotificationContext";
import { Product } from "@/typing";

// Zod schema for shipping details validation
const shippingDetailsSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

type ShippingDetails = z.infer<typeof shippingDetailsSchema>;

interface ShippingFormProps {
  onSuccess: (shippingDetails: ShippingDetails) => void; // Pass shippingDetails back to Checkout
  setOrderDetails: (details: { items: Product[]; total: number }) => void;
}

const ShippingForm = ({ onSuccess, setOrderDetails }: ShippingFormProps) => {
  const { validateCartBeforeCheckout } = useCart();
  const { addNotification } = useNotifications();
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      shippingDetailsSchema.parse(shippingDetails);
      setErrors({});
      setIsProcessing(true);

      const validationResult = await validateCartBeforeCheckout();

      if (!validationResult.success) {
        addNotification(
          validationResult.message || "Failed to validate your cart. Please try again.",
          "error"
        );
        return;
      }

      const { validatedCart } = validationResult;

      if (validatedCart.length === 0) {
        addNotification("Your cart appears to be empty. Please add items before checking out.", "error");
        return;
      }

      // Update order details with validated cart
      const validatedTotal = validatedCart.reduce(
        (sum, item) => sum + item.price * (item.quantity || 1),
        0
      );

      setOrderDetails({
        items: validatedCart,
        total: validatedTotal,
      });

      // Pass shippingDetails back to Checkout
      onSuccess(shippingDetails);
    } catch (error) {
      console.error("Error in handleShippingSubmit:", error);
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<string, string>> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
        addNotification("Please fix the errors in the form.", "error");
      } else {
        addNotification("An unexpected error occurred. Please try again.", "error");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleShippingSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Shipping Details</h2>

      {/* Full Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={shippingDetails.name}
          onChange={(e) =>
            setShippingDetails({ ...shippingDetails, name: e.target.value })
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-[6px] shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      {/* Email Address */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={shippingDetails.email}
          onChange={(e) =>
            setShippingDetails({ ...shippingDetails, email: e.target.value })
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-[6px] shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Address
        </label>
        <input
          id="address"
          type="text"
          value={shippingDetails.address}
          onChange={(e) =>
            setShippingDetails({ ...shippingDetails, address: e.target.value })
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-[6px] shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address}</p>
        )}
      </div>

      {/* City */}
      <div>
        <label
          htmlFor="city"
          className="block text-sm font-medium text-gray-700"
        >
          City
        </label>
        <input
          id="city"
          type="text"
          value={shippingDetails.city}
          onChange={(e) =>
            setShippingDetails({ ...shippingDetails, city: e.target.value })
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-[6px] shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
        {errors.city && (
          <p className="text-red-500 text-xs mt-1">{errors.city}</p>
        )}
      </div>

      {/* Postal Code */}
      <div>
        <label
          htmlFor="postalCode"
          className="block text-sm font-medium text-gray-700"
        >
          Postal Code
        </label>
        <input
          id="postalCode"
          type="text"
          value={shippingDetails.postalCode}
          onChange={(e) =>
            setShippingDetails({
              ...shippingDetails,
              postalCode: e.target.value,
            })
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-[6px] shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
        {errors.postalCode && (
          <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
        )}
      </div>

      {/* Country */}
      <div>
        <label
          htmlFor="country"
          className="block text-sm font-medium text-gray-700"
        >
          Country
        </label>
        <input
          id="country"
          type="text"
          value={shippingDetails.country}
          onChange={(e) =>
            setShippingDetails({ ...shippingDetails, country: e.target.value })
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-[6px] shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
        {errors.country && (
          <p className="text-red-500 text-xs mt-1">{errors.country}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-primary text-white py-3 rounded hover:bg-accent transition-colors"
      >
        {isProcessing ? "Processing..." : "Continue to Payment"}
      </button>
    </form>
  );
};

export default ShippingForm;
