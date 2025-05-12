
import { useQuery } from "@tanstack/react-query";
import PageTransition from "@/components/layout/PageTransition";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { getEmployees } from "@/data/employees";
import { useAssetForm } from "@/hooks/useAssetForm";
import FormTabs from "@/components/assets/create-edit/FormTabs";
import FormActions from "@/components/assets/create-edit/FormActions";
import FormHeader from "@/components/assets/create-edit/FormHeader";

export default function CreateEditAsset() {
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

  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees
  });

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col gap-8">
          <FormHeader isEditing={isEditing} />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
