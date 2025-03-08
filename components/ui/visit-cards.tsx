"use client";

import { z } from "zod";
import { useState } from "react";
import { VisitProps } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VisitSchema } from "@/schemas/schemas";
import { formatDate, formatTime } from "@/lib/utils";

import {
  Calendar,
  Clock,
  MapPin,
  User,
  ChevronRight,
  CheckCircle,
  Timer,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function VisitCards({ visits }: VisitProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // TODO: Implement toggleExpand function and get info from API
  const toggleExpand = (id: string | undefined) => {
    if (!id) return;
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <>
      {visits.map((visit: z.infer<typeof VisitSchema>, index: number) => (
        <Card
          key={visit.id || index}
          className="overflow-hidden transition-all duration-500 hover:border-l-emerald-700 border-l-4 border-l-blue-700 hover:bg-primary/5 group"
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary font-semibold group-hover:bg-emerald-500/15 group-hover:text-emerald-500 transition-all duration-500"
              >
                Visita {index + 1}
              </Badge>
              {visit.actualArrivalTimestamp ? (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 rounded-full text-primary font-semibold bg-blue-500/15 text-blue-500 transition-all duration-500 justify-center"
                >
                  <CheckCircle className="size-4" />
                  Completada
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 rounded-full text-primary font-semibold bg-yellow-500/15 text-yellow-500 transition-all duration-500 justify-center"
                >
                  <Timer className="size-4" />
                  Pendiente
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg font-semibold mt-2 flex items-center gap-2">
              <Calendar className="size-4 text-primary" />
              {visit.actualArrivalTimestamp
                ? formatDate(visit.actualArrivalTimestamp)
                : "Fecha pendiente"}
            </CardTitle>
            {visit.actualArrivalTimestamp && (
              <CardDescription className="text-sm flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                {formatTime(visit.actualArrivalTimestamp)}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-sm">
              <User className="size-4 text-primary shrink-0" />
              <div className="flex flex-col">
                <span className="font-medium text-muted-foreground">
                  Cliente
                </span>
                <span className="font-semibold">
                  {visit.customer?.name || "Sin asignar"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <MapPin className="size-4 text-primary shrink-0" />
              <div className="flex flex-col">
                <span className="font-medium text-muted-foreground">
                  Dirección
                </span>
                <span className="font-semibold">
                  {visit.customer?.address || "Sin especificar"}
                </span>
              </div>
            </div>

            {visit.actualArrivalTimestamp && (
              <div className="flex items-center gap-3 text-sm">
                <Clock className="size-4 text-primary shrink-0" />
                <div className="flex flex-col">
                  <span className="font-medium text-muted-foreground">
                    Hora de llegada
                  </span>
                  <span className="font-semibold">
                    {formatTime(visit.actualArrivalTimestamp)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-primary hover:text-primary/80 p-0 h-8 flex items-center gap-1 px-2"
              onClick={() => toggleExpand(visit.id)}
            >
              Ver detalles
              <ChevronRight className="size-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
