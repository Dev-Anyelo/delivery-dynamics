import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <section className="relative flex flex-col space-y-8 justify-center items-center h-screen w-full min-h-svh p-6 md:p-10">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      <div className="w-full max-w-sm md:max-w-3xl space-y-8 z-50">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl max-w-4xl text-balance text-center">
          Bienvenido de vuelta, inicia sesión en tu cuenta
        </h1>
        <LoginForm />
      </div>
    </section>
  );
}
