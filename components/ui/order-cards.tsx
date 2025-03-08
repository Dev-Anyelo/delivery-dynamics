"use client";

import { z } from "zod";
import { useState } from "react";
import { OrderProps } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderSchema } from "@/schemas/schemas";
import { formatDate, formatTime } from "@/lib/utils";

import {
  Calendar,
  Clock,
  MapPin,
  User,
  ChevronRight,
  CheckCircle,
  Timer,
  DollarSign,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function OrderCards({ orders }: OrderProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // TODO: Implement toggleExpand function and get info from API
  const toggleExpand = (id: string | undefined) => {
    if (!id) return;
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <>
      {orders.map((order: z.infer<typeof OrderSchema>, index: number) => (
        <Card
          key={order.id || index}
          className="overflow-hidden transition-all duration-500 hover:border-l-emerald-700 border-l-4 border-l-blue-700 hover:bg-primary/5 group"
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary font-semibold group-hover:bg-emerald-500/15 group-hover:text-emerald-500 transition-all duration-500"
              >
                Orden {index + 1}
              </Badge>
              {order.status === "delivered" ? (
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
                  <Timer className="size-3" />
                  Pendiente
                </Badge>
              )}
            </div>

            <CardTitle className="text-lg font-semibold mt-2 flex items-center gap-2">
              <Calendar className="size-4 text-primary" />
              {order.serviceDate
                ? formatDate(order.serviceDate)
                : "Fecha pendiente"}
            </CardTitle>

            {order.statusTimestamp && (
              <CardDescription className="text-sm flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                {formatTime(order.statusTimestamp)}
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
                  {order.customer?.name || "Sin asignar"}
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
                  {order.address?.address || "Sin especificar"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <DollarSign className="size-4 text-primary shrink-0" />
              <div className="flex flex-col">
                <span className="font-medium text-muted-foreground">Valor</span>
                <span className="font-semibold">
                  {order.value.toLocaleString("es-ES", {
                    style: "currency",
                    currency: "USD",
                  })}
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-0">
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-primary hover:text-primary/80 p-0 h-8 flex items-center gap-1 px-2"
              onClick={() => toggleExpand(order.id)}
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
