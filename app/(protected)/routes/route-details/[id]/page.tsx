"use client";

import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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

  return <DeliveryRouteForm routeId={routeId} />;
};

export default RouteDetailsPage;
