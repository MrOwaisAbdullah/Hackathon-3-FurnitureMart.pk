import { NextRequest, NextResponse } from "next/server";
import shippoClient from "@/lib/shippo";

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    const validatedAddress = await shippoClient.addresses.validate(JSON.stringify({
      name: address.name,
      street1: address.address,
      city: address.city,
      state: address.state,
      zip: address.postalCode,
      country: address.country,
    }));

    if (validatedAddress.validationResults?.isValid) {
      return NextResponse.json({
        success: true,
        validatedAddress: validatedAddress,
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid shipping address." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error validating address:", error);
    return NextResponse.json(
      { success: false, message: "Failed to validate address." },
      { status: 500 }
    );
  }
}