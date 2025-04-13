
import { useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { Plus, Search, Shield, Edit, Trash, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { getRoles } from "@/data/mockData";
import { UserPermissions } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: UserPermissions;
}

interface PermissionOption {
  id: keyof UserPermissions;
  name: string;
  description: string;
}

const permissionOptions: PermissionOption[] = [
  { 
    id: 'canAccessAdmin', 
    name: 'Admin-Zugriff', 
    description: 'Zugriff auf den Admin-Bereich' 
  },
  { 
    id: 'canEditAssets', 
    name: 'Assets bearbeiten', 
    description: 'Kann alle Assets bearbeiten' 
  },
  { 
    id: 'canCreateEmployees', 
    name: 'Mitarbeiter erstellen', 
    description: 'Kann neue Mitarbeiter anlegen' 
  },
  { 
    id: 'canEditEmployees', 
    name: 'Mitarbeiter bearbeiten', 
    description: 'Kann Mitarbeiterdaten bearbeiten' 
  },
  { 
    id: 'canEditOwnAssets', 
    name: 'Eigene Assets bearbeiten', 
    description: 'Kann eigene zugewiesene Assets bearbeiten' 
  },
  { 
    id: 'canEditOwnProfile', 
    name: 'Eigenes Profil bearbeiten', 
    description: 'Kann eigenes Profil bearbeiten' 
  },
  { 
    id: 'canViewReports', 
    name: 'Reports einsehen', 
    description: 'Kann Berichte und Statistiken einsehen' 
  }
];

export default function Roles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roles, setRoles] = useState<Role[]>(getRoles());
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // Filter roles based on search query
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (role: Role) => {
    setEditingRole({...role});
    setIsEditDialogOpen(true);
  };

  const handleDelete = (roleId: string) => {
    setRoleToDelete(roleId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (roleToDelete) {
      const updatedRoles = roles.filter(r => r.id !== roleToDelete);
      setRoles(updatedRoles);
      toast({
        title: "Rolle gelöscht",
        description: "Die Rolle wurde erfolgreich gelöscht.",
      });
    }
    setRoleToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const saveRole = () => {
    if (editingRole) {
      const updatedRoles = roles.map(r => 
        r.id === editingRole.id ? editingRole : r
      );
      setRoles(updatedRoles);
      toast({
        title: "Rolle aktualisiert",
        description: "Die Rolle wurde erfolgreich aktualisiert.",
      });
    }
    setEditingRole(null);
    setIsEditDialogOpen(false);
  };

  const togglePermission = (permission: keyof UserPermissions) => {
    if (editingRole) {
      setEditingRole({
        ...editingRole,
        permissions: {
          ...editingRole.permissions,
          [permission]: !editingRole.permissions[permission]
        }
      });
    }
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
          <Button disabled className="cursor-not-allowed opacity-60" title="Funktion in Entwicklung">
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

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRoles.map(role => (
              <Card key={role.id} className="overflow-hidden">
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      {role.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {role.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(role)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(role.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Object.entries(role.permissions).map(([key, value]) => 
                      value ? (
                        <Badge 
                          key={key} 
                          variant="outline"
                          className="bg-primary/10 text-xs"
                        >
                          {permissionOptions.find(p => p.id === key)?.name || key}
                        </Badge>
                      ) : null
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
                    <span>ID: {role.id}</span>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredRoles.length === 0 && (
              <Card className="col-span-full">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Keine Rollen gefunden
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Es wurden keine Rollen gefunden, die Ihren Suchkriterien entsprechen.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Edit Role Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Rolle bearbeiten</DialogTitle>
              <DialogDescription>
                Bearbeiten Sie die Details und Berechtigungen dieser Rolle.
              </DialogDescription>
            </DialogHeader>
            
            {editingRole && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Name</h3>
                  <Input 
                    value={editingRole.name} 
                    onChange={(e) => setEditingRole({...editingRole, name: e.target.value})}
                    placeholder="Rollenname"
                  />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Beschreibung</h3>
                  <Input 
                    value={editingRole.description} 
                    onChange={(e) => setEditingRole({...editingRole, description: e.target.value})}
                    placeholder="Beschreibung"
                  />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Berechtigungen</h3>
                  <div className="space-y-4 mt-2">
                    {permissionOptions.map(permission => (
                      <div key={permission.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm">{permission.name}</p>
                          <p className="text-xs text-muted-foreground">{permission.description}</p>
                        </div>
                        <Switch 
                          checked={editingRole.permissions[permission.id]} 
                          onCheckedChange={() => togglePermission(permission.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                Abbrechen
              </Button>
              <Button onClick={saveRole}>
                <Check className="h-4 w-4 mr-2" />
                Speichern
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Rolle löschen</AlertDialogTitle>
              <AlertDialogDescription>
                Sind Sie sicher, dass Sie diese Rolle löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
                Löschen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageTransition>
  );
}
