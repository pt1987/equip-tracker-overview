
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, Check } from "lucide-react";
import SearchFilter from "@/components/shared/SearchFilter";

interface EmployeeFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedClusters: string[];
  setSelectedClusters: (clusters: string[]) => void;
  clusters: string[];
  clearFilters: () => void;
}

const EmployeeFilters = ({
  searchTerm,
  setSearchTerm,
  selectedClusters,
  setSelectedClusters,
  clusters,
  clearFilters
}: EmployeeFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);
  
  const toggleClusterFilter = (cluster: string) => {
    if (selectedClusters.includes(cluster)) {
      setSelectedClusters(selectedClusters.filter(c => c !== cluster));
    } else {
      setSelectedClusters([...selectedClusters, cluster]);
    }
  };
  
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <SearchFilter 
          placeholder="Search employees..." 
          onSearch={setSearchTerm}
          className="flex-1"
        />
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-secondary transition-colors"
        >
          <SlidersHorizontal size={18} />
          <span>Filters</span>
          {selectedClusters.length > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-primary text-primary-foreground">
              {selectedClusters.length}
            </span>
          )}
        </button>
      </div>
      
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="glass-card p-4 mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <X size={14} />
              Clear all
            </button>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Cluster</h4>
            <div className="flex flex-wrap gap-2">
              {clusters.map(cluster => (
                <button
                  key={cluster}
                  onClick={() => toggleClusterFilter(cluster)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    selectedClusters.includes(cluster)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cluster}
                  {selectedClusters.includes(cluster) && (
                    <Check size={14} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default EmployeeFilters;
