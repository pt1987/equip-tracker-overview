
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import PageTransition from "@/components/layout/PageTransition";
import { AssetChecklistItem, FormStatus } from "@/lib/types";
import { getFormById, updateEmployeeForm, completeForm } from "@/data/employeeForms";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  ChevronLeft, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Download, 
  Send, 
  Save, 
  Pencil, 
  FileText, 
  Laptop, 
  Smartphone, 
  Tablet, 
  Mouse, 
  Keyboard, 
  Package,
  X,
  Check,
  AlertCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import SignatureCanvas from "react-signature-canvas";

const FormDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState("");
  const [signature, setSignature] = useState<string | null>(null);
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [signaturePad, setSignaturePad] = useState<SignatureCanvas | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  useEffect(() => {
    if (id) {
      const formData = getFormById(id);
      if (formData) {
        setForm(formData);
        setNotes(formData.notes || "");
      }
      setLoading(false);
    }
  }, [id]);
  
  if (loading) {
    return (
      <PageTransition>
        <div className="p-3 md:p-4 xl:p-6 space-y-6 max-w-full">
          <div className="animate-pulse">Loading form...</div>
        </div>
      </PageTransition>
    );
  }
  
  if (!form) {
    return (
      <PageTransition>
        <div className="p-3 md:p-4 xl:p-6 space-y-6 max-w-full">
          <div className="glass-card p-12 text-center">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
              <FileText size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Formular nicht gefunden</h3>
            <p className="text-muted-foreground mb-6">
              Das gesuchte Formular existiert nicht oder wurde gelöscht.
            </p>
            <Link 
              to="/forms"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              Zurück zur Übersicht
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }
  
  const handleChecklistChange = (assetIndex: number, checklistIndex: number) => {
    const updatedForm = { ...form };
    const item = updatedForm.assets[assetIndex].checklistItems[checklistIndex];
    item.checked = !item.checked;
    
    setForm(updatedForm);
    
    // If not in edit mode, save the changes
    if (!isEditing) {
      updateEmployeeForm(updatedForm);
    }
  };
  
  const handleSave = () => {
    const updatedForm = {
      ...form,
      notes,
    };
    
    const result = updateEmployeeForm(updatedForm);
    setForm(result);
    setIsEditing(false);
    
    toast({
      title: "Änderungen gespeichert",
      description: "Die Änderungen wurden erfolgreich gespeichert."
    });
  };
  
  const openSignatureDialog = () => {
    setSignatureDialogOpen(true);
  };
  
  const clearSignature = () => {
    if (signaturePad) {
      signaturePad.clear();
    }
  };
  
  const saveSignature = () => {
    if (signaturePad && !signaturePad.isEmpty()) {
      setSignature(signaturePad.toDataURL('image/png'));
      setSignatureDialogOpen(false);
      setConfirmDialogOpen(true);
    } else {
      toast({
        title: "Unterschrift fehlt",
        description: "Bitte unterschreiben Sie das Formular.",
        variant: "destructive"
      });
    }
  };
  
  const handleComplete = () => {
    if (!signature) {
      toast({
        title: "Unterschrift fehlt",
        description: "Bitte unterschreiben Sie das Formular, um es abzuschließen.",
        variant: "destructive"
      });
      return;
    }
    
    const result = completeForm(form.id, signature, notes);
    if (result) {
      setForm(result);
      setConfirmDialogOpen(false);
      
      toast({
        title: "Formular abgeschlossen",
        description: "Das Formular wurde erfolgreich abgeschlossen und als PDF gespeichert."
      });
    }
  };
  
  const getStatusBadge = (status: FormStatus) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-700 flex items-center gap-1">
            <Clock size={14} /> Entwurf
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-700 flex items-center gap-1">
            <Clock size={14} /> Ausstehend
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-700 flex items-center gap-1">
            <CheckCircle2 size={14} /> Abgeschlossen
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-700 flex items-center gap-1">
            <XCircle size={14} /> Abgebrochen
          </Badge>
        );
      default:
        return null;
    }
  };
  
  const getAssetIcon = (assetName: string) => {
    const lowerName = assetName.toLowerCase();
    if (lowerName.includes("laptop") || lowerName.includes("macbook") || lowerName.includes("notebook")) {
      return <Laptop size={18} />;
    } else if (lowerName.includes("phone") || lowerName.includes("iphone") || lowerName.includes("smartphone")) {
      return <Smartphone size={18} />;
    } else if (lowerName.includes("tablet") || lowerName.includes("ipad")) {
      return <Tablet size={18} />;
    } else if (lowerName.includes("mouse") || lowerName.includes("maus")) {
      return <Mouse size={18} />;
    } else if (lowerName.includes("keyboard") || lowerName.includes("tastatur")) {
      return <Keyboard size={18} />;
    } else {
      return <Package size={18} />;
    }
  };
  
  return (
    <PageTransition>
      <div className="p-3 md:p-4 xl:p-6 space-y-6 max-w-full">
        <div className="mb-6">
          <Link
            to="/forms"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Zurück zur Übersicht</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {form.formType === "onboarding" ? "Onboarding" : "Offboarding"}: {form.employeeName}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              {getStatusBadge(form.status)}
              <span className="text-sm text-muted-foreground">
                Erstellt am {new Date(form.createdDate).toLocaleDateString()}
              </span>
              {form.completedDate && (
                <span className="text-sm text-muted-foreground">
                  • Abgeschlossen am {new Date(form.completedDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {form.documentUrl && form.status === "completed" && (
              <Button variant="outline" className="gap-2">
                <Download size={16} />
                PDF herunterladen
              </Button>
            )}
            
            {form.status !== "completed" && form.status !== "cancelled" && (
              <>
                {isEditing ? (
                  <Button variant="outline" onClick={handleSave} className="gap-2">
                    <Save size={16} />
                    Speichern
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
                    <Pencil size={16} />
                    Bearbeiten
                  </Button>
                )}
                
                <Button onClick={openSignatureDialog} className="gap-2">
                  <CheckCircle2 size={16} />
                  Abschließen
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="glass-card p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Geräte Übersicht</h2>
          
          <div className="space-y-6">
            {form.assets.map((asset: any, assetIndex: number) => (
              <Card key={asset.assetId} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-md bg-secondary/30">
                    {getAssetIcon(asset.assetName)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{asset.assetName}</h3>
                    {asset.serialNumber && (
                      <p className="text-sm text-muted-foreground">SN: {asset.serialNumber}</p>
                    )}
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Checkliste</h4>
                      <div className="space-y-2">
                        {asset.checklistItems.map((item: AssetChecklistItem, checklistIndex: number) => (
                          <div key={item.id} className="flex items-center gap-2">
                            <Checkbox
                              id={`${asset.assetId}-${item.id}`}
                              checked={item.checked}
                              onCheckedChange={() => handleChecklistChange(assetIndex, checklistIndex)}
                              disabled={form.status === "completed" || form.status === "cancelled"}
                            />
                            <label
                              htmlFor={`${asset.assetId}-${item.id}`}
                              className="text-sm cursor-pointer"
                            >
                              {item.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {asset.accessories && asset.accessories.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Zubehör</h4>
                        <div className="flex flex-wrap gap-2">
                          {asset.accessories.map((accessory: string, index: number) => (
                            <Badge key={index} variant="secondary">
                              {accessory}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Notizen & Unterschrift</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Notizen</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Zusätzliche Informationen oder Anmerkungen..."
              rows={4}
              disabled={!isEditing && (form.status === "completed" || form.status === "cancelled")}
            />
          </div>
          
          {form.signature && (
            <div>
              <label className="block text-sm font-medium mb-2">Unterschrift</label>
              <div className="p-4 border border-border rounded-md bg-secondary/10">
                <img src={form.signature} alt="Signature" className="max-h-32 mx-auto" />
              </div>
            </div>
          )}
        </div>
        
        {/* Signature Dialog */}
        <Dialog open={signatureDialogOpen} onOpenChange={setSignatureDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Unterschrift</DialogTitle>
              <DialogDescription>
                Bitte unterschreiben Sie im untenstehenden Feld, um das Formular abzuschließen.
              </DialogDescription>
            </DialogHeader>
            
            <div className="border border-border rounded-md bg-background p-1 overflow-hidden">
              <SignatureCanvas
                ref={(ref) => setSignaturePad(ref)}
                canvasProps={{
                  className: "signature-canvas",
                  width: 500,
                  height: 200,
                  style: { width: '100%', height: '200px' }
                }}
              />
            </div>
            
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button type="button" variant="outline" onClick={clearSignature}>
                Löschen
              </Button>
              <Button type="submit" onClick={saveSignature}>
                Bestätigen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Confirmation Dialog */}
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Formular abschließen</DialogTitle>
              <DialogDescription>
                Sind Sie sicher, dass Sie das Formular abschließen möchten? Nach dem Abschluss kann es nicht mehr bearbeitet werden.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle size={18} className="text-amber-500" />
                <p className="text-sm font-medium">Diese Aktion kann nicht rückgängig gemacht werden.</p>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Nach dem Abschluss wird ein PDF-Dokument erstellt und per E-Mail an den Mitarbeiter gesendet.
              </p>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button variant="default" onClick={handleComplete}>
                Formular abschließen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
};

export default FormDetail;
