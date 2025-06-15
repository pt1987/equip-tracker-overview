
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Asset, Employee } from "@/lib/types";

interface BookingAssetSelectorProps {
  selectedAssetId: string;
  setSelectedAssetId: (id: string) => void;
  employeeId: string;
  setEmployeeId: (id: string) => void;
  poolAssets: Asset[];
  employees: Employee[];
}

export default function BookingAssetSelector({
  selectedAssetId,
  setSelectedAssetId,
  employeeId,
  setEmployeeId,
  poolAssets,
  employees
}: BookingAssetSelectorProps) {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="asset">Poolgerät</Label>
        <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
          <SelectTrigger id="asset">
            <SelectValue placeholder="Poolgerät auswählen" />
          </SelectTrigger>
          <SelectContent>
            {poolAssets.map((asset) => (
              <SelectItem key={asset.id} value={asset.id}>
                {asset.name} ({asset.manufacturer} {asset.model})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="employee">Mitarbeiter</Label>
        <Select value={employeeId} onValueChange={setEmployeeId}>
          <SelectTrigger id="employee">
            <SelectValue placeholder="Mitarbeiter auswählen" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.firstName} {employee.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
