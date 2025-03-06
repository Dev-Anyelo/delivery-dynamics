import { RoutesTable } from "@/components/tablets/routes-table";

const RoutesPage = () => {
  return (
    <div className="space-y-2">
      <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl">
        Todas las rutas disponibles
      </h1>
      <p className="text-sm text-muted-foreground">
        Gestiona todas las rutas disponibles en la plataforma.
      </p>
      <RoutesTable />
    </div>
  );
};

export default RoutesPage;
