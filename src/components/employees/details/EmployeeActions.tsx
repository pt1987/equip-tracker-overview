
import { useState } from "react";
import { Pencil, Trash } from "lucide-react";
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

interface EmployeeActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function EmployeeActions({ onEdit, onDelete }: EmployeeActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  return (
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
  );
}
