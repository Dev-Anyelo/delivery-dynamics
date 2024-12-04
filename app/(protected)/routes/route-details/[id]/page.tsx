"use client";

import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DeliveryRouteForm from "@/components/delivery-route-form";

const RouteDetailsPage = () => {
  const { id } = useParams();
  const [routeId, setRouteId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof id === "string") {
      setRouteId(id);
    }
  }, [id]);

  if (!routeId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="flex items-center">
          <Loader className="size-5 mr-2 animate-spin" />
          Cargando...
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="scroll-m-10 text-2xl font-extrabold tracking-tight lg:text-3xl mx-auto">
        Editar Ruta
      </h1>

      <p className="text-sm text-muted-foreground mx-auto">
        Aquí puedes editar y ver los detalles la ruta seleccionada.
      </p>
      <DeliveryRouteForm routeId={routeId} />
    </>
  );
};

export default RouteDetailsPage;
