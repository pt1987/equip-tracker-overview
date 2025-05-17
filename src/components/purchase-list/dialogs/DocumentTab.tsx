
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { memo } from "react";

const DocumentTab = memo(() => {
  return (
    <div className="py-4 flex flex-col items-center justify-center">
      <div className="bg-muted p-6 rounded-md text-center">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-2 text-lg font-medium">Beleg anzeigen</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          Originaler Beleg im PDF-Format
        </p>
        <Button variant="outline">Dokument herunterladen</Button>
      </div>
    </div>
  );
});

DocumentTab.displayName = "DocumentTab";

export default DocumentTab;
