
import { Link } from "react-router-dom";

export function EmployeeDetailLoading() {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 md:ml-64 p-8 flex items-center justify-center">
        <div className="animate-pulse-soft">Loading employee details...</div>
      </div>
    </div>
  );
}

export function EmployeeNotFound() {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 md:ml-32 p-3 md:p-4 xl:p-6 space-y-6 max-w-full">
        <div className="glass-card p-12 text-center">
          <h2 className="text-xl font-medium mb-4">Employee not found</h2>
          <p className="text-muted-foreground mb-6">
            The employee you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            to="/employees"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Back to employees
          </Link>
        </div>
      </div>
    </div>
  );
}
