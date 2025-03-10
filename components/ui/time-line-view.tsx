import { Plan, Visit } from "@/types/types";
import { format } from "date-fns";
import { Clock, MapPin, Truck } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { formatDate } from "@/lib/utils";

export const TimelineView = ({ plan }: { plan: Plan }) => (
  <Card>
    <CardHeader>
      <CardTitle>Línea de Tiempo</CardTitle>
      <CardDescription>Resumen de la ejecución del plan</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary/20 text-primary rounded-full p-2">
            <Truck className="h-5 w-5" />
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
            <div className="bg-primary/20 text-primary rounded-full p-2">
              <Clock className="h-5 w-5" />
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
                <div className="bg-primary/20 text-primary rounded-full p-2">
                  <MapPin className="h-5 w-5" />
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
            <div className="bg-primary/20 text-primary rounded-full p-2">
              <Clock className="h-5 w-5" />
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
