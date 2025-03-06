"use client";

import * as z from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
// import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
// import { User } from "@/interfaces/interfaces";
import { Button } from "@/components/ui/button";
import { UserSchema } from "@/schemas/schemas";
// import { EstadoConductor, Rol } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader, PencilLine, Plus, Search, Trash2 } from "lucide-react";

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
import { UserSkeleton } from "../skeletons/dashboard-skeletons";

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

export function UserManagement() {
  // const { user } = useAuth();
  // const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [userToDelete, setUserToDelete] = useState<User | null>(null);
  // const [, setSelectedUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const formMethods = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    mode: "onChange",
    defaultValues: {
      id: undefined,
      name: "",
      email: "",
      password: "",
    },
  });

  const { handleSubmit, reset } = formMethods;

  // Obtiene los usuarios de la API
  // const fetchUsers = async () => {
  //   try {
  //     setIsLoading(true);
  //     const response = await fetch("/api/users");
  //     const data = await response.json();
  //     setUsers(data);
  //   } catch (error) {
  //     console.error("Error al obtener los usuarios:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Función para registrar o actualizar el usuario
  // const handleAddOrEditUser = async (
  //   userData: z.infer<typeof usuarioSchema>
  // ) => {
  //   try {
  //     const finalData = { ...userData, id: userData.id || undefined };
  //     const isEditing = !!finalData.id;

  //     const endpoint = isEditing
  //       ? `/api/edit-user/${finalData.id}`
  //       : "/api/register";

  //     const method = isEditing ? "PUT" : "POST";

  //     const response = await fetch(endpoint, {
  //       method,
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(finalData),
  //     });

  //     const result = await response.json();

  //     if (!response.ok) {
  //       toast.error(result.message || "Error al realizar la operación");
  //       return;
  //     }
  //     fetchUsers();
  //     toast.success(
  //       `Usuario ${isEditing ? "actualizado" : "registrado"} exitosamente.`
  //     );
  //     setShowForm(false);
  //     setSelectedUser(null);
  //   } catch (error) {
  //     console.error("Error en la operación:", error);
  //     toast.error("Hubo un error al realizar la operación.");
  //   }
  // };

  // const onSubmitData = async (values: z.infer<typeof usuarioSchema>) => {
  //   setIsSubmitting(true);
  //   await handleAddOrEditUser(values);
  //   reset({
  //     id: undefined,
  //     name: "",
  //     email: "",
  //     password: "",
  //   });

  //   setIsSubmitting(false);
  // };

  // Función para eliminar un usuario
  // const DeleteUserByID = async (userID: string) => {
  //   setIsDeleting(true);
  //   setDeletingUserId(userID);
  //   try {
  //     const response = await fetch(`/api/delete-user/${userID}`, {
  //       method: "DELETE",
  //     });
  //     const data = await response.json();
  //     if (data.success) {
  //       fetchUsers();
  //       toast.success(data.message);
  //     } else {
  //       toast.error(data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error al eliminar el usuario:", error);
  //     toast.error("Ocurrió un error inesperado al eliminar el usuario.");
  //   } finally {
  //     setIsDeleting(false);
  //     setDeletingUserId(null);
  //   }
  // };

  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  // Filtra los usuarios según el término de búsqueda
  // const filteredUsers = users.filter(
  //   (u) =>
  //     u.id !== user?.id && u.nombre.toLowerCase().includes(search.toLowerCase())
  // );

  return (
    <motion.div
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <Card className="border-none">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Gestión de Usuarios
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Administra los usuarios de la plataforma. Puedes agregar, editar o
            eliminar usuarios.
          </CardDescription>
          <Badge variant="outline" className="bg-indigo-600 text-white w-fit">
            Usuarios
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Barra de búsqueda y botón para agregar usuario */}
          <div className="flex items-center justify-between">
            <div className="relative max-w-sm">
              <Input
                placeholder="Buscar usuario"
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="size-4 text-muted-foreground" />
              </span>
            </div>
            <Button
              size="sm"
              onClick={() => {
                reset({
                  id: undefined,
                  name: "",
                  email: "",
                  password: "",
                });
                // setSelectedUser(null);
                setShowForm(true);
              }}
              className="space-x-2"
            >
              <Plus className="size-4" />
              <span>Agregar usuario</span>
            </Button>
          </div>

          {/* Formulario para creación/edición */}
          {showForm && (
            <Card className="p-4 mx-auto">
              <Form {...formMethods}>
                <form
                  // onSubmit={handleSubmit(onSubmitData)}
                  className="grid grid-cols-2 gap-4"
                >
                  {/* Campo Nombre */}
                  <FormField
                    control={formMethods.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
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
                            <SelectItem value="admin">Administrador</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 
                  {/* Botones de Enviar y Cancelar */}
                  <div className="col-span-2 flex gap-2 justify-end">
                    <Button
                      disabled={isSubmitting}
                      size="sm"
                      type="submit"
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="animate-spin size-5 mr-1 inline-block" />
                          Guardando datos...
                        </>
                      ) : (
                        <>Guardar &rarr;</>
                      )}
                    </Button>
                    <Button
                      disabled={isSubmitting}
                      size="sm"
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setShowForm(false);
                        // setSelectedUser(null);
                        reset({
                          id: undefined,
                          name: "",
                          email: "",
                          password: "",
                        });
                      }}
                      className="w-full"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </Form>
            </Card>
          )}

          {/* Listado de usuarios */}
          <div className="space-y-4">
            {/* {isLoading ? (
              Array.from({ length: 9 }).map((_, index) => (
                <UserSkeleton key={index} />
              ))
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user: User) => {
                const roleBadgeClasses = {
                  [Rol.ADMINISTRADOR]:
                    "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 h-fit",
                  [Rol.CONDUCTOR]:
                    "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 h-fit",
                  [Rol.MECANICO]:
                    "text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30 h-fit",
                  [Rol.USUARIO]:
                    "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 h-fit",
                };
                const estadoBadgeClasses = {
                  [EstadoConductor.ACTIVO]:
                    "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 h-fit",
                  [EstadoConductor.INACTIVO]:
                    "text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30 h-fit",
                };

                return ( */}
                  <div
                    // key={user.id}
                    className="relative flex flex-col p-3 border border-gray-300/30 dark:border-gray-700/30 rounded-2xl bg-[#f8f9fa]/30 dark:bg-[#121212] transition hover:border-gray-400/30 dark:hover:border-gray-500/30 hover:shadow-sm"
                  >
                    {/* Badges de rol y estado */}
                    <div className="absolute top-4 right-2 flex gap-2">
                      <Badge
                        variant="outline"
                        // className={roleBadgeClasses[user.rol] || ""}
                      >
                        {/* {user.rol} */}
                        Administrador
                      </Badge>
                      <Badge
                        variant="outline"
                        // className={estadoBadgeClasses[user.estado] || ""}
                      >
                        {/* {user.estado} */}
                        Activo
                      </Badge>
                      {/* {user.fechaRegistro &&
                        new Date(user.fechaRegistro).toDateString() ===
                          new Date().toDateString() && (
                          <Badge
                            variant="outline"
                            className="bg-indigo-600 text-white"
                          >
                            Nuevo
                          </Badge>
                        )} */}
                    </div>
                    {/* Información del usuario */}
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          Anyelo Benavides
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-1">
                        <p className="font-medium text-lg">
                          {/* {user.nombre} */}
                          Anyelo Benavides
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {/* {user.correo} */}
                          anyelobg@gmail.com
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {/* {new Intl.DateTimeFormat("es-ES", {
                            dateStyle: "full",
                          }).format(new Date(user.fechaRegistro || ""))} */}

                          01/01/2021
                        </p>
                      </div>
                    </div>
                    {/* Botones para editar o eliminar */}
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isSubmitting || isDeleting}
                        onClick={() => {
                          // setSelectedUser(user);
                          // reset({ ...user, id: user.id });
                          setShowForm(true);
                        }}
                      >
                        <PencilLine className="size-4" />
                      </Button>
                      <Button
                        disabled={isSubmitting || isDeleting}
                        variant="ghost"
                        size="sm"
                        // onClick={() => setUserToDelete(user)}
                      >
                        {/* {deletingUserId === user.id ? (
                          <>
                            <Loader className="animate-spin size-4" />
                          </>
                        ) : (
                          <Trash2 className="size-4" />
                        )} */}
                      </Button>
                    </div>
                  </div>
                {/* ); */}
              {/* }) */}
            {/* ) : (
              <p className="text-center text-muted-foreground">
                No se encontraron resultados.
              </p>
            )} */}
          </div>
        </CardContent>
      </Card>

      {/* Modal de confirmación para eliminar usuario */}
      {/* {userToDelete && (
        <Dialog
          open={!!userToDelete}
          onOpenChange={(open) => !open && setUserToDelete(null)}
        >
          <DialogContent className="rounded-lg shadow-lg max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Confirmar Eliminación
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                ¿Estás seguro de que deseas eliminar al usuario
                <span className="font-medium ml-1">{userToDelete.nombre}</span>?
                Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setUserToDelete(null)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  DeleteUserByID(userToDelete.id!);
                  setUserToDelete(null);
                }}
              >
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )} */}
    </motion.div>
  );
}
