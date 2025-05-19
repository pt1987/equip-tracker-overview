
import { motion } from "framer-motion";
import { Employee } from "@/lib/types";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

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
    <div className="flex justify-center md:justify-start">
      <div className="relative w-32 h-32 md:w-48 md:h-48 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ImageWithFallback 
            src={getEmployeeImage()} 
            alt={`${employee.firstName} ${employee.lastName}`}
            className="w-full h-full object-cover object-center"
            fallbackSrc={`https://avatar.vercel.sh/${employee.id}`}
          />
        </motion.div>
      </div>
    </div>
  );
}
