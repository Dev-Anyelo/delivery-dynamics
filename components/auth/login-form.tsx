"use client";

import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const formMethods = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema.pick({ email: true, password: true })),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid },
  } = formMethods;

  const onSubmitData = async (values: z.infer<typeof UserSchema>) => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
          credentials: "include",
        });

        const data = await res.json();
        if (data.success) {
          reset();
          console.log("Redirigiendo a /dashboard...");
          router.refresh();
          router.push("/dashboard/vehicles/fleet");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        toast.error("Ocurrió un error inesperado");
      }
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden z-50">
        <CardContent className="grid p-0 md:grid-cols-2">
          <FormProvider {...formMethods}>
            <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmitData)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Bienvenido</h1>
                  <p className="text-balance text-muted-foreground">
                    Inicia sesión para continuar
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    required
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    disabled={isPending}
                    {...register("email")}
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="#"
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <Input
                    required
                    id="password"
                    type="password"
                    placeholder="********"
                    disabled={isPending}
                    {...register("password")}
                    aria-invalid={errors.password ? "true" : "false"}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPending || !isValid}
                >
                  {isPending ? (
                    <>
                      <Loader className="animate-spin w-5 h-5 mr-1 inline-block" />
                      Iniciando sesión...
                    </>
                  ) : (
                    <>Iniciar sesión &rarr;</>
                  )}
                </Button>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    ¿No tienes una cuenta?
                  </span>
                </div>
                <div className="gap-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    disabled={isPending}
                  >
                    <Link href="/auth/register">Regístrate</Link>
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/delivery-img.webp"
              alt="Image"
              width={200}
              height={200}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Al hacer clic en continuar, aceptas nuestros Términos de Servicio y
        nuestra Política de Privacidad.
      </div>
    </div>
  );
}
