"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/toggle-theme";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center sm:text-left">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Bienvenido a <span className="text-blue-600">Delivery Dynamics</span>
        </h1>
        <div className="w-full flex justify-center items-center  gap-x-5 flex-wrap">
          <Link href="/routes">
            <Button>Dashboard</Button>
          </Link>
          <ModeToggle />
        </div>
      </main>
    </div>
  );
}
