
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PageTransition from "@/components/layout/PageTransition";
import AssetDetailView from "@/components/assets/AssetDetailView";
import AssetDetailEdit from "@/components/assets/AssetDetailEdit";
import { getAssetById, getAssetHistoryByAssetId, deleteAsset } from "@/services/assetService";
import { getEmployeeById } from "@/services/employeeService";
import { Asset, AssetHistoryEntry, Employee } from "@/lib/types";
import { toast } from "sonner";

const AssetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);

  // Fetch asset data
  const { 
    data: asset,
    isLoading: assetLoading,
    isError: assetError
  } = useQuery({
    queryKey: ['asset', id],
    queryFn: () => getAssetById(id || ''),
    enabled: !!id
  });

  // Fetch asset history
  const { 
    data: assetHistory,
    isLoading: historyLoading,
    isError: historyError
  } = useQuery({
    queryKey: ['assetHistory', id],
    queryFn: () => getAssetHistoryByAssetId(id || ''),
    enabled: !!id
  });

  // Fetch employee data if asset is assigned
  useEffect(() => {
    const fetchEmployee = async () => {
      if (asset && asset.employeeId) {
        const employeeData = await getEmployeeById(asset.employeeId);
        setEmployee(employeeData);
      } else {
        setEmployee(null);
      }
    };
    
    fetchEmployee();
  }, [asset]);

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm("Are you sure you want to delete this asset?")) {
      const success = await deleteAsset(id);
      if (success) {
        navigate("/assets");
      }
    }
  };

  if (assetLoading || historyLoading) {
    return (
      <PageTransition>
        <div className="p-6">
          <div className="animate-pulse glass-card p-8">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (assetError || historyError || !asset) {
    return (
      <PageTransition>
        <div className="p-6">
          <div className="glass-card p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Error Loading Asset</h2>
            <p className="mb-6">We couldn't load the asset details.</p>
            <button 
              onClick={() => navigate("/assets")}
              className="px-4 py-2 bg-primary text-white rounded"
            >
              Return to Assets
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      {isEditMode ? (
        <AssetDetailEdit 
          asset={asset}
          onCancel={handleEditToggle}
          employee={employee}
        />
      ) : (
        <AssetDetailView 
          asset={asset}
          assetHistory={assetHistory || []}
          employee={employee}
          onEdit={handleEditToggle}
          onDelete={handleDelete}
        />
      )}
    </PageTransition>
  );
};

export default AssetDetail;
