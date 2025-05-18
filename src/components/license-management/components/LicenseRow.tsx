
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Save, X } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import { ComplianceBadge } from "../../reports/components/ComplianceBadge";
import { LicenseDetailsDialog } from "./LicenseDetailsDialog";

interface LicenseData {
  id: string;
  name: string;
  license_type: string;
  expiry_date: string | null;
  total_licenses: number;
  assigned_count: number;
  cost_per_license: number;
  status: string;
  isEditing?: boolean;
}

interface LicenseRowProps {
  license: LicenseData;
  index: number;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, index: number, field: keyof LicenseData) => void;
  toggleEdit: (index: number) => void;
  saveLicense: (index: number) => void;
  deleteLicense: (id: string, name: string) => void;
  onAssignmentChange?: () => void;
}

export const LicenseRow = ({ 
  license, 
  index,
  handleInputChange,
  toggleEdit,
  saveLicense,
  deleteLicense,
  onAssignmentChange = () => {}
}: LicenseRowProps) => {
  return (
    <TableRow>
      <TableCell>
        {license.isEditing ? (
          <Input 
            value={license.name} 
            onChange={(e) => handleInputChange(e, index, 'name')} 
          />
        ) : (
          license.name
        )}
      </TableCell>
      <TableCell>
        {license.isEditing ? (
          <Input 
            value={license.license_type} 
            onChange={(e) => handleInputChange(e, index, 'license_type')} 
          />
        ) : (
          license.license_type
        )}
      </TableCell>
      <TableCell>
        {license.isEditing ? (
          <Input 
            type="date" 
            value={license.expiry_date ? license.expiry_date.substring(0, 10) : ''} 
            onChange={(e) => handleInputChange(e, index, 'expiry_date')} 
          />
        ) : (
          license.expiry_date ? formatDate(license.expiry_date) : '-'
        )}
      </TableCell>
      <TableCell className="text-right">
        {license.isEditing ? (
          <Input 
            type="number" 
            value={license.total_licenses} 
            onChange={(e) => handleInputChange(e, index, 'total_licenses')} 
          />
        ) : (
          license.total_licenses
        )}
      </TableCell>
      <TableCell className="text-right">
        {license.isEditing ? (
          <Input 
            type="number" 
            value={license.assigned_count} 
            onChange={(e) => handleInputChange(e, index, 'assigned_count')} 
          />
        ) : (
          license.assigned_count
        )}
      </TableCell>
      <TableCell className="text-right">
        {license.isEditing ? (
          <Input 
            type="number" 
            value={license.cost_per_license} 
            onChange={(e) => handleInputChange(e, index, 'cost_per_license')} 
          />
        ) : (
          formatCurrency(license.cost_per_license)
        )}
      </TableCell>
      <TableCell>
        <ComplianceBadge status={license.status} />
      </TableCell>
      <TableCell className="text-right">
        {license.isEditing ? (
          <div className="flex justify-end space-x-2">
            <Button size="sm" variant="outline" onClick={() => saveLicense(index)}>
              <Save className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => toggleEdit(index)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex justify-end space-x-2">
            <LicenseDetailsDialog
              license={license}
              onAssignmentChange={() => {
                onAssignmentChange();
              }}
            />
            <Button size="sm" variant="outline" onClick={() => toggleEdit(index)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-red-500 hover:text-red-700" 
              onClick={() => deleteLicense(license.id, license.name)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};
