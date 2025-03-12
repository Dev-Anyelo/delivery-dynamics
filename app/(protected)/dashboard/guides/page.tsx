"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { GuidesTable } from "@/components/tablets/guides-tablet";

const GuidePage = () => {
  const router = useRouter();
  // const { user } = useAuth();

  // if (!user) router.push("/auth/login");

  return <GuidesTable />;
};

export default GuidePage;
