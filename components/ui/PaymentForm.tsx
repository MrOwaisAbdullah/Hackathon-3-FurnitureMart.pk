"use client";
import React, { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

interface Props {
  amount: number;
  onPaymentSuccess: () => void;
}

const PaymentForm = ({ amount, onPaymentSuccess }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Payment processing is not available. Please try again later.");
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);

    if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
      setError("Unable to find payment form. Please refresh the page.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create a payment intent on the server
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret } = await response.json();

      // Confirm the payment with Stripe
      const { error: paymentError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardNumberElement,
          },
        });

      if (paymentError) {
        setError(paymentError.message || "Payment failed");
        return;
      }

      if (paymentIntent.status === "succeeded") {
        onPaymentSuccess();
      } else {
        setError(`Payment status: ${paymentIntent.status}. Please try again.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Payment Information</h2>

      {/* Card Number Field */}
      <div>
        <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
          Card Number
        </label>
        <div className="p-3 border rounded-[6px]">
          <CardNumberElement
            id="card-number"
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Expiration Date Field */}
      <div>
        <label htmlFor="card-expiry" className="block text-sm font-medium text-gray-700">
          Expiration Date
        </label>
        <div className="p-3 border rounded-[6px]">
          <CardExpiryElement
            id="card-expiry"
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>

      {/* CVC Field */}
      <div>
        <label htmlFor="card-cvc" className="block text-sm font-medium text-gray-700">
          CVC
        </label>
        <div className="p-3 border rounded-[6px]">
          <CardCvcElement
            id="card-cvc"
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-sm mt-1">{error}</div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-primary text-white py-3 rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
};

export default PaymentForm;