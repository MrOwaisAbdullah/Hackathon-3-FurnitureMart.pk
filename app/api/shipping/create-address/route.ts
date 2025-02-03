import { NextApiRequest, NextApiResponse } from "next";
import { Shippo } from "shippo";

const shippo = new Shippo({ apiKeyHeader: process.env.NEXT_PUBLIC_SHIPPO_API_KEY as string });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { name, email, address, city, postalCode, country } = req.body;

  try {
    const createdAddress = await shippo.addresses.create({
      name,
      street1: address,
      city,
      zip: postalCode,
      country,
      phone: "", // Add phone if needed
      email,
    });

    if (!createdAddress || !createdAddress.objectId) {
      throw new Error("Failed to create shipping address");
    }

    return res.status(200).json({ success: true, address: createdAddress });
  } catch (error) {
    console.error("Error creating shipping address:", error);
    return res.status(500).json({ success: false, message: "Failed to create shipping address" });
  }
}