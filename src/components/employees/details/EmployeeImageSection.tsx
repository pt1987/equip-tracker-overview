
import { motion } from "framer-motion";
import { Employee } from "@/lib/types";

interface EmployeeImageSectionProps {
  employee: Employee;
}

export default function EmployeeImageSection({ employee }: EmployeeImageSectionProps) {
  // Ensure employee image is always displayed
  const getEmployeeImage = () => {
    if (!employee.imageUrl || employee.imageUrl.trim() === '') {
      return 'https://avatar.vercel.sh/' + employee.id;
    }
    return employee.imageUrl;
  };

  return (
    <div className="w-full md:w-1/4 flex-shrink-0">
      <div className="aspect-square bg-muted rounded-full overflow-hidden">
        <motion.img 
          src={getEmployeeImage()} 
          alt={`${employee.firstName} ${employee.lastName}`}
          className="w-full h-full object-cover object-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          onError={(e) => {
            // Fallback if the image fails to load
            (e.target as HTMLImageElement).src = 'https://avatar.vercel.sh/' + employee.id;
          }}
        />
      </div>
    </div>
  );
}
