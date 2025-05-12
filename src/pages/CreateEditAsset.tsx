
import { useQuery } from "@tanstack/react-query";
import PageTransition from "@/components/layout/PageTransition";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { getEmployees } from "@/data/employees";
import { useAssetForm } from "@/hooks/useAssetForm";
import FormTabs from "@/components/assets/create-edit/FormTabs";
import FormActions from "@/components/assets/create-edit/FormActions";
import FormHeader from "@/components/assets/create-edit/FormHeader";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function CreateEditAsset() {
  const { toast } = useToast();
  
  const {
    isEditing,
    form,
    activeTab,
    setActiveTab,
    onSubmit,
    handleCancel,
    mutation,
    assets
  } = useAssetForm();

  // Display toast when form is submitted successfully
  useEffect(() => {
    if (mutation.isSuccess) {
      toast({
        title: isEditing ? "Asset aktualisiert" : "Asset erstellt",
        description: `${form.getValues("manufacturer")} ${form.getValues("model")} wurde erfolgreich ${isEditing ? 'aktualisiert' : 'erstellt'}.`,
      });
    }
  }, [mutation.isSuccess, form, isEditing, toast]);

  // Display error toast when mutation fails
  useEffect(() => {
    if (mutation.isError) {
      toast({
        variant: "destructive",
        title: isEditing ? "Fehler beim Aktualisieren" : "Fehler beim Erstellen",
        description: "Das Asset konnte nicht gespeichert werden.",
      });
    }
  }, [mutation.isError, isEditing, toast]);

  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees
  });

  const handleFormSubmit = form.handleSubmit((data) => {
    console.log("Form submitted with data:", data);
    onSubmit(data);
  });

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col gap-8">
          <FormHeader isEditing={isEditing} />

          <Form {...form}>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Asset Details</CardTitle>
                  <CardDescription>
                    Geben Sie die grundlegenden Informationen für dieses Asset ein
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormTabs 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    assets={assets} 
                    employees={employees} 
                  />
                </CardContent>
                <CardFooter>
                  <FormActions 
                    isEditing={isEditing} 
                    onCancel={handleCancel} 
                    isPending={mutation.isPending} 
                  />
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </PageTransition>
  );
}
