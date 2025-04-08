
import { Asset } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  CalendarClock, 
  Euro,
  Laptop,
  Smartphone,
  Tablet,
  Mouse,
  Keyboard,
  Package
} from "lucide-react";

interface AssetCardProps {
  asset: Asset;
  index?: number;
}

export default function AssetCard({ asset, index = 0 }: AssetCardProps) {
  // Fetch employee data from Supabase if there is an employeeId
  const { data: employee } = useQuery({
    queryKey: ["employee", asset.employeeId],
    queryFn: async () => {
      if (!asset.employeeId) return null;
      
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', asset.employeeId)
        .single();
      
      if (error || !data) return null;
      
      return {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        imageUrl: data.image_url
      };
    },
    enabled: !!asset.employeeId,
  });
  
  const getAssetTypeLabel = (type: Asset["type"]) => {
    switch (type) {
      case "laptop": return "Laptop";
      case "smartphone": return "Smartphone";
      case "tablet": return "Tablet";
      case "mouse": return "Mouse";
      case "keyboard": return "Keyboard";
      case "accessory": return "Accessory";
      default: return "Other";
    }
  };
  
  // Format date to display nicely
  const purchaseDate = new Date(asset.purchaseDate).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  
  // Get appropriate icon based on asset type
  const getAssetIcon = () => {
    switch (asset.type) {
      case "laptop": return <Laptop className="w-12 h-12 text-primary/70" />;
      case "smartphone": return <Smartphone className="w-12 h-12 text-primary/70" />;
      case "tablet": return <Tablet className="w-12 h-12 text-primary/70" />;
      case "mouse": return <Mouse className="w-12 h-12 text-primary/70" />;
      case "keyboard": return <Keyboard className="w-12 h-12 text-primary/70" />;
      case "accessory": 
      default: return <Package className="w-12 h-12 text-primary/70" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link to={`/asset/${asset.id}`} className="block w-full group">
        <div className="glass-card overflow-hidden transition-all duration-300 hover:shadow-card group-hover:border-primary/20">
          <div className="relative h-40 overflow-hidden bg-muted">
            {asset.imageUrl ? (
              <img 
                src={asset.imageUrl} 
                alt={asset.name}
                className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                {getAssetIcon()}
              </div>
            )}
            <div className="absolute top-2 right-2">
              <StatusBadge status={asset.status} />
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="inline-flex items-center px-2 py-1 mb-2 rounded-full bg-secondary text-xs font-medium">
                  {getAssetTypeLabel(asset.type)}
                </div>
                <h3 className="font-medium line-clamp-1 text-balance group-hover:text-primary transition-colors">
                  {asset.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {asset.manufacturer} {asset.model}
                </p>
              </div>
            </div>
            
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <CalendarClock size={14} />
                  <span className="text-xs">{purchaseDate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Euro size={14} />
                  <span className="text-xs font-medium">{formatCurrency(asset.price)}</span>
                </div>
              </div>
              
              {employee && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden bg-muted">
                    {employee.imageUrl ? (
                      <img 
                        src={employee.imageUrl} 
                        alt={`${employee.firstName} ${employee.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-xs font-medium">
                        {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {employee.firstName} {employee.lastName}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
