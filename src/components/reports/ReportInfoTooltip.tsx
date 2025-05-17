
import React from "react";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ReportInfoTooltipProps {
  title: string;
  description: string;
  showAsDialog?: boolean;
}

export function ReportInfoTooltip({ title, description, showAsDialog = false }: ReportInfoTooltipProps) {
  if (showAsDialog) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Info</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="text-left mt-2 whitespace-pre-line">
              {description}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Info</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm text-left p-4 whitespace-pre-line">
          <p className="font-medium mb-1">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
