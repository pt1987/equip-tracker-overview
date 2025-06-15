
import { Asset, Employee } from "@/lib/types";
import AssetBookingSection from "@/components/shared/AssetBookingSection";

interface AssetBookingSectionProps {
  asset: Asset;
  employees: Employee[];
  refetchAsset: () => void;
}

// This is now just a re-export of the shared component
export default function BookingAssetBookingSection(props: AssetBookingSectionProps) {
  return <AssetBookingSection {...props} />;
}
