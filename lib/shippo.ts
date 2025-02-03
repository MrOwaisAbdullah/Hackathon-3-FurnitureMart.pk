import { DistanceUnitEnum, Rate as ShippoApiRates , Shippo, WeightUnitEnum} from "shippo";

// Initialize Shippo with API Token
const shippo = new Shippo({ apiKeyHeader: process.env.NEXT_PUBLIC_SHIPPO_API_KEY as string });

// Fetch shipping rates
export const getShippingRates = async (
  addressFrom: ShippoAddress,
  addressTo: ShippoAddress,
  parcel: ShippoParcel
): Promise<ShippoApiRates[]> => {
  console.log('getShippingRates called with:', {
    addressFrom,
    addressTo,
    parcel,
    apiKey: process.env.NEXT_PUBLIC_SHIPPO_API_KEY ? 'Present' : 'Missing'
  });

  try {
    console.log('Creating shipment with Shippo...');
    const shipment = await shippo.shipments.create({
      addressFrom,
      addressTo,
      parcels: [parcel],
      async: false,
    });

    console.log('Shipment created:', shipment);

    if (!shipment.rates || !Array.isArray(shipment.rates)) {
      console.log('No rates found in shipment response:', shipment);
      throw new Error('No shipping rates available');
    }

    console.log('Rates found:', shipment.rates);
    return shipment.rates;
  } catch (error) {
    console.error("Detailed error in getShippingRates:", {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};

// Create a shipping label
export const createShippingLabel = async (selectedRate: string) => {
  try {
    const transaction = await shippo.transactions.create({
      rate: selectedRate,
      labelFileType: "PDF",
    });

    return {
      trackingNumber: transaction.trackingNumber || "N/A", // Extract tracking number
      labelUrl: transaction.labelUrl || "N/A", // Extract label URL
    };
  } catch (error) {
    console.error("Error creating shipping label:", error);
    return null;
  }
};

// Track a shipment
export const trackShipment = async (trackingNumber: string, carrier: string) => {
  try {
    const tracking = await shippo.trackingStatus.get(trackingNumber, carrier);
    return tracking;
  } catch (error) {
    console.error("Error tracking shipment:", error);
    throw error;
  }
};

// Define Shippo address and parcel types
export type ShippoAddress = {
  name: string;
  street1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
  street2?: string;      // Optional
  company?: string;      // Optional
  metadata?: string;     // Optional
};

export type ShippoParcel = {
  length: string; // Must be a string
  width: string; // Must be a string
  height: string; // Must be a string
  weight: string; // Must be a string
  massUnit: WeightUnitEnum; // e.g., "lb", "kg"
  distanceUnit: DistanceUnitEnum; // e.g., "in", "cm"
};