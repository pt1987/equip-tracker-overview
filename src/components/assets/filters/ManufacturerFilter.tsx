
import { Factory } from "lucide-react";
import FilterSection from "./FilterSection";
import FilterOption from "./FilterOption";

interface ManufacturerFilterProps {
  selectedManufacturers: string[];
  setSelectedManufacturers: (manufacturers: string[]) => void;
  manufacturers: string[];
}

const ManufacturerFilter = ({
  selectedManufacturers,
  setSelectedManufacturers,
  manufacturers
}: ManufacturerFilterProps) => {
  const toggleManufacturerFilter = (manufacturer: string) => {
    if (selectedManufacturers.includes(manufacturer)) {
      setSelectedManufacturers(selectedManufacturers.filter(m => m !== manufacturer));
    } else {
      setSelectedManufacturers([...selectedManufacturers, manufacturer]);
    }
  };

  return (
    <FilterSection title="Hersteller" maxHeight>
      {manufacturers.map(manufacturer => (
        <FilterOption
          key={manufacturer}
          icon={<Factory size={14} />}
          label={manufacturer}
          isSelected={selectedManufacturers.includes(manufacturer)}
          onClick={() => toggleManufacturerFilter(manufacturer)}
        />
      ))}
    </FilterSection>
  );
};

export default ManufacturerFilter;
