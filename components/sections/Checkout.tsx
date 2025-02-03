"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useNotifications } from "@/app/context/NotificationContext";
import PaymentForm from "@/components/ui/PaymentForm";
import { createOrder } from "@/utils/createOrder";
import { Product, ShippingDetails, ShippoRateDisplay } from "@/typing";
import { Rate as ShippoApiRates} from "shippo";
import ConfirmationPage from "./ConfirmationPage";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ShippingForm from "@/components/ui/ShippingForm";
import {
  createShippingLabel,
  getShippingRates,
  ShippoAddress,
  ShippoParcel,
} from "@/lib/shippo";
import { DistanceUnitEnum, WeightUnitEnum } from "shippo";

// Load Stripe library
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

const Checkout = () => {
  const { state, dispatch } = useCart();
  const { addNotification } = useNotifications();
  const [currentStep, setCurrentStep] = useState<
    "details" | "shipping" | "payment" | "confirmation"
  >("details");
  const [orderDetails, setOrderDetails] = useState<{
    items: Product[];
    total: number;
  } | null>(null);
  const [shippingDetails, setShippingDetails] =
    useState<ShippingDetails | null>(null);
  const [shippingRates, setShippingRates] = useState<ShippoRateDisplay[]>([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState<
    string | null
  >(null);

  // Ref to track if shippingDetails has been updated
  const isShippingDetailsUpdated = useRef(false);

  // Calculate initial totals
  const calculateTotals = useCallback(() => {
    const total = state.cart.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
    return {
      items: state.cart,
      total: total,
    };
  }, [state.cart]);

  useEffect(() => {
    if (state.cart.length > 0) {
      setOrderDetails(calculateTotals());
    }
  }, [state.cart, calculateTotals]);

  // Fetch shipping rates when shippingDetails changes
  useEffect(() => {
    if (shippingDetails && orderDetails && isShippingDetailsUpdated.current) {
      console.log("Fetching shipping rates...");
      fetchShippingRates();
      isShippingDetailsUpdated.current = false; // Reset the ref
    }
  }, [shippingDetails, orderDetails]);

  const handlePaymentSuccess = async () => {
    try {
      if (!orderDetails || !shippingDetails || !selectedShippingRate) {
        throw new Error(
          "Order details, shipping details, or shipping rate not found"
        );
      }

      // Create the order
      await createOrder({
        cart: orderDetails.items,
        shipping: shippingDetails,
        payment: {
          cardNumber: "**** **** **** ****",
          expiryDate: "**/**",
          cvv: "***",
        },
      });

      // Create a shipping label
      const label = await createShippingLabel(selectedShippingRate);
      console.log("Shipping label created:", label.labelUrl);

      // Clear the cart
      dispatch({ type: "CLEAR_CART" });
      setCurrentStep("confirmation");
      addNotification(
        "Payment successful! Your order has been placed.",
        "success"
      );
    } catch (error) {
      console.error("Error creating order or shipping label:", error);
      addNotification("Failed to create order. Please try again.", "error");
    }
  };

  const renderPaymentStep = () => {
    if (!orderDetails || orderDetails.total <= 0) {
      return <div>Error: Invalid order amount</div>;
    }

    return (
      <Elements stripe={stripePromise}>
        <PaymentForm
          amount={orderDetails.total}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </Elements>
    );
  };

  const transformShippoRates = (rates: ShippoApiRates[]): ShippoRateDisplay[] => {
    return rates.map(rate => ({
      objectId: rate.objectId,
      provider: rate.provider,
      servicelevel: {
        name: rate.servicelevel?.name || 'Standard Shipping'
      },
      amount: rate.amount ? rate.amount.toString() : '0',
      currency: rate.currency,
      transit_days: rate.estimatedDays || 0,
      estimated_days: rate.estimatedDays || 0
    }));
  };

  const fetchShippingRates = async () => {
    console.log('Starting fetchShippingRates...');
    console.log('Current shippingDetails:', shippingDetails);
    console.log('Current orderDetails:', orderDetails);

    if (!shippingDetails || !orderDetails) {
      console.log('Missing required details, aborting.');
      return;
    }

    try {
      const addressFrom: ShippoAddress = {
        name: "Your Store Name",
        street1: "123 Main St",
        city: "San Francisco",
        state: "CA",
        zip: "94107",
        country: "US",
        phone: "555-555-5555",
        email: "store@example.com",
      };

      const addressTo: ShippoAddress = {
        name: shippingDetails.name,
        street1: shippingDetails.address,
        city: shippingDetails.city,
        state: shippingDetails.state || "N/A",
        zip: shippingDetails.postalCode,
        country: shippingDetails.country,
        phone: "555-555-5555",
        email: shippingDetails.email,
      };

      console.log('AddressFrom:', addressFrom);
      console.log('AddressTo:', addressTo);

      const totalWeight = orderDetails.items
        .reduce((sum, item) => {
          console.log(`Item weight for ${item.title}:`, item.weight || 1);
          return sum + (item.weight || 1);
        }, 0)
        .toString();

      console.log('Calculated total weight:', totalWeight);

      const parcel: ShippoParcel = {
        length: "10",
        width: "8",
        height: "4",
        distanceUnit: DistanceUnitEnum.In,
        weight: totalWeight,
        massUnit: WeightUnitEnum.Lb,
      };

      console.log('Parcel details:', parcel);
      console.log('Calling getShippingRates with the above parameters...');

      const rates = await getShippingRates(addressFrom, addressTo, parcel);
      console.log('Received rates from API:', rates);

      const transformedRates = transformShippoRates(rates);
      console.log('Transformed rates:', transformedRates);

      setShippingRates(transformedRates);
      console.log('Updated shipping rates state');
    } catch (error) {
      console.error("Detailed error in fetchShippingRates:", {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      addNotification(
        "Failed to fetch shipping rates. Please try again.",
        "error"
      );
    }
  };

  const renderShippingRates = () => {
    console.log('renderShippingRates called with:', {
      ratesLength: shippingRates.length,
      currentRates: shippingRates
    });

    if (shippingRates.length === 0) {
      return (
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <div>Loading shipping rates...</div>
          <div className="text-sm text-gray-500 mt-2">
            This may take a few moments
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Shipping Options</h2>
        {shippingRates.map((rate) => (
          <div
            key={rate.objectId}
            className={`p-4 border rounded-md cursor-pointer ${
              selectedShippingRate === rate.objectId
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-primary/50"
            }`}
            onClick={() => setSelectedShippingRate(rate.objectId)}
          >
            <div className="font-bold">{rate.provider}</div>
            <div>{rate.servicelevel.name}</div>
            <div className="font-medium">${parseFloat(rate.amount).toFixed(2)} {rate.currency}</div>
            {rate.transit_days > 0 && (
              <div className="text-sm text-gray-600">
                Estimated delivery: {rate.transit_days} days
              </div>
            )}
          </div>
        ))}
        <button
          onClick={() => setCurrentStep("payment")}
          className="w-full bg-primary text-white py-3 rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedShippingRate}
        >
          Continue to Payment
        </button>
      </div>
    );
  };

  const renderCheckoutStep = () => {
    switch (currentStep) {
      case "details":
        return (
          <ShippingForm
            onSuccess={(details) => {
              setShippingDetails(details);
              isShippingDetailsUpdated.current = true; // Mark as updated
              setCurrentStep("shipping");
            }}
            setOrderDetails={setOrderDetails}
          />
        );
      case "shipping":
        return renderShippingRates();
      case "payment":
        return renderPaymentStep();
      case "confirmation":
        return <ConfirmationPage orderDetails={orderDetails} />;
      default:
        return null;
    }
  };

  return (
    <div className="px-3">
      {/* Progress Indicator */}
      <div className="flex justify-between text-sm font-medium text-gray-500">
        <span
          className={currentStep === "details" ? "text-primary font-bold" : ""}
        >
          Details
        </span>
        <span
          className={currentStep === "shipping" ? "text-primary font-bold" : ""}
        >
          Shipping
        </span>
        <span
          className={currentStep === "payment" ? "text-primary font-bold" : ""}
        >
          Payment
        </span>
        <span
          className={
            currentStep === "confirmation" ? "text-primary font-bold" : ""
          }
        >
          Confirmation
        </span>
      </div>

      {/* Order Summary */}
      {currentStep !== "confirmation" && orderDetails && (
        <div className="mt-8 mb-5 p-6 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-bold mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div>Items: {orderDetails.items.length}</div>
            <div>Total: ${orderDetails.total.toFixed(2)}</div>
          </div>
        </div>
      )}

      {/* Render Current Step */}
      {renderCheckoutStep()}
    </div>
  );
};

export default Checkout;