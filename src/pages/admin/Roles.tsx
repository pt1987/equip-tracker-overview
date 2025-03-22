
import { useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { Plus, Search, Shield, Edit, Trash, MoreHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock roles data
const mockRoles = [
  {
    id: 1,
    name: "Administrator",
    description: "Vollständiger Zugriff auf alle Systemfunktionen",
    userCount: 3,
    permissions: ["users:read", "users:write", "users:delete", "roles:read", "roles:write", "roles:delete", "logs:read"]
  },
  {
    id: 2,
    name: "Editor",
    description: "Kann Inhalte erstellen und bearbeiten, aber keine Benutzer verwalten",
    userCount: 8,
    permissions: ["content:read", "content:write", "users:read"]
  },
  {
    id: 3,
    name: "Benutzer",
    description: "Basiszugriff auf die Plattform, kann nur eigene Daten sehen",
    userCount: 32,
    permissions: ["content:read", "profile:read", "profile:write"]
  },
  {
    id: 4,
    name: "Gast",
    description: "Eingeschränkter Zugriff nur auf öffentliche Inhalte",
    userCount: 105,
    permissions: ["content:read"]
  }
];

// All available permissions
const allPermissions = [
  { id: "users:read", label: "Benutzer anzeigen" },
  { id: "users:write", label: "Benutzer bearbeiten" },
  { id: "users:delete", label: "Benutzer löschen" },
  { id: "roles:read", label: "Rollen anzeigen" },
  { id: "roles:write", label: "Rollen bearbeiten" },
  { id: "roles:delete", label: "Rollen löschen" },
  { id: "logs:read", label: "Logs anzeigen" },
  { id: "content:read", label: "Inhalte anzeigen" },
  { id: "content:write", label: "Inhalte bearbeiten" },
  { id: "profile:read", label: "Profil anzeigen" },
  { id: "profile:write", label: "Profil bearbeiten" }
];

// Role form schema
const roleFormSchema = z.object({
  name: z.string().min(2, { message: "Name muss mindestens 2 Zeichen lang sein." }),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, { message: "Mindestens eine Berechtigung auswählen." }),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

export default function Roles() {
  const [roles, setRoles] = useState(mockRoles);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentRole, setCurrentRole] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  // Function to handle role filtering
  const filteredRoles = roles.filter(role => {
    return searchQuery === "" || 
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Reset form for adding new role
  const handleAddRoleClick = () => {
    form.reset({
      name: "",
      description: "",
      permissions: [],
    });
    setIsEditMode(false);
    setCurrentRole(null);
    setIsAddRoleOpen(true);
  };

  // Handle edit role
  const handleEditRole = (role: any) => {
    form.reset({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    });
    setIsEditMode(true);
    setCurrentRole(role);
    setIsAddRoleOpen(true);
  };

  // Handle delete role
  const handleDeleteRole = (roleId: number) => {
    if (window.confirm("Sind Sie sicher, dass Sie diese Rolle löschen möchten?")) {
      setRoles(roles.filter(role => role.id !== roleId));
      toast({
        title: "Rolle gelöscht",
        description: "Die Rolle wurde erfolgreich gelöscht.",
      });
    }
  };

  // Handle form submission
  const onSubmit = (data: RoleFormValues) => {
    if (isEditMode && currentRole) {
      // Update existing role
      setRoles(roles.map(role => 
        role.id === currentRole.id 
          ? { ...role, name: data.name, description: data.description, permissions: data.permissions }
          : role
      ));
      
      toast({
        title: "Rolle aktualisiert",
        description: `${data.name} wurde erfolgreich aktualisiert.`,
      });
    } else {
      // Add new role
      const newRole = {
        id: roles.length + 1,
        name: data.name,
        description: data.description || "",
        userCount: 0,
        permissions: data.permissions,
      };
      
      setRoles([...roles, newRole]);
      
      toast({
        title: "Rolle hinzugefügt",
        description: `${data.name} wurde erfolgreich hinzugefügt.`,
      });
    }
    
    setIsAddRoleOpen(false);
  };

  return (
    <PageTransition>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rollenverwaltung</h1>
            <p className="text-muted-foreground">
              Verwalten Sie die Benutzerrollen und Berechtigungen im System
            </p>
          </div>
          <Button onClick={handleAddRoleClick}>
            <Plus className="mr-2 h-4 w-4" />
            Rolle hinzufügen
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suche nach Rollennamen"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRoles.map((role) => (
              <Card key={role.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      {role.name}
                    </CardTitle>
                    <CardDescription className="mt-1">{role.description}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Aktionen</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEditRole(role)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Bearbeiten
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteRole(role.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Löschen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-semibold">{role.userCount}</span> Benutzer mit dieser Rolle
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-medium mb-1">Berechtigungen:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {role.permissions.slice(0, 3).map((perm) => (
                        <Badge key={perm} variant="outline" className="text-xs">
                          {allPermissions.find(p => p.id === perm)?.label || perm}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 3} weitere
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full" 
                    onClick={() => handleEditRole(role)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Berechtigungen bearbeiten
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Add/Edit Role Dialog */}
        <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Rolle bearbeiten" : "Neue Rolle hinzufügen"}
              </DialogTitle>
              <DialogDescription>
                {isEditMode 
                  ? "Bearbeiten Sie die Informationen und Berechtigungen der Rolle."
                  : "Fügen Sie eine neue Rolle mit spezifischen Berechtigungen hinzu."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rollenname</FormLabel>
                      <FormControl>
                        <Input placeholder="z.B. Manager" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beschreibung</FormLabel>
                      <FormControl>
                        <Input placeholder="Beschreiben Sie die Rolle und ihre Funktionen" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permissions"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Berechtigungen</FormLabel>
                        <FormDescription>
                          Wählen Sie die Berechtigungen aus, die diese Rolle haben soll.
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {allPermissions.map((permission) => (
                          <FormField
                            key={permission.id}
                            control={form.control}
                            name="permissions"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={permission.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 p-2 border rounded-md"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(permission.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, permission.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== permission.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {permission.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">
                    {isEditMode ? "Speichern" : "Hinzufügen"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
