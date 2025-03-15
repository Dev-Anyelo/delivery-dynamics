import { Metadata } from "next";
import { GuidesTable } from "@/components/tablets/guides-tablet";

export const metadata: Metadata = {
  title: "Guías de Distribución",
  description: "Gestión de guías de distribución de productos masivos.",
};

const GuidePage = () => {
  return <GuidesTable />;
};

export default GuidePage;
