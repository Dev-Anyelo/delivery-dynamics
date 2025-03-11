import { formatDate } from "@/lib/utils";
import { Plan, Visit } from "@/types/types";
import { Clock, MapPin, Truck } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";

export const TimelineView = ({ plan }: { plan: Plan }) => (
  <Card>
    <CardHeader>
      <CardTitle>Línea de Tiempo</CardTitle>
      <CardDescription>Resumen de la ejecución del plan</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="bg-blue-500/15 text-blue-500 rounded-full p-2">
            <Truck className="size-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Plan Creado</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(plan.date)}
            </p>
          </div>
        </div>

        {plan.actualStartTimestamp && (
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/15 text-blue-500 rounded-full p-2">
              <Clock className="size-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Inicio del Plan</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(plan.actualStartTimestamp)}
              </p>
            </div>
          </div>
        )}

        {plan.visits.map(
          (visit: Visit, idx: number) =>
            visit.actualArrivalTime && (
              <div key={idx} className="flex items-center gap-4">
                <div className="bg-blue-500/15 text-blue-500 rounded-full p-2">
                  <MapPin className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    Visita a {visit.customer?.name || `Cliente #${idx + 1}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(visit.actualArrivalTime)}
                  </p>
                </div>
              </div>
            )
        )}

        {plan.actualEndTimestamp && (
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/15 text-blue-500 rounded-full p-2">
              <Clock className="size-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Plan Completado</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(plan.actualEndTimestamp)}
              </p>
            </div>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);
