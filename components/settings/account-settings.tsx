"use client";

import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Loader, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { UserRole, UserSchema } from "@/schemas/schemas";
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
  const { user, setUser } = useAuth();
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);

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

  useEffect(() => {
    if (user) {
      reset({
        id: user.id,
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
        isActive: user.isActive,
      });
    }
  }, [user, reset]);

  const onSubmitData = async (data: z.infer<typeof UserSchema>) => {
    if (!user?.id) return;

    setIsUpdatingInfo(true);

    try {
      const payload = { ...data };

      if (payload.password === "") {
        delete payload.password;
      }

      const response = await fetch(`/api/user/update/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Error al actualizar la información");
        return;
      }

      toast.success("Información actualizada exitosamente.");

      if (result.user) {
        setUser({
          ...user,
          ...result.user,
        });

        reset({
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          password: "",
          role: result.user.role,
          isActive: result.user.isActive,
        });
      }
    } catch (error) {
      console.error("Error al actualizar la información:", error);
      toast.error("Error al actualizar la información");
    } finally {
      setIsUpdatingInfo(false);
    }
  };

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
            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={handleSubmit(onSubmitData)}
            >
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
                    <FormLabel>Actualizar password</FormLabel>
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

              {/* Campo de role */}
              <FormField
                control={formMethods.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol actual</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      value={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger disabled>
                          <SelectValue placeholder="Selecciona el role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(UserRole.Values).map((role: string) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo de isActive */}
              <FormField
                control={formMethods.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado de la cuenta</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                        value={String(field.value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Activa</SelectItem>
                          <SelectItem value="false">Inactiva</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 col-span-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => reset()}
                  disabled={isUpdatingInfo}
                >
                  Cancelar
                </Button>
                <Button size="sm" type="submit" disabled={isUpdatingInfo}>
                  {isUpdatingInfo ? (
                    <Loader className="size-4 animate-spin" />
                  ) : (
                    "Guardar Cambios"
                  )}
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
