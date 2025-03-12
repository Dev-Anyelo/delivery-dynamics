import type { Metadata } from "next";
import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Delivery Dynamics | Iniciar Sesión",
  description: "Inicia sesión en Delivery Dynamics",
};

export default function LoginPage() {
  return (
    <section className="relative flex flex-col justify-center items-center h-screen w-full min-h-svh">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      <LoginForm />
    </section>
  );
}
