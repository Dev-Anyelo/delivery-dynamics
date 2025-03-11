import { toast } from "sonner";
import { Badge } from "./badge";
import { useState } from "react";
import { Button } from "./button";
import { Plan } from "@/types/types";
import { InfoItem } from "./info-item";
import { Separator } from "./separator";
import { saveGuide } from "@/actions/actions";
import { PlansSchema } from "@/schemas/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

import {
  ArrowUpRight,
  CalendarIcon,
  Clock,
  Loader2,
  MapPin,
  ShoppingBagIcon,
  Truck,
  User,
} from "lucide-react";

import {
  formatDate,
  formatDuration,
  getOperationTypeVariant,
} from "@/lib/utils";

export const PlanHeader = ({ plan }: { plan: Plan }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Componente de React
  const handleSaveGuide = async () => {
    setIsLoading(true);
    try {
      const validatedGuide = PlansSchema.parse([plan]);
      const response = await saveGuide(validatedGuide);

      if (!response.success) {
        throw new Error(response.message);
      }

      toast.success(response.message || "Guía guardada correctamente");
      return response.data;
    } catch (error: any) {
      console.error("Error al guardar la guía:", error);
      toast.error(error.message || "Error al guardar la guía");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Guía #{plan.id}
          </h1>
          <p className="text-sm text-muted-foreground">
            {formatDate(plan.date)}
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-3">
          <Badge
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
              plan.operationType === "sales"
                ? "text-emerald-400 bg-emerald-900/30 hover:bg-emerald-900/40"
                : "text-blue-400 bg-blue-900/30 hover:bg-blue-900/40"
            }`}
            variant={getOperationTypeVariant(plan.operationType)}
          >
            {plan.operationType === "sales" ? (
              <Truck className="size-4" />
            ) : (
              <ShoppingBagIcon className="size-4" />
            )}
            <span className="capitalize">{plan.operationType}</span>
          </Badge>

          <Button
            type="submit"
            size="sm"
            className="flex justify-center items-center group"
            onClick={handleSaveGuide}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Guardando Guía...
              </>
            ) : (
                <>
                Guardar Guía
                <ArrowUpRight className="size-4 transform group-hover:translate-x-[1.5px] group-hover:-translate-y-[1.5px] transition-transform duration-200" />
                </>
            )}
          </Button>
        </div>
      </div>

      <Separator className="mt-2" />
    </section>
  );
};

export const PlanDetails = ({ plan }: { plan: Plan }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          <span>Información de la Ruta</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="ID de Ruta" value={plan.routeId} />
          <InfoItem label="ID del Camión" value={plan.truckId} />
          <InfoItem
            label="Segmento de Negocio"
            value={plan.businessSegmentId}
          />
          <InfoItem
            label="Tiempo Total Planificado"
            value={
              plan.plannedTotalTimeH !== null
                ? `${plan.plannedTotalTimeH} horas`
                : undefined
            }
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <MapPin className="size-4" />
            <span>Dirección</span>
          </h4>

          <div className="pl-6 border-l-2 border-muted space-y-3">
            <div>
              <p className="text-sm font-medium">Punto de Inicio</p>
              {plan.startPoint ? (
                <div className="text-sm">
                  <p className="font-medium">{plan.startPoint.name}</p>
                  <p className="text-muted-foreground">
                    {plan.startPoint.address}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No especificado</p>
              )}
            </div>

            <div>
              <p className="text-sm font-medium">Punto Final</p>
              {plan.endPoint ? (
                <div className="text-sm">
                  <p className="font-medium">{plan.endPoint.name}</p>
                  <p className="text-muted-foreground">
                    {plan.endPoint.address}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No especificado</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <span>Horario y Asignación</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <InfoItem
            label="Usuario Asignado"
            value={plan.assignedUserId}
            icon={<User className="size-4" />}
          />

          <div>
            <p className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="size-4" />
              <span>Fechas Activas</span>
            </p>
            {plan.activeDates && plan.activeDates.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {plan.activeDates.map((date: any, index: any) => (
                  <Badge key={index} variant="outline">
                    {formatDate(date)}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Sin fechas activas
              </p>
            )}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="font-medium">Ejecución Real</h4>

          <div className="grid grid-cols-1 gap-2">
            <InfoItem
              label="Inició"
              value={
                plan.actualStartTimestamp
                  ? formatDate(plan.actualStartTimestamp)
                  : undefined
              }
            />
            <InfoItem
              label="Finalizó"
              value={
                plan.actualEndTimestamp
                  ? formatDate(plan.actualEndTimestamp)
                  : undefined
              }
            />

            {plan.actualStartTimestamp && plan.actualEndTimestamp && (
              <InfoItem
                label="Duración"
                value={formatDuration(
                  new Date(plan.actualEndTimestamp).getTime() -
                    new Date(plan.actualStartTimestamp).getTime()
                )}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
