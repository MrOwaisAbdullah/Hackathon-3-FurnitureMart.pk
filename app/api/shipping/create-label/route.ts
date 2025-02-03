import { NextApiRequest, NextApiResponse } from "next";
import { Shippo } from "shippo";

const shippo = new Shippo({ apiKeyHeader: process.env.NEXT_PUBLIC_SHIPPO_API_KEY as string });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { rateId } = req.body;

  try {
    const transaction = await shippo.transactions.create({
      rate: rateId,
      labelFileType: "PDF",
    });

    if (!transaction || !transaction.trackingUrlProvider) {
      throw new Error("Failed to create shipping label");
    }

    return res.status(200).json({ success: true, trackingUrl: transaction.trackingUrlProvider });
  } catch (error) {
    console.error("Error creating shipping label:", error);
    return res.status(500).json({ success: false, message: "Failed to create shipping label" });
  }
}