
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LicenseRow } from "./LicenseRow";

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

interface LicenseTableProps {
  editingLicenses: LicenseData[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, index: number, field: keyof LicenseData) => void;
  toggleEdit: (index: number) => void;
  saveLicense: (index: number) => void;
  deleteLicense: (id: string, name: string) => void;
}

export const LicenseTable = ({
  editingLicenses,
  handleInputChange,
  toggleEdit,
  saveLicense,
  deleteLicense
}: LicenseTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Lizenztyp</TableHead>
          <TableHead>Ablaufdatum</TableHead>
          <TableHead className="text-right">Anzahl</TableHead>
          <TableHead className="text-right">Zugewiesen</TableHead>
          <TableHead className="text-right">Kosten/Lizenz</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Aktionen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {editingLicenses.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-6 text-gray-500">
              Keine Lizenzdaten verfügbar.
            </TableCell>
          </TableRow>
        ) : (
          editingLicenses.map((license, index) => (
            <LicenseRow
              key={license.id}
              license={license}
              index={index}
              handleInputChange={handleInputChange}
              toggleEdit={toggleEdit}
              saveLicense={saveLicense}
              deleteLicense={deleteLicense}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};
