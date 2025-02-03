import { useRouter } from "next/router";
import TrackOrder from "@/components/sections/TrackOrder";

const TrackingPage = () => {
  const router = useRouter();
  const { trackingId } = router.query;

  if (!trackingId) {
    return <p>Invalid tracking ID.</p>;
  }

  return <TrackOrder trackingId={trackingId as string} />;
};

export default TrackingPage;