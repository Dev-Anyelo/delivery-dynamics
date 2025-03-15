import { format } from "date-fns";
import { Pin } from "lucide-react";
import { Order, Visit } from "@/types/types";
import { OrderCardDetailGuide } from "./order-card";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";

export const VisitsList = ({ visits }: { visits: Visit[] }) => (
  <div className="space-y-4">
    {visits.length === 0 ? (
      <Card>
        <CardContent className="py-6 text-center text-muted-foreground">
          No hay visitas programadas para este plan
        </CardContent>
      </Card>
    ) : (
      visits.map((visit, idx) => (
        <VisitCardGuideDetails
          key={visit.id || idx}
          visit={visit}
          index={idx + 1}
        />
      ))
    )}
  </div>
);

export const VisitCardGuideDetails = ({
  visit,
  index,
  highlight = "",
}: {
  visit: Visit;
  index: number;
  highlight?: string;
}) => {
  // Function to highlight matching text
  const highlightText = (text: string) => {
    if (!highlight || !text) return text;

    const regex = new RegExp(`(${highlight.trim()})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <span
          key={i}
          className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-xl">
              Visita #{index}:{" "}
              {visit.customer?.name
                ? highlightText(visit.customer.name)
                : "Cliente desconocido"}
            </CardTitle>
            {visit.customer?.id && (
              <CardDescription className="flex items-center gap-1 mt-1 space-x-2 text-sm">
                ID Cliente: {highlightText(visit.customer.id)}{" "}
                <Pin className="size-3 transform rotate-45" />
              </CardDescription>
            )}

            {visit.address && (
              <CardDescription className="text-sm mt-1">
                {highlightText(visit.address)}
              </CardDescription>
            )}

            {visit.notes && (
              <CardDescription className="text-sm mt-1">
                <span className="text-muted-foreground">Notas:</span>{" "}
                {highlightText(visit.notes)}
              </CardDescription>
            )}
          </div>

          {(visit.plannedArrivalTime || visit.actualArrivalTime) && (
            <div className="flex flex-col gap-1 text-sm">
              {visit.plannedArrivalTime && (
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Planificado:</span>
                  <span>
                    {highlightText(
                      format(new Date(visit.plannedArrivalTime), "p")
                    )}
                  </span>
                </div>
              )}
              {visit.actualArrivalTime && (
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Real:</span>
                  <span>
                    {highlightText(
                      format(new Date(visit.actualArrivalTime), "p")
                    )}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {visit.orders && visit.orders.length > 0 ? (
          <div className="space-y-4">
            {visit.orders.map((order: Order, orderIdx: number) => (
              <OrderCardDetailGuide key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No hay órdenes para esta visita
          </p>
        )}
      </CardContent>
    </Card>
  );
};
