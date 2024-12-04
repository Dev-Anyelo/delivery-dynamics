"use client";

import * as z from "zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RouteSchema } from "@/schemas/schemas";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  createRoute,
  findRoute,
  getDrivers,
  updateRoute,
} from "@/actions/actions";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DeliveryRouteForm({ routeId }: { routeId?: string }) {
  const [date, setDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [drivers, setDrivers] = useState<{ id: number; name: string }[]>([]);

  const [searchId, setSearchId] = useState<number | null>(
    routeId ? parseInt(routeId) : null
  );

  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const formMethods = useForm<z.infer<typeof RouteSchema>>({
    resolver: zodResolver(RouteSchema),
    defaultValues: {
      driverId: 0,
      date: "",
      notes: "",
      orders: [
        {
          id: 0,
          sequence: 0,
          value: 0,
          priority: false,
        },
      ],
    },
  });

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = formMethods;

  const showMessage = (type: "error" | "success", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Obtener conductores
  const fetchDrivers = async () => {
    try {
      const response = await getDrivers();
      setDrivers(response);
    } catch (err) {
      showMessage("error", "Error al cargar los conductores.");
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Buscar ruta por ID
  const onSearchRoute = async () => {
    if (!searchId || searchId <= 0) {
      showMessage("error", "Por favor, ingresa un ID válido.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await findRoute(Number(searchId));

      if (result.success) {
        reset(result.data);
        setValue("id", result.data.id);
        setValue("driverId", result.data.driverId);
        setDate(result.data.date);
        showMessage("success", result.message);
      } else {
        showMessage("error", result.message);
      }
    } catch (err: any) {
      showMessage("error", `Error al buscar la ruta. ${err.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Solo ejecuta la búsqueda cuando se pasa un routeId (para la edición)
  useEffect(() => {
    if (routeId) {
      setSearchId(parseInt(routeId));
      onSearchRoute();
    }
  }, [routeId]);

  // Crear o actualizar ruta
  const handleFormSubmit = async (values: z.infer<typeof RouteSchema>) => {
    setIsSubmitting(true);
    try {
      let result;

      // Si hay routeId, significa que es una actualización
      if (routeId) {
        result = await updateRoute(Number(routeId), values);
      } else {
        // Si no hay routeId, intentamos buscar la ruta en la base de datos
        const existingRoute = await findRoute(Number(values.id));

        if (!existingRoute.success) {
          // Si no existe en la base de datos, creamos una nueva ruta
          result = await createRoute(values);
        } else {
          // Si existe en la base de datos, realizamos la actualización
          result = await updateRoute(Number(existingRoute.data.id), values);
        }
      }

      if (result.success) {
        showMessage("success", result.message);
        reset();
        setDate(undefined);
      } else {
        showMessage("error", result.message);
      }
    } catch (err: any) {
      showMessage("error", `Error al guardar la ruta. ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle>
          {routeId ? "Editar Ruta de Delivery" : "Crear Nueva Ruta de Delivery"}
        </CardTitle>
        {!routeId && (
          <div className="flex items-center space-x-2 pt-2">
            <Input
              type="number"
              className="flex-grow"
              placeholder="Buscar ID de ruta"
              value={searchId || ""}
              onChange={(e) => setSearchId(Number(e.target.value) || null)}
              disabled={isLoading}
            />
            <Button
              type="button"
              size="icon"
              onClick={onSearchRoute}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="w-6 h-6 animate-spin" />
              ) : (
                <Search className="w-6 h-6" />
              )}
            </Button>
          </div>
        )}
        {message && (
          <p
            className={
              message.type === "error" ? "text-red-500" : "text-green-500"
            }
          >
            {message.text}
          </p>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Ruta</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="routeId">ID de la Ruta</Label>
                <Input
                  id="routeId"
                  {...register("id", { valueAsNumber: true })}
                  disabled
                  placeholder="ID de la ruta"
                />
                {errors.id && (
                  <span className="text-red-500">{errors.id.message}</span>
                )}
              </div>
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="driverId">Nombre del Conductor</Label>
                <Select
                  {...register("driverId", { valueAsNumber: true })}
                  disabled={isLoading}
                  value={watch("driverId").toString()}
                  onValueChange={(value) => setValue("driverId", Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {drivers?.find((d) => d.id === watch("driverId"))?.name ||
                        "Selecciona un conductor"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {drivers?.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id.toString()}>
                        {driver.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.driverId && (
                  <span className="text-red-500">
                    {errors.driverId.message}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="scheduledDate">Fecha Programada</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      disabled={isLoading}
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon />
                      {date ? (
                        format(date, "PPP")
                      ) : (
                        <span>Selecciona una fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors && (
                  <span className="text-red-500">
                    {errors.date?.message || ""}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  {...register("notes")}
                  rows={5}
                  disabled={isLoading}
                  placeholder="Escribe notas adicionales"
                />
                {errors.notes && (
                  <span className="text-red-500">{errors.notes.message}</span>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Información de la Orden</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              {watch("orders")?.map((order, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor={`orders.${index}.sequence`}>
                      Secuencia
                    </Label>
                    <Input
                      id={`orders.${index}.sequence`}
                      {...register(`orders.${index}.sequence`, {
                        valueAsNumber: true,
                      })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={`orders.${index}.value`}>Valor $</Label>
                    <Input
                      id={`orders.${index}.value`}
                      {...register(`orders.${index}.value`, {
                        valueAsNumber: true,
                      })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-x-3">
                    <Switch
                      id={`orders.${index}.priority`}
                      checked={watch(`orders.${index}.priority`)}
                      onCheckedChange={(checked) =>
                        setValue(`orders.${index}.priority`, checked)
                      }
                      disabled={isLoading}
                    />
                    <Label htmlFor={`orders.${index}.priority`}>
                      Prioritaria
                    </Label>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="size-4 mr-2 animate-spin" />
            ) : routeId ? (
              "Actualizar Ruta"
            ) : (
              "Crear Ruta"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
