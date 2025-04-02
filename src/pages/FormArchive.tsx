
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/layout/PageTransition";
import { EmployeeForm, FormType, FormStatus } from "@/lib/types";
import { getAllForms, searchForms } from "@/data/employeeForms";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  CalendarIcon,
  Search,
  FileText,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  FileDown,
  Laptop,
  User,
  Calendar as CalendarIcon2,
  X,
} from "lucide-react";

const FormArchive = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [formType, setFormType] = useState<FormType | "">("");
  const [formStatus, setFormStatus] = useState<FormStatus | "">("");
  const [forms, setForms] = useState<EmployeeForm[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [filteredForms, setFilteredForms] = useState<EmployeeForm[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "onboarding" | "offboarding">("all");
  const [showFilters, setShowFilters] = useState(false);

  // Load forms
  useEffect(() => {
    const allForms = getAllForms();
    setForms(allForms);
    setFilteredForms(allForms);
  }, []);

  // Apply filters when any filter changes
  useEffect(() => {
    let filtered = forms;
    
    // Apply tab filter
    if (activeTab === "onboarding") {
      filtered = filtered.filter(form => form.formType === "onboarding");
    } else if (activeTab === "offboarding") {
      filtered = filtered.filter(form => form.formType === "offboarding");
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(form => 
        form.employeeName.toLowerCase().includes(term) ||
        form.assets.some(asset => 
          asset.assetName.toLowerCase().includes(term) ||
          (asset.serialNumber && asset.serialNumber.toLowerCase().includes(term))
        )
      );
    }
    
    // Apply type filter
    if (formType) {
      filtered = filtered.filter(form => form.formType === formType);
    }
    
    // Apply status filter
    if (formStatus) {
      filtered = filtered.filter(form => form.status === formStatus);
    }
    
    // Apply date range
    if (startDate) {
      filtered = filtered.filter(form => 
        new Date(form.createdDate) >= startDate
      );
    }
    
    if (endDate) {
      const endDatePlusOne = new Date(endDate);
      endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
      filtered = filtered.filter(form => 
        new Date(form.createdDate) < endDatePlusOne
      );
    }
    
    setFilteredForms(filtered);
  }, [searchTerm, formType, formStatus, startDate, endDate, forms, activeTab]);

  const clearFilters = () => {
    setSearchTerm("");
    setFormType("");
    setFormStatus("");
    setStartDate(undefined);
    setEndDate(undefined);
    setShowFilters(false);
  };

  const getStatusBadge = (status: FormStatus) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline" className="bg-blue-100 text-blue-700">Entwurf</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-700">Ausstehend</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-700">Abgeschlossen</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-700">Abgebrochen</Badge>;
      default:
        return null;
    }
  };

  const getFormTypeBadge = (type: FormType) => {
    switch (type) {
      case "onboarding":
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-700">Onboarding</Badge>;
      case "offboarding":
        return <Badge variant="outline" className="bg-purple-100 text-purple-700">Offboarding</Badge>;
      default:
        return null;
    }
  };

  const handleFormClick = (formId: string) => {
    navigate(`/form/${formId}`);
  };

  return (
    <PageTransition>
      <div className="p-3 md:p-4 xl:p-6 space-y-6 max-w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Formular-Archiv</h1>
            <p className="text-muted-foreground mt-1">
              Alle Onboarding- und Offboarding-Formulare
            </p>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="all">Alle</TabsTrigger>
              <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
              <TabsTrigger value="offboarding">Offboarding</TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Suche nach Mitarbeiter oder Geräten..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter size={16} /> Filter {showFilters ? <X size={16} /> : null}
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="glass-card p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Filter</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Zurücksetzen
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Formulartyp</label>
                  <Select
                    value={formType}
                    onValueChange={(value) => setFormType(value as FormType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Alle Typen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Alle Typen</SelectItem>
                      <SelectItem value="onboarding">Onboarding</SelectItem>
                      <SelectItem value="offboarding">Offboarding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <Select
                    value={formStatus}
                    onValueChange={(value) => setFormStatus(value as FormStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Alle Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Alle Status</SelectItem>
                      <SelectItem value="draft">Entwurf</SelectItem>
                      <SelectItem value="pending">Ausstehend</SelectItem>
                      <SelectItem value="completed">Abgeschlossen</SelectItem>
                      <SelectItem value="cancelled">Abgebrochen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Von Datum</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, "dd.MM.yyyy")
                        ) : (
                          <span>Von Datum wählen</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        locale={de}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bis Datum</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                          format(endDate, "dd.MM.yyyy")
                        ) : (
                          <span>Bis Datum wählen</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        locale={de}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}

          <TabsContent value="all" className="mt-0">
            <FormList 
              forms={filteredForms}
              getStatusBadge={getStatusBadge}
              getFormTypeBadge={getFormTypeBadge}
              onFormClick={handleFormClick}
            />
          </TabsContent>
          
          <TabsContent value="onboarding" className="mt-0">
            <FormList 
              forms={filteredForms}
              getStatusBadge={getStatusBadge}
              getFormTypeBadge={getFormTypeBadge}
              onFormClick={handleFormClick}
            />
          </TabsContent>
          
          <TabsContent value="offboarding" className="mt-0">
            <FormList 
              forms={filteredForms}
              getStatusBadge={getStatusBadge}
              getFormTypeBadge={getFormTypeBadge}
              onFormClick={handleFormClick}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

interface FormListProps {
  forms: EmployeeForm[];
  getStatusBadge: (status: FormStatus) => JSX.Element | null;
  getFormTypeBadge: (type: FormType) => JSX.Element | null;
  onFormClick: (formId: string) => void;
}

const FormList = ({ forms, getStatusBadge, getFormTypeBadge, onFormClick }: FormListProps) => {
  if (forms.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
          <FileText size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">Keine Formulare gefunden</h3>
        <p className="text-muted-foreground mb-6">
          Es wurden keine Formulare gefunden, die den aktuellen Filterkriterien entsprechen.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {forms.map((form) => (
        <div
          key={form.id}
          className="glass-card p-4 hover:bg-secondary/10 transition-colors cursor-pointer"
          onClick={() => onFormClick(form.id)}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-secondary/80">
                {form.formType === "onboarding" ? (
                  <Laptop size={18} />
                ) : (
                  <FileDown size={18} />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{form.employeeName}</h3>
                  {getFormTypeBadge(form.formType)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {form.assets.length} {form.assets.length === 1 ? "Gerät" : "Geräte"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User size={16} className="text-muted-foreground" />
                <span className="text-sm">{form.employeeName}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <CalendarIcon2 size={16} className="text-muted-foreground" />
                <span className="text-sm">{new Date(form.createdDate).toLocaleDateString()}</span>
              </div>
              
              <div>
                {getStatusBadge(form.status)}
              </div>
              
              {form.documentUrl && (
                <Button variant="ghost" size="icon" className="text-primary">
                  <Download size={16} />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FormArchive;
