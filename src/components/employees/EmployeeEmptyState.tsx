
import { Users } from "lucide-react";

interface EmployeeEmptyStateProps {
  clearFilters: () => void;
}

const EmployeeEmptyState = ({ clearFilters }: EmployeeEmptyStateProps) => {
  return (
    <div className="glass-card p-12 text-center">
      <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
        <Users size={32} className="text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">No employees found</h3>
      <p className="text-muted-foreground mb-6">
        There are no employees matching your current filters.
      </p>
      <button
        onClick={clearFilters}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        Clear filters
      </button>
    </div>
  );
};

export default EmployeeEmptyState;
