"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext";
import { useForm } from "react-hook-form";
import { Loader, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserRole, UserSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

export function AccountSettings() {
  const { user } = useAuth();
  // const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);

  const formMethods = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    mode: "onChange",
    defaultValues: {
      id: user?.id || "",
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      role: user?.role || UserRole.Values.USER,
      isActive: user?.isActive === true,
    },
  });

  const { handleSubmit, reset } = formMethods;

  // const onSubmitData = async (data: z.infer<typeof usuarioSchema>) => {
  //   if (!user?.id) return;

  //   setIsUpdatingInfo(true);

  //   try {
  //     const payload = { ...data };

  //     if (payload.contraseña === "") {
  //       delete payload.contraseña;
  //     }

  //     const response = await fetch(`/api/update-current-user-info/${user.id}`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     const result = await response.json();

  //     if (!response.ok) {
  //       toast.error(result.message || "Error al actualizar la información");
  //       return;
  //     }

  //     toast.success("Información actualizada exitosamente.");

  //     if (result.user) {
  //       setUser({
  //         ...user,
  //         ...result.user,
  //       });

  //       reset({
  //         id: result.user.id,
  //         nombre: result.user.nombre,
  //         correo: result.user.correo,
  //         contraseña: "",
  //         rol: result.user.rol,
  //         estado: result.user.estado,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error al actualizar la información:", error);
  //     toast.error("Error al actualizar la información");
  //   } finally {
  //     setIsUpdatingInfo(false);
  //   }
  // };

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
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>
            Actualiza tu información personal y de contacto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...formMethods}>
            <form className="grid gap-4 sm:grid-cols-2">
              {/* Campos para name, email y password */}
              <FormField
                control={formMethods.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formMethods.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Actualizar contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo de rol: iteramos sobre los valores (strings) */}
              <FormField
                control={formMethods.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol actual</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger disabled>
                          <SelectValue placeholder="Selecciona el rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(UserRole.Values).map((rol: string) => (
                          <SelectItem key={rol} value={rol}>
                            {rol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 col-span-2">
                <Button size="sm" variant="outline" onClick={() => reset()}>
                  Cancelar
                </Button>
                <Button size="sm" type="submit">
                  Guardar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator />

      <Card className="border-none">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-700 text-lg">
            Acciones Irreversibles
          </CardTitle>
          <CardDescription>
            Estas acciones no se pueden deshacer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">
                Eliminar cuenta permanentemente
              </h3>
              <p className="text-sm text-muted-foreground">
                Esta acción eliminará tu cuenta y todos tus datos de forma
                permanente.
              </p>
            </div>
            <Button size="sm" variant="destructive">
              <Trash2 className="size-4" />
              <span>Eliminar Cuenta</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
