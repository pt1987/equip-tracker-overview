
import { useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { Plus, Search, FileDown, Trash, Edit, MoreHorizontal, Check, Shield } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

// Mock user data
const mockUsers = [
  { id: 1, name: "Max Mustermann", email: "max@example.com", role: "admin", status: "active", lastLogin: "2023-05-15" },
  { id: 2, name: "Lisa Wagner", email: "lisa@example.com", role: "editor", status: "active", lastLogin: "2023-05-14" },
  { id: 3, name: "Thomas Schmidt", email: "thomas@example.com", role: "user", status: "active", lastLogin: "2023-05-12" },
  { id: 4, name: "Anna Becker", email: "anna@example.com", role: "user", status: "inactive", lastLogin: "2023-04-27" },
  { id: 5, name: "Michael Weber", email: "michael@example.com", role: "user", status: "active", lastLogin: "2023-05-10" },
  { id: 6, name: "Julia Fischer", email: "julia@example.com", role: "editor", status: "active", lastLogin: "2023-05-11" },
  { id: 7, name: "Felix Hoffmann", email: "felix@example.com", role: "user", status: "pending", lastLogin: "-" },
  { id: 8, name: "Sophia Schneider", email: "sophia@example.com", role: "user", status: "active", lastLogin: "2023-05-09" },
  { id: 9, name: "Leon Meyer", email: "leon@example.com", role: "user", status: "inactive", lastLogin: "2023-03-22" },
  { id: 10, name: "Lena Schulz", email: "lena@example.com", role: "editor", status: "active", lastLogin: "2023-05-14" },
];

// User form schema
const userFormSchema = z.object({
  name: z.string().min(2, { message: "Name muss mindestens 2 Zeichen lang sein." }),
  email: z.string().email({ message: "Ungültige E-Mail-Adresse." }),
  role: z.string().min(1, { message: "Rolle muss ausgewählt werden." }),
  password: z.string().min(8, { message: "Passwort muss mindestens 8 Zeichen lang sein." }).optional().or(z.literal("")),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export default function Users() {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      password: "",
    },
  });

  // Function to handle user filtering
  const filteredUsers = users.filter(user => {
    // Text search
    const matchesSearch = searchQuery === "" || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Role filter
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    // Status filter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Reset form for adding new user
  const handleAddUserClick = () => {
    form.reset({
      name: "",
      email: "",
      role: "user",
      password: "",
    });
    setIsEditMode(false);
    setCurrentUser(null);
    setIsAddUserOpen(true);
  };

  // Handle edit user
  const handleEditUser = (user: any) => {
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "", // Don't populate password for security
    });
    setIsEditMode(true);
    setCurrentUser(user);
    setIsAddUserOpen(true);
  };

  // Handle delete user
  const handleDeleteUser = (userId: number) => {
    if (window.confirm("Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?")) {
      setUsers(users.filter(user => user.id !== userId));
      toast({
        title: "Benutzer gelöscht",
        description: "Der Benutzer wurde erfolgreich gelöscht.",
      });
    }
  };

  // Handle form submission
  const onSubmit = (data: UserFormValues) => {
    if (isEditMode && currentUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === currentUser.id 
          ? { ...user, name: data.name, email: data.email, role: data.role }
          : user
      ));
      
      toast({
        title: "Benutzer aktualisiert",
        description: `${data.name} wurde erfolgreich aktualisiert.`,
      });
    } else {
      // Add new user
      const newUser = {
        id: users.length + 1,
        name: data.name,
        email: data.email,
        role: data.role,
        status: "pending",
        lastLogin: "-",
      };
      
      setUsers([...users, newUser]);
      
      toast({
        title: "Benutzer hinzugefügt",
        description: `${data.name} wurde erfolgreich hinzugefügt.`,
      });
    }
    
    setIsAddUserOpen(false);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-500">Admin</Badge>;
      case "editor":
        return <Badge className="bg-blue-500">Editor</Badge>;
      default:
        return <Badge className="bg-green-500">Benutzer</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Aktiv</Badge>;
      case "inactive":
        return <Badge className="bg-gray-500">Inaktiv</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Ausstehend</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Benutzerverwaltung</h1>
            <p className="text-muted-foreground">
              Verwalten Sie alle Benutzer und deren Berechtigungen
            </p>
          </div>
          <Button onClick={handleAddUserClick}>
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
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="user">Benutzer</SelectItem>
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
                  <SelectItem value="pending">Ausstehend</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <FileDown className="h-4 w-4" />
              </Button>
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
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
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
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Bearbeiten
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              // Toggle active status
                              setUsers(users.map(u => 
                                u.id === user.id 
                                  ? { ...u, status: u.status === "active" ? "inactive" : "active" }
                                  : u
                              ));
                            }}>
                              <Check className="mr-2 h-4 w-4" />
                              {user.status === "active" ? "Deaktivieren" : "Aktivieren"}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" />
                              Berechtigungen
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Löschen
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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

        {/* Add/Edit User Dialog */}
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Benutzer bearbeiten" : "Neuen Benutzer hinzufügen"}
              </DialogTitle>
              <DialogDescription>
                {isEditMode 
                  ? "Bearbeiten Sie die Informationen des Benutzers."
                  : "Fügen Sie einen neuen Benutzer zum System hinzu."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Max Mustermann" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-Mail</FormLabel>
                      <FormControl>
                        <Input placeholder="max@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rolle</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Rolle auswählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="user">Benutzer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {!isEditMode && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Passwort</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder={isEditMode ? "Leer lassen, um unverändert zu lassen" : "Passwort"} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
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
