
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, QrCode } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import QRCodeDialog from "../QRCodeDialog";

interface EmployeeActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function EmployeeActions({ onEdit, onDelete }: EmployeeActionsProps) {
  return (
    <div className="absolute top-0 right-0 flex items-center gap-2">
      <QRCodeDialog currentUrl={window.location.href} />
      
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={onEdit}>
        <Pencil className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Löschen</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
