
import { useNavigate } from "react-router-dom";
import { AlertCircle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AssetNotFound() {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-6 py-4 max-w-7xl">
      <div className="flex flex-col items-center justify-center text-center py-10">
        <AlertCircle size={64} className="text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Asset nicht gefunden</h2>
        <p className="text-muted-foreground mb-6">
          Das angeforderte Asset konnte nicht gefunden werden.
        </p>
        <Button onClick={() => navigate("/assets")}>
          <ChevronLeft size={16} className="mr-2" />
          Zurück zur Übersicht
        </Button>
      </div>
    </div>
  );
}
