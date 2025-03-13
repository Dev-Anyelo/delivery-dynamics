"use client";

import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginFormValues } from "@/types/types";
import { loginSchema } from "@/schemas/schemas";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Loader, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmitData = async (values: LoginFormValues) => {
    setIsPending(true);

    try {
      const { data } = await axios.post("/api/auth/login", values, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (data.success) {
        setUser(data.data.user);
        reset();
        console.log("Redirigiendo a /guides...");
        router.push("/dashboard/guides");
      } else {
        toast.error(data.message || "Credenciales inválidas");
      }
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      const message =
        error.response?.data?.message || "Ocurrió un error inesperado";
      toast.error(message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-4xl overflow-hidden shadow-lg z-50 bg-background">
        <CardContent className="p-0 grid md:grid-cols-2">
          {/* Columna de imagen con gradiente mejorado */}
          <div
            className="relative hidden md:block bg-gradient-to-br from-blue-600 to-blue-800"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.8) 100%)",
            }}
          >
            {/* Overlay para mejorar contraste */}
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full flex flex-col items-center"
              >
                <Image
                  src="/logo.png"
                  alt="Delivery Dynamics"
                  width={60}
                  height={70}
                  className="mb-8"
                />

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-white max-w-md"
                >
                  <h2 className="text-2xl font-bold mb-3 dark:text-neutral-900 text-neutral-100">
                    Bienvenido de nuevo
                  </h2>
                  <p className="text-balance text-neutral-200 dark:text-neutral-700">
                    Accede a tu cuenta para gestionar las operaciones de tu
                    negocio
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Formulario */}
          <div className="p-6 md:p-8 lg:p-10">
            <div className="md:hidden flex justify-center mb-6">
              <Image
                src="/logo.png"
                alt="Delivery Dynamics"
                width={50}
                height={50}
              />
            </div>

            <form onSubmit={handleSubmit(onSubmitData)}>
              <div className="flex flex-col gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center text-center"
                >
                  <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
                  <p className="text-balance text-muted-foreground mt-1">
                    Ingresa tus credenciales para continuar
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Correo electrónico
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="usuario@ejemplo.com"
                        className="pl-3 pr-3 py-6 transition-all border-muted-foreground/20 focus:border-primary"
                        disabled={isPending}
                        {...register("email")}
                        aria-invalid={errors.email ? "true" : "false"}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Contraseña
                      </Label>
                      <Link
                        href="#"
                        className="text-xs text-primary hover:text-primary/80 transition-colors"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-3 pr-10 py-6 transition-all border-muted-foreground/20 focus:border-primary"
                        disabled={isPending}
                        {...register("password")}
                        aria-invalid={errors.password ? "true" : "false"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={
                          showPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <Button
                    type="submit"
                    className="w-full py-6 text-base font-medium transition-all"
                    disabled={isPending || !isValid}
                    variant="default"
                  >
                    {isPending ? (
                      <span className="flex items-center justify-center">
                        <Loader className="animate-spin w-5 h-5 mr-2" />
                        Iniciando sesión...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Iniciar sesión
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </span>
                    )}
                  </Button>
                </motion.div>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
