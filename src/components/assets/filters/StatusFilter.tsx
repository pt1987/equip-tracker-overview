
import { AssetStatus } from "@/lib/types";
import FilterSection from "./FilterSection";
import FilterOption from "./FilterOption";

interface StatusFilter {
  label: string;
  value: string;
}

const statusFilters: StatusFilter[] = [
  { label: "Ordered", value: "ordered" },
  { label: "Delivered", value: "delivered" },
  { label: "In Use", value: "in_use" },
  { label: "Defective", value: "defective" },
  { label: "Repair", value: "repair" },
  { label: "Pool", value: "pool" },
];

interface StatusFilterProps {
  selectedStatuses: AssetStatus[];
  setSelectedStatuses: (statuses: AssetStatus[]) => void;
}

const StatusFilter = ({ selectedStatuses, setSelectedStatuses }: StatusFilterProps) => {
  const toggleStatusFilter = (status: AssetStatus) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  return (
    <FilterSection title="Status">
      {statusFilters.map(status => (
        <FilterOption
          key={status.value}
          label={status.label}
          isSelected={selectedStatuses.includes(status.value as AssetStatus)}
          onClick={() => toggleStatusFilter(status.value as AssetStatus)}
        />
      ))}
    </FilterSection>
  );
};

export default StatusFilter;
