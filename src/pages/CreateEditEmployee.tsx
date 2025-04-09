
import { useParams } from "react-router-dom";
import PageTransition from "@/components/layout/PageTransition";
import { useEmployeeForm } from "@/hooks/useEmployeeForm";
import { EmployeeFormContainer } from "@/components/employees/create-edit/EmployeeFormContainer";
import { EmployeeCardContent } from "@/components/employees/create-edit/EmployeeCardContent";

export default function CreateEditEmployee() {
  const { id } = useParams();
  const { 
    isEditing,
    isLoading,
    isSubmitting,
    employee,
    imagePreview,
    handleImageChange,
    handleSubmit,
    handleCancel
  } = useEmployeeForm(id);

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {isEditing ? "Mitarbeiter bearbeiten" : "Neuen Mitarbeiter anlegen"}
              </h1>
              <p className="text-muted-foreground">
                {isEditing 
                  ? "Aktualisieren Sie die Informationen des ausgewählten Mitarbeiters" 
                  : "Fügen Sie einen neuen Mitarbeiter zur Datenbank hinzu"}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : (
            <EmployeeFormContainer
              employee={employee}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            >
              <EmployeeCardContent
                isEditing={isEditing}
                isSubmitting={isSubmitting}
                imagePreview={imagePreview}
                onImageChange={handleImageChange}
                onCancel={handleCancel}
              />
            </EmployeeFormContainer>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
