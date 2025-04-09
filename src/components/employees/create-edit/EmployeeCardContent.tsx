
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmployeeFormFields from "@/components/employees/EmployeeForm";
import { EmployeeImagePreview } from "./EmployeeImagePreview";

interface EmployeeCardContentProps {
  isEditing: boolean;
  isSubmitting: boolean;
  imagePreview: string | null;
  onImageChange: (file: File) => void;
  onCancel: () => void;
}

export function EmployeeCardContent({
  isEditing,
  isSubmitting,
  imagePreview,
  onImageChange,
  onCancel
}: EmployeeCardContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mitarbeiter Details</CardTitle>
        <CardDescription>
          Geben Sie die Informationen für diesen Mitarbeiter ein
        </CardDescription>
      </CardHeader>
      <CardContent className="card-content">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="col-span-1">
            <EmployeeImagePreview
              initialImage={imagePreview}
              onImageChange={onImageChange}
            />
          </div>
          <div className="col-span-2">
            <EmployeeFormFields />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Abbrechen
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting 
            ? isEditing ? "Wird gespeichert..." : "Wird erstellt..." 
            : isEditing ? "Speichern" : "Erstellen"}
        </Button>
      </CardFooter>
    </Card>
  );
}
