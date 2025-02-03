import { NextRequest, NextResponse } from "next/server";
import shippoClient from "@/lib/shippo";
import { Product } from "@/typing";

export async function POST(request: NextRequest) {
  try {
    const { shippingAddress, cart } = await request.json();

    // Create a shipment object
    const shipment = await shippoClient.shipments.create({
      addressFrom: {
        name: "Your Company Name",
        street1: "Your Address Line 1",
        city: "Your City",
        state: "Your State",
        zip: "Your Postal Code",
        country: "US", // Replace with your country code
      },
      addressTo: {
        name: shippingAddress.name,
        street1: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip: shippingAddress.postalCode,
        country: shippingAddress.country,

      },
      parcels: [
        {
          length: "5",
          width: "5",
          height: "5",
          distanceUnit: "in",
          weight: calculateCartWeight(cart),
          massUnit: "lb",
        },
      ],
      async: false, // Set to true if you want asynchronous rate calculation
    });

    interface ShippoRate {
        provider: string;
        servicelevel_name: string;
        amount: string;
        currency: string;
        estimated_days: number;
      }
      
      const rates = shipment.rates.map((rate: ShippoRate) => ({
        carrier: rate.provider,
        service: rate.servicelevel_name,
        amount: rate.amount,
        currency: rate.currency,
        estimatedDays: rate.estimated_days,
      }));

    return NextResponse.json({ success: true, rates });
  } catch (error) {
    console.error("Error fetching shipping rates:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch shipping rates." },
      { status: 500 }
    );
  }
}

// Helper function to calculate total cart weight
function calculateCartWeight(cart: Product[]) {
  const totalWeight = cart.reduce((sum, item) => sum + (item.weight || 1), 0); // Default weight is 1 pound
  return totalWeight.toString(); // Shippo requires weight as a string
}