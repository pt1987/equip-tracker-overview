
import { ChangeEvent, useState } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SearchFilterProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  className?: string;
}

export default function SearchFilter({
  placeholder = "Search...",
  onSearch,
  className,
}: SearchFilterProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchValue("");
    onSearch("");
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-muted-foreground" />
        </div>
        
        <input
          type="text"
          className="bg-white dark:bg-gray-800 border border-border rounded-lg py-2.5 pl-10 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleInputChange}
        />
        
        <AnimatePresence>
          {searchValue && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
              onClick={clearSearch}
              type="button"
            >
              <X size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
