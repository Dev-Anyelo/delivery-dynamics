"use client";

import { z } from "zod";
import { useState } from "react";
import { Separator } from "./separator";
import { VisitProps } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { OrderSchema, OrderStatus } from "@/schemas/schemas";

import {
  Calendar,
  Clock,
  MapPin,
  User,
  ChevronRight,
  CheckCircle,
  Timer,
  FileText,
  DollarSign,
  Tag,
  TrendingUp,
  CalendarDays,
  AlertCircle,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function VisitCard({ visits }: VisitProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleExpand = (id?: string) => {
    const identifier = id ?? "";
    setExpandedCard((prev) => (prev === identifier ? null : identifier));
  };

  return (
    <>
      {visits.map((visit, index) => {
        const visitId = visit.id || index.toString();
        return (
          <Card
            key={visitId}
            className="overflow-hidden transition-all duration-300 hover:border-l-emerald-600 border-l-4 border-l-blue-600 hover:bg-slate-50 dark:hover:bg-slate-900/30 group shadow-sm hover:shadow-md"
          >
            <CardHeader className="pb-3 space-y-3">
              {/* Header with Badge and Status */}
              <div className="flex justify-between items-center">
                <Badge
                  variant="outline"
                  className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/40 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-all duration-300 px-3 py-1"
                >
                  Visita {index + 1}
                </Badge>
                {visit.actualArrivalTimestamp ? (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium transition-all duration-300 px-3 py-1"
                  >
                    <CheckCircle className="size-3.5" />
                    Completada
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-medium transition-all duration-300 px-3 py-1"
                  >
                    <Timer className="size-3.5" />
                    Pendiente
                  </Badge>
                )}
              </div>

              {/* Date and Time */}
              <div className="space-y-1.5">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <CalendarDays className="size-4" />
                  {visit.actualArrivalTimestamp
                    ? formatDate(visit.actualArrivalTimestamp)
                    : "Fecha pendiente"}
                </CardTitle>
                {visit.actualArrivalTimestamp && (
                  <CardDescription className="text-sm flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Clock className="size-4 text-slate-400 dark:text-slate-500" />
                    {formatTime(visit.actualArrivalTimestamp)}
                  </CardDescription>
                )}
              </div>
            </CardHeader>

            <Separator className="mb-3" />

            <CardContent className="space-y-4 pt-3">
              {/* Customer Info */}
              <div className="flex items-start gap-3 text-sm">
                <User className="size-4 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-medium text-slate-500 dark:text-slate-400 text-[13px]">
                    Cliente
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {visit.customer?.name || "Sin asignar"}
                  </span>
                </div>
              </div>

              {/* Address Info */}
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="size-4 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-medium text-slate-500 dark:text-slate-400 text-[13px]">
                    Dirección
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {visit.customer?.address || "Sin especificar"}
                  </span>
                </div>
              </div>

              {/* Arrival Time */}
              {visit.actualArrivalTimestamp && (
                <div className="flex items-start gap-3 text-sm">
                  <Timer className="size-4 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-500 dark:text-slate-400 text-[13px]">
                      Hora de llegada
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatTime(visit.actualArrivalTimestamp)}
                    </span>
                  </div>
                </div>
              )}

              {/* Orders Section with Animation */}
              <AnimatePresence>
                {expandedCard === visitId &&
                  (visit.orders && visit.orders.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                        transition: {
                          height: { duration: 0.3, ease: "easeInOut" },
                          opacity: { duration: 0.2, delay: 0.1 },
                        },
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                        transition: {
                          height: { duration: 0.3, ease: "easeInOut" },
                          opacity: { duration: 0.2 },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="mt-5 space-y-5">
                        <motion.div
                          initial={{ y: -10, opacity: 0 }}
                          animate={{
                            y: 0,
                            opacity: 1,
                            transition: { delay: 0.1, duration: 0.2 },
                          }}
                          className="flex items-center gap-2"
                        >
                          <div className="h-px bg-slate-200 dark:bg-slate-700 flex-grow" />
                          <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                            <FileText className="size-4" />
                            Órdenes asociadas
                          </h4>
                          <div className="h-px bg-slate-200 dark:bg-slate-700 flex-grow" />
                        </motion.div>

                        {visit.orders.map(
                          (
                            order: z.infer<typeof OrderSchema>,
                            orderIndex: number
                          ) => (
                            <motion.div
                              key={order.id}
                              initial={{ y: 20, opacity: 0 }}
                              animate={{
                                y: 0,
                                opacity: 1,
                                transition: {
                                  delay: 0.15 + orderIndex * 0.05,
                                  duration: 0.25,
                                  ease: "easeOut",
                                },
                              }}
                              className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-slate-800/50"
                            >
                              {/* Order Header */}
                              <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                                    <MapPin className="size-4 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <span className="font-medium text-slate-800 dark:text-slate-200">
                                    {order.address?.address ||
                                      "Sin especificar"}
                                  </span>
                                </div>

                                {/* Order Status Badge */}
                                {order.status ===
                                OrderStatus.Values.completed ? (
                                  <Badge
                                    variant="secondary"
                                    className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium px-2.5"
                                  >
                                    <CheckCircle className="size-3 mr-1" />
                                    Completada
                                  </Badge>
                                ) : order.status ===
                                  OrderStatus.Values.in_progress ? (
                                  <Badge
                                    variant="secondary"
                                    className="text-blue-400 bg-blue-900/70 dark:bg-blue-900/50 font-medium px-2.5"
                                  >
                                    <TrendingUp className="size-3 mr-1" />
                                    En Progreso
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="secondary"
                                    className="text-amber-400 bg-amber-900/70 dark:bg-amber-900/50 font-medium px-2.5"
                                  >
                                    <Timer className="size-3 mr-1" />
                                    Pendiente
                                  </Badge>
                                )}
                              </div>

                              {/* Order Details with staggered animation */}
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{
                                  opacity: 1,
                                  transition: {
                                    delay: 0.2 + orderIndex * 0.05,
                                    duration: 0.3,
                                  },
                                }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600"
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="size-3.5 text-slate-500 dark:text-slate-400" />
                                    <span className="text-slate-700 dark:text-slate-300">
                                      {order.serviceDate
                                        ? formatDate(order.serviceDate)
                                        : "Sin fecha"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="size-3.5 text-slate-500 dark:text-slate-400" />
                                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                                      {order.value.toLocaleString("es-ES", {
                                        style: "currency",
                                        currency: "USD",
                                      })}
                                    </span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Tag className="size-3.5 text-slate-500 dark:text-slate-400" />
                                    <span className="text-slate-700 dark:text-slate-300">
                                      ID: {order.customerId || "Sin asignar"}
                                    </span>
                                  </div>
                                  {order.instructions && (
                                    <div className="flex items-start gap-2">
                                      <FileText className="size-3.5 text-slate-500 dark:text-slate-400 mt-0.5" />
                                      <span className="text-slate-700 dark:text-slate-300">
                                        {order.instructions}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            </motion.div>
                          )
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                        transition: {
                          height: { duration: 0.3, ease: "easeInOut" },
                          opacity: { duration: 0.2, delay: 0.1 },
                        },
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                        transition: {
                          height: { duration: 0.3, ease: "easeInOut" },
                          opacity: { duration: 0.2 },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="mt-5 flex flex-col items-center justify-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm bg-white dark:bg-slate-800">
                        <AlertCircle className="size-4 text-muted-foreground" />
                        <h4 className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                          No hay órdenes asociadas
                        </h4>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </CardContent>

            <CardFooter className="pt-0">
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto text-blue-600 dark:text-blue-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300 flex items-center gap-1.5 px-3 py-1 h-9 font-medium"
                onClick={() => toggleExpand(visitId)}
              >
                <span>
                  {expandedCard === visitId
                    ? "Ocultar detalles"
                    : "Ver detalles"}
                </span>
                <motion.div
                  animate={{
                    rotate: expandedCard === visitId ? 90 : 0,
                    transition: { duration: 0.3 },
                  }}
                >
                  <ChevronRight className="size-4" />
                </motion.div>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </>
  );
}
