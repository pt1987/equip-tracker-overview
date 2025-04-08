
import { AssetStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: AssetStatus;
  size?: "sm" | "md" | "lg";
}

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const getStatusConfig = (status: AssetStatus) => {
    switch (status) {
      case "ordered":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          label: "Bestellt"
        };
      case "delivered":
        return {
          bg: "bg-purple-100",
          text: "text-purple-800",
          label: "Geliefert"
        };
      case "in_use":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          label: "In Gebrauch"
        };
      case "defective":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          label: "Defekt"
        };
      case "repair":
        return {
          bg: "bg-amber-100",
          text: "text-amber-800",
          label: "Reparatur"
        };
      case "pool":
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          label: "Pool"
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          label: "Unbekannt"
        };
    }
  };

  const { bg, text, label } = getStatusConfig(status);

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        bg,
        text,
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-2.5 py-1 text-xs",
        size === "lg" && "px-3 py-1 text-sm"
      )}
    >
      <span className={cn(
        "w-1.5 h-1.5 rounded-full mr-1",
        status === "in_use" && "bg-green-500",
        status === "ordered" && "bg-blue-500",
        status === "delivered" && "bg-purple-500",
        status === "defective" && "bg-red-500",
        status === "repair" && "bg-amber-500",
        status === "pool" && "bg-gray-500",
      )} />
      {label}
    </div>
  );
}
