
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { Plus, Search, Check, X, UserCog, Trash } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getRoles } from "@/data/mockData";
import { format, formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { getUsers, updateUserRole, deleteUser } from "@/data/users";
import { UserRole } from "@/lib/types";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  lastSignInAt: string | null;
  createdAt: string;
}

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRoleDialogOpen, setUserRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  const roles = getRoles();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (error: any) {
      console.error("Error in fetchUsers:", error);
      toast({
        variant: "destructive",
        title: "Fehler beim Laden der Benutzer",
        description: error.message || "Ein unerwarteter Fehler ist aufgetreten",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = 
      searchQuery.trim() === '' || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Role filter
    const matchesRole = 
      roleFilter === 'all' || 
      user.role === roleFilter;
    
    // Status filter - for now, we consider all users active
    const matchesStatus = 
      statusFilter === 'all' || 
      statusFilter === 'active';
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const openRoleDialog = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setUserRoleDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleUpdateUserRole = async () => {
    if (!selectedUser || !selectedRole) return;
    
    try {
      const success = await updateUserRole(selectedUser.id, selectedRole);
      
      if (!success) {
        throw new Error("Failed to update user role");
      }
      
      // Update local state
      setUsers(users.map(u => 
        u.id === selectedUser.id ? {...u, role: selectedRole} : u
      ));
      
      toast({
        title: "Rolle aktualisiert",
        description: `Die Rolle von ${selectedUser.email} wurde auf ${selectedRole} aktualisiert.`,
      });
      
      setUserRoleDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Fehler beim Aktualisieren der Rolle",
        description: error.message || "Ein unerwarteter Fehler ist aufgetreten",
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return "bg-red-500 hover:bg-red-600";
      case 'editor':
        return "bg-blue-500 hover:bg-blue-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getRoleDisplayName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : roleId;
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      const success = await deleteUser(selectedUser.id);
      
      if (!success) {
        throw new Error("Failed to delete user");
      }
      
      // Update local state
      setUsers(users.filter(u => u.id !== selectedUser.id));
      
      toast({
        title: "Benutzer gelöscht",
        description: `${selectedUser.email} wurde erfolgreich gelöscht.`,
      });
      
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Fehler beim Löschen des Benutzers",
        description: error.message || "Ein unerwarteter Fehler ist aufgetreten",
      });
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col gap-8 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Benutzerverwaltung</h1>
            <p className="text-muted-foreground">
              Verwalten Sie alle Benutzer und deren Berechtigungen
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Benutzer hinzufügen
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suche nach Namen oder E-Mail"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Rolle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Rollen</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="user">Mitarbeiter</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="inactive">Inaktiv</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>E-Mail</TableHead>
                  <TableHead>Rolle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Letzter Login</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name || '-'}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge 
                          className={getRoleBadgeColor(user.role)}
                          onClick={() => currentUser?.id !== user.id && openRoleDialog(user)}
                          style={{ cursor: currentUser?.id !== user.id ? 'pointer' : 'default' }}
                        >
                          {getRoleDisplayName(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-100 border-green-200 text-green-800">
                          Aktiv
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.lastSignInAt ? (
                          formatDistanceToNow(new Date(user.lastSignInAt), { 
                            addSuffix: true, 
                            locale: de 
                          })
                        ) : 'Nie'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openRoleDialog(user)}
                            disabled={currentUser?.id === user.id}
                            title="Rolle bearbeiten"
                          >
                            <UserCog className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openDeleteDialog(user)}
                            disabled={currentUser?.id === user.id}
                            title="Benutzer löschen"
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Keine Benutzer gefunden.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Role Change Dialog */}
        <Dialog open={userRoleDialogOpen} onOpenChange={setUserRoleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Benutzerrolle ändern</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="mb-4">
                Benutzer: <strong>{selectedUser?.email}</strong>
              </p>
              <div className="space-y-1">
                <p className="text-sm font-medium">Rolle auswählen:</p>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rolle auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name} - {role.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUserRoleDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleUpdateUserRole}>
                Speichern
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete User Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Benutzer löschen</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>
                Sind Sie sicher, dass Sie den Benutzer <strong>{selectedUser?.email}</strong> löschen möchten?
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button variant="destructive" onClick={handleDeleteUser}>
                Löschen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
