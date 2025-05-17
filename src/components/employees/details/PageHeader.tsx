
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function PageHeader() {
  return (
    <div className="mb-6">
      <Link 
        to="/employees"
        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft size={16} />
        <span>Back to employees</span>
      </Link>
    </div>
  );
}
