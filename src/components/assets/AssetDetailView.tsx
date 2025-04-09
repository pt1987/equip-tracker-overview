
import { useState, useEffect } from "react";
import { Asset } from "@/lib/types";
import { getEmployeeById } from "@/data/employees";
import { useToast } from "@/hooks/use-toast";

// Import new component parts
import AssetImage from "./details/AssetImage";
import AssetHeaderInfo from "./details/AssetHeaderInfo";
import AssetTechnicalDetails from "./details/AssetTechnicalDetails";
import ConnectedAsset from "./details/ConnectedAsset";

interface AssetDetailViewProps {
  asset: Asset;
  onEdit: () => void;
  onDelete: () => void;
}

export default function AssetDetailView({
  asset,
  onEdit,
  onDelete
}: AssetDetailViewProps) {
  const [employeeData, setEmployeeData] = useState<any | null>(null);
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmployee = async () => {
      if (asset.employeeId) {
        setIsLoadingEmployee(true);
        try {
          const employee = await getEmployeeById(asset.employeeId);
          setEmployeeData(employee);
        } catch (error) {
          console.error("Error fetching employee data:", error);
        } finally {
          setIsLoadingEmployee(false);
        }
      }
    };
    fetchEmployee();
  }, [asset.employeeId]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AssetImage imageUrl={asset.imageUrl} altText={asset.name} />
        <AssetHeaderInfo asset={asset} onEdit={onEdit} onDelete={onDelete} />
      </div>

      <AssetTechnicalDetails asset={asset} />

      {asset.connectedAssetId && <ConnectedAsset connectedAssetId={asset.connectedAssetId} />}
    </div>
  );
}
