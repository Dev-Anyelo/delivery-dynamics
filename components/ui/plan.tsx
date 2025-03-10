import { Badge } from "./badge";
import { Button } from "./button";
import { Plan } from "@/types/types";
import { InfoItem } from "./info-item";
import { Separator } from "./separator";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

import {
  ArrowUpRight,
  CalendarIcon,
  Clock,
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

export const PlanHeader = ({ plan }: { plan: Plan }) => (
  <section className="space-y-4">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Guía {plan.id}</h1>
        <p className="text-muted-foreground">{formatDate(plan.date)}</p>
      </div>
      <div className="flex justify-center items-center gap-4">
        <Badge
          className={`w-fit ${
            plan.operationType === "sales"
              ? "text-emerald-400 bg-emerald-900/70 dark:bg-emerald-900/50"
              : "text-blue-400 bg-blue-900/70 dark:bg-blue-900/50"
          }`}
          variant={getOperationTypeVariant(plan.operationType)}
        >
          {plan.operationType === "sales" ? (
            <Truck className="h-4 w-4 mr-1" />
          ) : (
            <ShoppingBagIcon className="h-4 w-4 mr-1" />
          )}
          {plan.operationType.charAt(0).toUpperCase() +
            plan.operationType.slice(1)}
        </Badge>

        <Button size="sm">
          Guardar
          <ArrowUpRight className="inline size-4" />
        </Button>
      </div>
    </div>
    <Separator />
  </section>
);

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
