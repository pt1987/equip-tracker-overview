
import { memo } from "react";
import PurchaseHistoryList from "../PurchaseHistoryList";

interface HistoryTabProps {
  purchaseId: string;
}

const HistoryTab = memo(({ purchaseId }: HistoryTabProps) => {
  return (
    <div className="py-4">
      <PurchaseHistoryList purchaseId={purchaseId} />
    </div>
  );
});

HistoryTab.displayName = "HistoryTab";

export default HistoryTab;
