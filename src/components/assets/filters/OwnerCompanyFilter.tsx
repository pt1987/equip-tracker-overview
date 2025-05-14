
import { Building } from "lucide-react";
import FilterSection from "./FilterSection";
import FilterOption from "./FilterOption";

interface OwnerCompanyFilterProps {
  selectedOwnerCompanies: string[];
  setSelectedOwnerCompanies: (companies: string[]) => void;
  ownerCompanies: string[];
}

const OwnerCompanyFilter = ({
  selectedOwnerCompanies,
  setSelectedOwnerCompanies,
  ownerCompanies
}: OwnerCompanyFilterProps) => {
  const toggleOwnerCompanyFilter = (company: string) => {
    if (selectedOwnerCompanies.includes(company)) {
      setSelectedOwnerCompanies(selectedOwnerCompanies.filter(c => c !== company));
    } else {
      setSelectedOwnerCompanies([...selectedOwnerCompanies, company]);
    }
  };

  if (ownerCompanies.length === 0) return null;

  return (
    <FilterSection title="Eigentümerfirma" maxHeight>
      {ownerCompanies.map(company => (
        <FilterOption
          key={company}
          icon={<Building size={14} />}
          label={company}
          isSelected={selectedOwnerCompanies.includes(company)}
          onClick={() => toggleOwnerCompanyFilter(company)}
        />
      ))}
    </FilterSection>
  );
};

export default OwnerCompanyFilter;
