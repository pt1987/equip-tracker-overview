
import { AssetType } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssetTypeFilterProps {
  selectedType: AssetType | "all";
  onChange: (type: AssetType | "all") => void;
}

export default function AssetTypeFilter({ selectedType, onChange }: AssetTypeFilterProps) {
  return (
    <Select value={selectedType} onValueChange={(value) => onChange(value as AssetType | "all")}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Gerätetyp" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Alle Geräte</SelectItem>
        <SelectItem value="laptop">Notebooks</SelectItem>
        <SelectItem value="tablet">Tablets</SelectItem>
        <SelectItem value="smartphone">Smartphones</SelectItem>
        <SelectItem value="accessory">Zubehör</SelectItem>
      </SelectContent>
    </Select>
  );
}
