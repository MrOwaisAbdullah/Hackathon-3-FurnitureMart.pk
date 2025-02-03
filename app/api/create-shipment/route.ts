import { NextRequest, NextResponse } from "next/server";
import shippoClient from "@/lib/shippo";

export async function POST(request: NextRequest) {
  try {
    const { orderDetails, shippingAddress } = await request.json();

    // Create a transaction (label)
    const transaction = await shippoClient.transactions.create({
      rate: "rate_id_here", // Replace with the selected rate ID from the rates response
      labelFileType: "PDF", // Label format
      async: false, // Set to true if you want asynchronous label creation
    });

    if (transaction.status === "SUCCESS") {
      return NextResponse.json({
        success: true,
        trackingNumber: transaction.trackingNumber,
        labelUrl: transaction.labelUrl,
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to create shipment label." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating shipment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create shipment." },
      { status: 500 }
    );
  }
}