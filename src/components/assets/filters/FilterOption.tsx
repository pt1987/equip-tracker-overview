
import { Check } from "lucide-react";
import { ReactNode } from "react";

interface FilterOptionProps {
  icon?: ReactNode;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const FilterOption = ({ icon, label, isSelected, onClick }: FilterOptionProps) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
        isSelected
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-foreground hover:bg-secondary/80"
      }`}
    >
      {icon}
      {label}
      {isSelected && <Check size={14} />}
    </button>
  );
};

export default FilterOption;
