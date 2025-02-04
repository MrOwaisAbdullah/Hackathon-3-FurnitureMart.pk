"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useNotifications } from "@/app/context/NotificationContext";
import PaymentForm from "@/components/ui/PaymentForm";
import { createOrder } from "@/utils/createOrder";
import { Product, ShippingDetails, ShippoRateDisplay } from "@/typing";
import { Rate as ShippoApiRates } from "shippo";
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
import { CheckoutProgress } from "../ui/ProgressIndicator";
import { useUser } from "@clerk/nextjs";
import { saveUser } from "@/utils/userUtils";
import { useUserSync } from "@/hooks/useUserSync";

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
  const [trackingId, setTrackingId] = useState<string | null>(null); // Store tracking ID
  const [orderId, setOrderId] = useState<string | null>(null); // Store order ID
  const { user } = useUser();

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      // Get address from user's public metadata
      const userMetadata = user.publicMetadata;
      if (userMetadata && "address" in userMetadata) {
        setShippingDetails(userMetadata.address as ShippingDetails);
      }
    }
  }, [user]);

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

  // Safely destructure syncUser and isLoading
  const userSyncResult = useUserSync();
  const { syncUser, isLoading: isSyncingUser } = userSyncResult || {
    syncUser: () => Promise.resolve(false),
    isLoading: false,
  };

  const handlePaymentSuccess = async () => {
    if (
      !shippingDetails ||
      !shippingDetails.name ||
      !shippingDetails.email ||
      !shippingDetails.mobile ||
      !shippingDetails.address ||
      !shippingDetails.city ||
      !shippingDetails.postalCode ||
      !shippingDetails.country
    ) {
      // console.error("Invalid shipping details:", shippingDetails);
      addNotification(
        "Please fill out all required shipping details.",
        "error"
      );
      return;
    }

    // console.log("Shipping details being synced:", shippingDetails);
    setIsProcessing(true);

    try {
      if (user) {
        try {
          await saveUser({
            clerkId: user.id,
            name: shippingDetails.name,
            email: shippingDetails.email,
            mobile: shippingDetails.mobile,
            address: {
              street: shippingDetails.address,
              city: shippingDetails.city,
              state: shippingDetails.state ?? "",
              postalCode: shippingDetails.postalCode,
              country: shippingDetails.country,
            },
          });
        } catch (error) {
          console.error("Error saving user:", error);
        }
      }

      // Try to sync user but continue regardless
      if (syncUser) {
        try {
          await syncUser(shippingDetails);
        } catch (error) {
          console.error("Error syncing user:", error);
        }
      }

      if (!orderDetails || !shippingDetails || !selectedShippingRate) {
        throw new Error("Missing required order information");
      }

      const createdOrder = await createOrder({
        cart: orderDetails.items,
        shipping: shippingDetails,
        payment: {
          cardNumber: "**** **** **** ****",
          expiryDate: "**/**",
          cvv: "***",
        },
      });

      // console.log("Order created successfully. Creating shipping label...");
      const label = await createShippingLabel(selectedShippingRate);

      if (!label) {
        throw new Error("Failed to create shipping label");
      }

      // console.log("Shipping label created:", label?.labelUrl);
      const trackingNumber = label?.trackingNumber || "N/A";
      const orderId = createdOrder?.id || "N/A";

      setTrackingId(trackingNumber);
      setOrderId(orderId);
      dispatch({ type: "CLEAR_CART" });
      setCurrentStep("confirmation");

      addNotification(
        "Payment successful! Your order has been placed.",
        "success"
      );
    } catch (error) {
      console.error("Error creating order or shipping label:", error);
      addNotification("Failed to create order. Please try again.", "error");
    } finally {
      setIsProcessing(false);
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

  const transformShippoRates = (
    rates: ShippoApiRates[]
  ): ShippoRateDisplay[] => {
    return rates.map((rate) => ({
      objectId: rate.objectId,
      provider: rate.provider,
      servicelevel: {
        name: rate.servicelevel?.name || "Standard Shipping",
      },
      amount: rate.amount ? rate.amount.toString() : "0",
      currency: rate.currency,
      transit_days: rate.estimatedDays || 0,
      estimated_days: rate.estimatedDays || 0,
    }));
  };

  const fetchShippingRates = async () => {
    console.log("Starting fetchShippingRates...");
    console.log("Current shippingDetails:", shippingDetails);
    console.log("Current orderDetails:", orderDetails);

    if (!shippingDetails || !orderDetails) {
      console.log("Missing required details, aborting.");
      return;
    }

    try {
      const addressFrom: ShippoAddress = {
        name: "FurnitureMart.pk",
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
        phone: shippingDetails.mobile,
        email: shippingDetails.email,
      };

      const totalWeight = orderDetails.items.reduce((sum, item) => {
        console.log(`Item weight for ${item.title}:`, item.weight || 1);
        return sum + (item.weight || 1);
      }, 0);

      const parcel: ShippoParcel = {
        length: "10",
        width: "8",
        height: "4",
        distanceUnit: DistanceUnitEnum.In,
        weight: totalWeight.toString(),
        massUnit: WeightUnitEnum.Lb,
      };

      const rates = await getShippingRates(addressFrom, addressTo, parcel);
      const transformedRates = transformShippoRates(rates);

      // Update shipping rates without modifying shippingDetails or orderDetails
      setShippingRates(transformedRates);
    } catch (error) {
      console.error("Detailed error in fetchShippingRates:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      addNotification(
        "Failed to fetch shipping rates. Please try again.",
        "error"
      );
    }
  };

  const renderShippingRates = () => {
    console.log("renderShippingRates called with:", {
      ratesLength: shippingRates.length,
      currentRates: shippingRates,
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
            <div className="font-medium">
              ${parseFloat(rate.amount).toFixed(2)} {rate.currency}
            </div>
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
        return (
          <ConfirmationPage
            orderDetails={orderDetails}
            orderId={orderId}
            trackingId={trackingId}
          />
        );
      default:
        return null;
    }
  };

  // Show loading state during sync or processing
  if (isProcessing || isSyncingUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Processing your order...</p>
          <p className="text-sm text-gray-500">
            Please don&apos;t close this window
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="px-3 my-6">
      <CheckoutProgress currentStep={currentStep} />

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
