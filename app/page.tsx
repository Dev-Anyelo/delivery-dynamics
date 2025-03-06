"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none opacity-40"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/50"></div>

      <div className="z-10 text-center text-foreground space-y-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl max-w-4xl text-balance text-center">
          Bienvenido a Delivery Dynamics
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-xl mx-auto text-balance text-center">
          Inicia sesión para continuar
        </p>
        <Button
          onClick={() => router.push("/auth/login")}
          className="px-6 py-2 rounded-lg"
        >
          Empezar <ArrowUpRight />
        </Button>
      </div>
    </div>
  );
}
