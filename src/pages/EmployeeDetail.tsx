
import { useParams } from "react-router-dom";
import PageTransition from "@/components/layout/PageTransition";
import { useEmployeeDetail } from "@/hooks/useEmployeeDetail";
import { EmployeeDetailLoading, EmployeeNotFound } from "@/components/employees/details/EmployeeLoadingState";
import PageHeader from "@/components/employees/details/PageHeader";
import EmployeeDetailContainer from "@/components/employees/details/EmployeeDetailContainer";

const EmployeeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    employee, 
    assets, 
    loading, 
    handleSave, 
    handleDelete,
    fetchEmployeeData
  } = useEmployeeDetail(id);

  if (loading) {
    return <EmployeeDetailLoading />;
  }
  
  if (!employee) {
    return <EmployeeNotFound />;
  }

  return (
    <PageTransition>
      <div className="p-3 md:p-4 xl:p-6 space-y-6 max-w-full pb-24 mt-12 md:mt-0">
        <PageHeader />
        
        <EmployeeDetailContainer
          employee={employee}
          assets={assets}
          onEmployeeUpdated={fetchEmployeeData}
        />
      </div>
    </PageTransition>
  );
};

export default EmployeeDetail;
