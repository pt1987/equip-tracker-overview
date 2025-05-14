
import { AssetType } from "@/lib/types";
import FilterSection from "./FilterSection";
import FilterOption from "./FilterOption";
import AssetTypeIcon from "../AssetTypeIcon";

interface TypeFilter {
  label: string;
  value: string;
}

const typeFilters: TypeFilter[] = [
  { label: "Laptop", value: "laptop" },
  { label: "Smartphone", value: "smartphone" },
  { label: "Tablet", value: "tablet" },
  { label: "Mouse", value: "mouse" },
  { label: "Keyboard", value: "keyboard" },
  { label: "Accessory", value: "accessory" },
];

interface TypeFilterProps {
  selectedTypes: AssetType[];
  setSelectedTypes: (types: AssetType[]) => void;
}

const TypeFilter = ({ selectedTypes, setSelectedTypes }: TypeFilterProps) => {
  const toggleTypeFilter = (type: AssetType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  return (
    <FilterSection title="Asset Type">
      {typeFilters.map(type => (
        <FilterOption
          key={type.value}
          icon={<AssetTypeIcon type={type.value as AssetType} />}
          label={type.label}
          isSelected={selectedTypes.includes(type.value as AssetType)}
          onClick={() => toggleTypeFilter(type.value as AssetType)}
        />
      ))}
    </FilterSection>
  );
};

export default TypeFilter;
