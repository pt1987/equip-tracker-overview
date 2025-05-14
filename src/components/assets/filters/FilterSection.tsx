
import { ReactNode } from "react";

interface FilterSectionProps {
  title: string;
  children: ReactNode;
  maxHeight?: boolean;
}

const FilterSection = ({ title, children, maxHeight = false }: FilterSectionProps) => {
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">{title}</h4>
      <div className={`flex flex-wrap gap-2 ${maxHeight ? 'max-h-32 overflow-y-auto pr-2' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default FilterSection;
