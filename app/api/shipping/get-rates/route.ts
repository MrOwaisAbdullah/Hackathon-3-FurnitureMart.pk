import { NextApiRequest, NextApiResponse } from "next";
import { Shippo } from "shippo";

const shippo = new Shippo({ apiKeyHeader: process.env.NEXT_PUBLIC_SHIPPO_API_KEY as string });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { addressTo } = req.body;

  try {
    const shipment = await shippo.shipments.create({
      addressFrom: {
        name: "FurnitureMart.pk",
        street1: "Main Market, Karachi",
        city: "Karachi",
        zip: "74000",
        country: "PK",
        phone: "+92XXXXXXXXXX",
      },
      addressTo: addressTo,
      parcels: [
        {
          length: "100",
          width: "50",
          height: "40",
          distanceUnit: "cm",
          weight: "20",
          massUnit: "kg",
        },
      ],
      carrierAccounts: ["tcs", "leopard"],
    });

    if (!shipment.rates || shipment.rates.length === 0) {
      throw new Error("No shipping rates available");
    }

    return res.status(200).json({ success: true, rates: shipment.rates });
  } catch (error) {
    console.error("Error fetching shipping rates:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch shipping rates" });
  }
}