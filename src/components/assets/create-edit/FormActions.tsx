
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isEditing: boolean;
  onCancel: () => void;
  isPending: boolean;
}

export default function FormActions({ isEditing, onCancel, isPending }: FormActionsProps) {
  return (
    <div className="flex justify-between">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        Abbrechen
      </Button>
      <Button 
        type="submit"
        disabled={isPending}
      >
        {isPending ? 'Wird gespeichert...' : (isEditing ? "Speichern" : "Erstellen")}
      </Button>
    </div>
  );
}
