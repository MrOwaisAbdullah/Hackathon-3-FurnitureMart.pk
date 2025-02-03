import React, { useEffect, useState } from "react";

interface TrackingStatus {
  status: string;
  location: string;
  eta: string;
}

const TrackOrder: React.FC<{ trackingId: string }> = ({ trackingId }) => {
  const [trackingStatus, setTrackingStatus] = useState<TrackingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrackingStatus = async () => {
      try {
        const response = await fetch(`/api/track/${trackingId}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch tracking status.");
        }

        setTrackingStatus(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingStatus();
  }, [trackingId]);

  if (loading) {
    return <p>Loading tracking information...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Tracking Information</h1>
      <p className="mb-2">
        <strong>Status:</strong> {trackingStatus?.status || "N/A"}
      </p>
      <p className="mb-2">
        <strong>Location:</strong> {trackingStatus?.location || "N/A"}
      </p>
      <p className="mb-2">
        <strong>Estimated Delivery:</strong> {trackingStatus?.eta || "N/A"}
      </p>
    </div>
  );
};

export default TrackOrder;