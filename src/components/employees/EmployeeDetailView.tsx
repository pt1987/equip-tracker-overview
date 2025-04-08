
import { useState } from "react";
import { Employee } from "@/lib/types";
import { formatDate, calculateEmploymentDuration, formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { CalendarClock, Euro, PackageIcon, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EmployeeDetailViewProps {
  employee: Employee;
  assets: any[];
  onEdit: () => void;
  onDelete: () => void;
}

export default function EmployeeDetailView({ 
  employee, 
  assets, 
  onEdit,
  onDelete
}: EmployeeDetailViewProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Calculate budget usage
  const budgetPercentage = Math.min(100, Math.round((employee.usedBudget / employee.budget) * 100));

  // Ensure employee image is always displayed
  const getEmployeeImage = () => {
    if (!employee.imageUrl || employee.imageUrl.trim() === '') {
      return 'https://avatar.vercel.sh/' + employee.id;
    }
    return employee.imageUrl;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/4 flex-shrink-0">
        <div className="aspect-square bg-muted rounded-full overflow-hidden">
          <motion.img 
            src={getEmployeeImage()} 
            alt={`${employee.firstName} ${employee.lastName}`}
            className="w-full h-full object-cover object-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onError={(e) => {
              // Fallback if the image fails to load
              (e.target as HTMLImageElement).src = 'https://avatar.vercel.sh/' + employee.id;
            }}
          />
        </div>
      </div>
      
      <div className="flex-1">
        <div className="relative">
          <div className="absolute top-0 right-0 flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={onEdit} 
                    className="p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <Pencil size={18} className="text-muted-foreground hover:text-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Bearbeiten</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <button className="p-2 rounded-md hover:bg-muted transition-colors">
                        <Trash size={18} className="text-muted-foreground hover:text-destructive" />
                      </button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Löschen</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Diese Aktion kann nicht rückgängig gemacht werden. Der Mitarbeiter und alle zugehörigen Daten werden dauerhaft gelöscht.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>
                    Löschen bestätigen
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          <div className="inline-flex items-center px-2 py-1 mb-2 rounded-full bg-secondary text-xs font-medium">
            {employee.cluster}
          </div>
          <h1 className="text-2xl font-bold mb-1">
            {employee.firstName} {employee.lastName}
          </h1>
          <p className="text-muted-foreground mb-6">{employee.position}</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-blue-100">
              <CalendarClock size={16} className="text-blue-700" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Startdatum</p>
              <p className="font-medium">{formatDate(employee.startDate)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-blue-100">
              <CalendarClock size={16} className="text-blue-700" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Beschäftigungsdauer</p>
              <p className="font-medium">{calculateEmploymentDuration(employee.startDate)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-purple-100">
              <PackageIcon size={16} className="text-purple-700" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Geräte</p>
              <p className="font-medium">{assets.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-green-100">
              <Euro size={16} className="text-green-700" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Budget</p>
              <p className="font-medium">{formatCurrency(employee.budget)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
