
import { AssetHistoryAction } from "@/lib/types";
import { 
  ShoppingCart, 
  UserCheck, 
  RefreshCcw, 
  RotateCcw,
  Clock,
  Truck,
  Wrench,
  Trash2,
  Edit,
  Calendar
} from "lucide-react";
import React from "react";

export const getActionIcon = (action: AssetHistoryAction): React.ReactNode => {
  switch (action) {
    case "purchase":
      return <ShoppingCart size={18} className="text-primary" />;
    case "delivery":
      return <Truck size={18} className="text-primary" />;
    case "assign":
      return <UserCheck size={18} className="text-primary" />;
    case "status_change":
      return <RefreshCcw size={18} className="text-primary" />;
    case "repair":
      return <Wrench size={18} className="text-primary" />;
    case "return":
      return <RotateCcw size={18} className="text-primary" />;
    case "dispose":
      return <Trash2 size={18} className="text-primary" />;
    case "edit":
      return <Edit size={18} className="text-primary" />;
    case "booking":
      return <Calendar size={18} className="text-primary" />;
    default:
      return <Clock size={18} className="text-primary" />;
  }
};

export const getActionLabel = (action: AssetHistoryAction): string => {
  switch (action) {
    case "purchase":
      return "Kauf";
    case "delivery":
      return "Lieferung";
    case "assign":
      return "Zugewiesen";
    case "status_change":
      return "Status geändert";
    case "repair":
      return "Zur Reparatur";
    case "return":
      return "Zurückgegeben";
    case "dispose":
      return "Entsorgt";
    case "edit":
      return "Bearbeitet";
    case "booking":
      return "Buchung";
    default:
      return action;
  }
};
