
import React from "react";

interface FormHeaderProps {
  isEditing: boolean;
}

export default function FormHeader({ isEditing }: FormHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? "Asset bearbeiten" : "Neues Asset anlegen"}
        </h1>
        <p className="text-muted-foreground">
          {isEditing 
            ? "Aktualisieren Sie die Informationen des ausgewählten Assets" 
            : "Fügen Sie ein neues Asset zur Inventarliste hinzu"}
        </p>
      </div>
    </div>
  );
}
