
import { useState } from "react";
import { Asset, AssetReview } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, FileCheck, AlertCircle, Calendar, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Mock data for review history - in a real app, this would come from the database
const mockReviews: AssetReview[] = [
  {
    id: "1",
    assetId: "asset-1",
    reviewerId: "user-1",
    reviewDate: "2023-11-15",
    findings: "All security settings compliant with policies",
    recommendations: "None at this time",
    nextReviewDate: "2024-05-15",
    isCompliant: true
  },
  {
    id: "2",
    assetId: "asset-1",
    reviewerId: "user-2",
    reviewDate: "2023-05-10",
    findings: "Missing encryption on local storage",
    recommendations: "Enable BitLocker encryption",
    nextReviewDate: "2023-11-15",
    isCompliant: false
  }
];

interface AssetReviewHistoryProps {
  asset: Asset;
  onReviewAdded: (review: AssetReview) => void;
}

export default function AssetReviewHistory({ asset, onReviewAdded }: AssetReviewHistoryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviews, setReviews] = useState<AssetReview[]>(mockReviews.filter(r => r.assetId === asset.id));
  const [newReview, setNewReview] = useState<Partial<AssetReview>>({
    assetId: asset.id,
    reviewerId: "current-user", // In a real app, this would be the current user's ID
    reviewDate: new Date().toISOString().split('T')[0],
    findings: "",
    recommendations: "",
    nextReviewDate: "",
    isCompliant: true
  });
  const { toast } = useToast();

  const handleChange = (field: string, value: any) => {
    setNewReview(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // In a real app, this would save to the database
    const review: AssetReview = {
      id: crypto.randomUUID(),
      assetId: asset.id,
      reviewerId: newReview.reviewerId!,
      reviewDate: newReview.reviewDate!,
      findings: newReview.findings || "",
      recommendations: newReview.recommendations || "",
      nextReviewDate: newReview.nextReviewDate || "",
      isCompliant: newReview.isCompliant || false
    };
    
    setReviews(prev => [review, ...prev]);
    onReviewAdded(review);
    setIsDialogOpen(false);
    
    toast({
      title: "Überprüfung hinzugefügt",
      description: "Die Asset-Überprüfung wurde erfolgreich hinzugefügt",
    });
    
    // Reset form
    setNewReview({
      assetId: asset.id,
      reviewerId: "current-user",
      reviewDate: new Date().toISOString().split('T')[0],
      findings: "",
      recommendations: "",
      nextReviewDate: "",
      isCompliant: true
    });
  };
  
  if (reviews.length === 0) {
    return (
      <div className="bg-muted/20 rounded-lg p-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileCheck className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">Keine Überprüfungen</h3>
        <p className="text-muted-foreground mb-4">
          Für dieses Asset wurden noch keine Sicherheitsüberprüfungen dokumentiert.
        </p>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Überprüfung hinzufügen
        </Button>
        
        <AddReviewDialog 
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          review={newReview}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Überprüfungshistorie</h3>
        <Button size="sm" onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Neue Überprüfung
        </Button>
      </div>
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className={`rounded-lg border p-4 ${review.isCompliant ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/50" : "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/50"}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {review.isCompliant ? (
                  <FileCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                )}
                <span className="font-medium">
                  {review.isCompliant ? "Konform" : "Nicht konform"}
                </span>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(review.reviewDate)}
              </div>
            </div>
            
            <div className="space-y-2 mt-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Feststellungen:</p>
                <p className="text-sm">{review.findings}</p>
              </div>
              
              {review.recommendations && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Empfehlungen:</p>
                  <p className="text-sm">{review.recommendations}</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-2 border-t border-border">
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <User className="h-3 w-3" />
                Reviewer ID: {review.reviewerId}
              </div>
              
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <Calendar className="h-3 w-3" />
                Nächste Überprüfung: {formatDate(review.nextReviewDate)}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <AddReviewDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        review={newReview}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

interface AddReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  review: Partial<AssetReview>;
  onChange: (field: string, value: any) => void;
  onSubmit: () => void;
}

function AddReviewDialog({ isOpen, onClose, review, onChange, onSubmit }: AddReviewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Neue Sicherheitsüberprüfung</DialogTitle>
          <DialogDescription>
            Erfassen Sie die Ergebnisse einer ISO 27001 Sicherheitsüberprüfung für dieses Asset.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="review-date">Prüfungsdatum</Label>
              <Input
                id="review-date"
                type="date"
                value={review.reviewDate || ""}
                onChange={(e) => onChange("reviewDate", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="next-review-date">Nächste Prüfung</Label>
              <Input
                id="next-review-date"
                type="date"
                value={review.nextReviewDate || ""}
                onChange={(e) => onChange("nextReviewDate", e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="findings">Feststellungen</Label>
            <Textarea
              id="findings"
              placeholder="Beschreiben Sie die Feststellungen der Sicherheitsüberprüfung"
              value={review.findings || ""}
              onChange={(e) => onChange("findings", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="recommendations">Empfehlungen</Label>
            <Textarea
              id="recommendations"
              placeholder="Empfehlungen zur Verbesserung der Sicherheit"
              value={review.recommendations || ""}
              onChange={(e) => onChange("recommendations", e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is-compliant"
              checked={review.isCompliant}
              onCheckedChange={(checked) => onChange("isCompliant", checked)}
            />
            <Label htmlFor="is-compliant">Asset ist konform mit ISO 27001</Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Abbrechen</Button>
          <Button onClick={onSubmit}>Überprüfung speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
