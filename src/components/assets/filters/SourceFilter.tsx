
import { Factory, Globe } from "lucide-react";
import FilterSection from "./FilterSection";
import FilterOption from "./FilterOption";

interface SourceFilterProps {
  isExternalFilter: boolean | null;
  setIsExternalFilter: (isExternal: boolean | null) => void;
}

const SourceFilter = ({ isExternalFilter, setIsExternalFilter }: SourceFilterProps) => {
  const toggleExternalFilter = (isExternal: boolean) => {
    if (isExternalFilter === isExternal) {
      setIsExternalFilter(null);
    } else {
      setIsExternalFilter(isExternal);
    }
  };

  return (
    <FilterSection title="Asset Source">
      <FilterOption
        icon={<Factory size={16} />}
        label="Internal"
        isSelected={isExternalFilter === false}
        onClick={() => toggleExternalFilter(false)}
      />
      <FilterOption
        icon={<Globe size={16} />}
        label="External"
        isSelected={isExternalFilter === true}
        onClick={() => toggleExternalFilter(true)}
      />
    </FilterSection>
  );
};

export default SourceFilter;
