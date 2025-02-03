import { NextRequest, NextResponse } from "next/server";
import { Shippo } from "shippo";

const shippo = new Shippo({ apiKeyHeader: process.env.NEXT_PUBLIC_SHIPPO_API_KEY as string });
export async function GET(
  request: NextRequest,
  { params }: { params: { trackingId: string } }
) {
  const { trackingId } = params;

  try {
    const trackingStatus = await shippo.trackingStatus.get(trackingId, "usps"); // Replace "usps" with dynamic carrier
    return NextResponse.json({ success: true, data: trackingStatus });
  } catch (error) {
    console.error("Error fetching tracking status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch tracking status." },
      { status: 500 }
    );
  }
}