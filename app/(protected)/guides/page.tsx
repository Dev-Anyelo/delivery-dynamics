import { GuidesTable } from "@/components/tablets/guides-tablet";

const GuidePage = () => {
  return (
    <section className="space-y-2">
      <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl">
        Guías disponibles
      </h1>
      <p className="text-sm text-muted-foreground">
        Gestiona todas las guías disponibles en la plataforma.
      </p>
      <GuidesTable />
    </section>
  );
};

export default GuidePage;
