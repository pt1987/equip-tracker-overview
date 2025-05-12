
import React from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface FormActionsProps {
  isEditing: boolean;
  onCancel: () => void;
  isPending: boolean;
}

export default function FormActions({ isEditing, onCancel, isPending }: FormActionsProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'justify-between'} w-full`}>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        className={isMobile ? "w-full" : ""}
      >
        Abbrechen
      </Button>
      <Button 
        type="submit"
        disabled={isPending}
        className={isMobile ? "w-full" : ""}
      >
        {isPending ? 'Wird gespeichert...' : (isEditing ? "Speichern" : "Erstellen")}
      </Button>
    </div>
  );
}
