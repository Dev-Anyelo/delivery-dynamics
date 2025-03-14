"use client";

import * as z from "zod";
import { toast } from "sonner";
import { User } from "@/types/types";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole, UserSchema } from "@/schemas/schemas";
import { UserSkeleton } from "../skeletons/dashboard-skeletons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Calendar,
  CheckCircle2,
  Loader,
  Mail,
  PencilLine,
  Plus,
  Search,
  Shield,
  Trash2,
  UserIcon,
  UserCog,
  UserPlus,
  Users,
  X,
  XCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

export function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const formMethods = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    mode: "onChange",
    defaultValues: {
      id: undefined,
      name: "",
      email: "",
      password: "",
      isActive: true,
      role: UserRole.Values.USER,
      fechaCreacion: new Date(),
    },
  });

  const { handleSubmit, reset } = formMethods;

  // fetch all users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/all-users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      toast.error("No se pudieron cargar los usuarios");
    } finally {
      setIsLoading(false);
    }
  };

  // add or edit user
  const handleAddOrEditUser = async (userData: z.infer<typeof UserSchema>) => {
    try {
      const finalData = { ...userData, id: userData.id || undefined };
      const isEditing = !!finalData.id;

      const endpoint = isEditing
        ? `/api/user/update/${finalData.id}`
        : "/api/user/create";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Error al realizar la operación");
        return;
      }
      fetchUsers();
      toast.success(
        `Usuario ${isEditing ? "actualizado" : "registrado"} exitosamente.`
      );
      setShowForm(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error en la operación:", error);
      toast.error("Hubo un error al realizar la operación.");
    }
  };

  const onSubmitData = async (values: z.infer<typeof UserSchema>) => {
    setIsSubmitting(true);
    await handleAddOrEditUser(values);
    reset({
      id: undefined,
      name: "",
      email: "",
      password: "",
      isActive: true,
      role: UserRole.Values.USER,
    });

    setIsSubmitting(false);
  };

  // delete user by id
  const DeleteUserByID = async (id: string) => {
    setIsDeleting(true);
    setDeletingUserId(id);
    try {
      const response = await fetch(`/api/user/delete/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      toast.error("Ocurrió un error inesperado al eliminar el usuario.");
    } finally {
      setIsDeleting(false);
      setDeletingUserId(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const isNotCurrentUser = u.id !== user?.id;

    if (activeTab === "all") return isNotCurrentUser && matchesSearch;
    if (activeTab === "active")
      return isNotCurrentUser && u.isActive && matchesSearch;
    if (activeTab === "inactive")
      return isNotCurrentUser && !u.isActive && matchesSearch;

    return (
      isNotCurrentUser && u.role === activeTab.toUpperCase() && matchesSearch
    );
  });

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case UserRole.Values.ADMIN:
        return <Shield className="size-4" />;
      case UserRole.Values.MANAGER:
        return <UserCog className="size-4" />;
      default:
        return <UserIcon className="size-4" />;
    }
  };

  return (
    <motion.div
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6 max-w-6xl mx-auto"
    >
      <Card className="border shadow-sm">
        <CardHeader className="relative pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Users className="size-5" />
                Gestión de Usuarios
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Administra los usuarios de la plataforma. Puedes agregar, editar
                o eliminar usuarios.
              </CardDescription>
            </div>
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary hover:bg-primary/15 transition-colors"
            >
              <Users className="size-3.5 mr-1" />
              {users.length} Usuarios
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          {/* Barra de búsqueda y botón para agregar usuario */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-sm">
              <Input
                placeholder="Buscar por nombre o correo"
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="size-4 text-muted-foreground" />
              </span>
              {search && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full aspect-square rounded-l-none"
                  onClick={() => setSearch("")}
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>
            <Button
              onClick={() => {
                reset({
                  id: undefined,
                  name: "",
                  email: "",
                  password: "",
                  isActive: true,
                  role: UserRole.Values.USER,
                });
                setSelectedUser(null);
                setShowForm(true);
              }}
              className="sm:w-auto w-full"
            >
              <UserPlus className="size-4 mr-2" />
              <span>Agregar usuario</span>
            </Button>
          </div>

          {/* Tabs for filtering */}
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="active">Activos</TabsTrigger>
              <TabsTrigger value="inactive">Inactivos</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="manager">Manager</TabsTrigger>
              <TabsTrigger value="user">Usuario</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Formulario para creación/edición */}
          {showForm && (
            <Card className="border shadow-sm p-5 mx-auto bg-card/50 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {selectedUser ? "Editar Usuario" : "Nuevo Usuario"}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedUser(null);
                    reset({
                      id: undefined,
                      name: "",
                      email: "",
                      password: "",
                      isActive: true,
                      role: UserRole.Values.USER,
                    });
                  }}
                >
                  <X className="size-4" />
                </Button>
              </div>
              <Form {...formMethods}>
                <form
                  onSubmit={handleSubmit(onSubmitData)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {/* Campo Nombre */}
                  <FormField
                    control={formMethods.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Nombre completo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Campo Correo */}
                  <FormField
                    control={formMethods.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Campo Contraseña */}
                  <FormField
                    control={formMethods.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Campo Rol */}
                  <FormField
                    control={formMethods.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rol</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger disabled={isSubmitting}>
                              <SelectValue placeholder="Selecciona el rol" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(UserRole.Values).map((role) => (
                              <SelectItem
                                key={role}
                                value={role}
                                className="flex items-center gap-2"
                              >
                                {getRoleIcon(role)}
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Campo Estado */}
                  <FormField
                    control={formMethods.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(value === "true")
                          }
                          defaultValue={String(field.value)}
                        >
                          <FormControl>
                            <SelectTrigger disabled={isSubmitting}>
                              <SelectValue placeholder="Selecciona el estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem
                              value="true"
                              className="flex items-center gap-2"
                            >
                              <CheckCircle2 className="size-4 text-emerald-500" />
                              Activo
                            </SelectItem>
                            <SelectItem
                              value="false"
                              className="flex items-center gap-2"
                            >
                              <XCircle className="size-4 text-rose-500" />
                              Inactivo
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Botones de Enviar y Cancelar */}
                  <div className="md:col-span-2 flex gap-3 justify-end mt-2">
                    <Button
                      disabled={isSubmitting}
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        setSelectedUser(null);
                        reset({
                          id: undefined,
                          name: "",
                          email: "",
                          password: "",
                          isActive: true,
                          role: UserRole.Values.USER,
                        });
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button disabled={isSubmitting} type="submit">
                      {isSubmitting ? (
                        <>
                          <Loader className="animate-spin size-4 mr-2" />
                          Guardando...
                        </>
                      ) : (
                        <>{selectedUser ? "Actualizar" : "Guardar"}</>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </Card>
          )}

          {/* Listado de usuarios */}
          <div className="space-y-3">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <UserSkeleton key={index} />
              ))
            ) : filteredUsers.length > 0 ? (
              <div className="grid gap-3">
                {filteredUsers.map((user: User) => (
                  <div
                    key={user.id}
                    className="relative p-4 border border-border/50 rounded-xl bg-card/30 hover:bg-card/50 transition-all hover:shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Avatar and user info */}
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="h-12 w-12 border-2 border-primary/10">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {user?.name
                              .split(" ")
                              .map((name: string) => name[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="font-semibold text-base">
                            {user?.name}
                          </p>
                          <div className="flex items-center text-sm text-muted-foreground gap-1">
                            <Mail className="size-3.5" />
                            {user?.email}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground gap-1 mt-0.5">
                            <Calendar className="size-3.5" />
                            {user?.fechaCreacion &&
                              new Date(
                                user?.fechaCreacion
                              ).toLocaleDateString()}
                            {user?.fechaCreacion &&
                              new Date(user?.fechaCreacion).toDateString() ===
                                new Date().toDateString() && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-[10px] py-0 h-4 bg-primary/10 text-primary border-primary/20"
                                >
                                  Nuevo
                                </Badge>
                              )}
                          </div>
                        </div>
                      </div>

                      {/* Badges and actions */}
                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        <Badge
                          variant="outline"
                          className={`flex items-center gap-1 ${
                            user.role === UserRole.Values.ADMIN
                              ? "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400"
                              : user.role === UserRole.Values.MANAGER
                              ? "bg-violet-500/10 text-violet-600 border-violet-200 dark:border-violet-800 dark:text-violet-400"
                              : "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800 dark:text-amber-400"
                          }`}
                        >
                          {getRoleIcon(user.role)}
                          {user.role}
                        </Badge>

                        <Badge
                          variant="outline"
                          className={`flex items-center gap-1 ${
                            user.isActive
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400"
                              : "bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-800 dark:text-rose-400"
                          }`}
                        >
                          {user.isActive ? (
                            <>
                              <CheckCircle2 className="size-3.5" />
                              Activo
                            </>
                          ) : (
                            <>
                              <XCircle className="size-3.5" />
                              Inactivo
                            </>
                          )}
                        </Badge>

                        <div className="flex gap-1 ml-auto sm:ml-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-primary/5 hover:bg-primary/10"
                            disabled={isSubmitting || isDeleting}
                            onClick={() => {
                              setSelectedUser(user);
                              reset({ ...user, id: user?.id });
                              setShowForm(true);
                            }}
                          >
                            <PencilLine className="size-3.5" />
                          </Button>
                          <Button
                            disabled={isSubmitting || isDeleting}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-destructive/5 hover:bg-destructive/10 text-destructive"
                            onClick={() => setUserToDelete(user)}
                          >
                            {deletingUserId === user?.id ? (
                              <Loader className="animate-spin size-3.5" />
                            ) : (
                              <Trash2 className="size-3.5" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-muted/30 rounded-lg border border-dashed">
                <div className="flex flex-col items-center gap-2">
                  <Users className="size-10 text-muted-foreground/50" />
                  <p className="text-muted-foreground font-medium">
                    No se encontraron usuarios
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    {search
                      ? "Intenta con otra búsqueda"
                      : "Agrega usuarios para comenzar"}
                  </p>
                  {search && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => setSearch("")}
                    >
                      <X className="size-3.5 mr-1" />
                      Limpiar búsqueda
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de confirmación para eliminar usuario */}
      {userToDelete && (
        <Dialog
          open={!!userToDelete}
          onOpenChange={(open) => !open && setUserToDelete(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <Trash2 className="size-5 text-destructive" />
                Confirmar Eliminación
              </DialogTitle>
              <DialogDescription className="pt-2">
                ¿Estás seguro de que deseas eliminar a
                <span className="font-medium mx-1 text-foreground">
                  {userToDelete.name}
                </span>
                ? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setUserToDelete(null)}
                className="sm:w-auto w-full"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  DeleteUserByID(userToDelete.id!);
                  setUserToDelete(null);
                }}
                className="sm:w-auto w-full"
              >
                {isDeleting ? (
                  <>
                    <Loader className="size-4 mr-2 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4 mr-2" />
                    Eliminar
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
}
