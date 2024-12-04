"use client";

import * as z from "zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RouteSchema } from "@/schemas/schemas";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { findRoute, getDrivers, updateRoute } from "@/actions/actions";

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

const DeliveryRouteFormEdit = ({ routeId }: { routeId?: string }) => {
  const [date, setDate] = useState<Date | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [drivers, setDrivers] = useState<{ id: number; name: string }[]>([]);
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

  const fetchDrivers = async () => {
    try {
      const response = await getDrivers();
      setDrivers(response);
    } catch (err) {
      showMessage("error", "Error al cargar los conductores.");
    }
  };

  const fetchRouteDetails = async () => {
    setIsLoading(true);
    try {
      const result = await findRoute(Number(routeId));
      if (result.success) {
        reset(result.data);
        setValue("id", result.data.id);
        setValue("driverId", result.data.driverId);
        setDate(new Date(result.data.date));
        showMessage("success", "Datos de la ruta cargados correctamente.");
      } else {
        showMessage("error", result.message);
      }
    } catch (err: any) {
      showMessage("error", `Error al cargar la ruta. ${err.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
    fetchRouteDetails();
  }, [routeId]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const normalizedDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      setDate(normalizedDate);
      setValue("date", normalizedDate.toISOString());
    }
  };

  const handleFormSubmit = async (values: z.infer<typeof RouteSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await updateRoute(Number(routeId), values);
      if (result.success) {
        showMessage("success", "Ruta actualizada exitosamente.");
        fetchRouteDetails();
      } else {
        showMessage("error", result.message);
      }
    } catch (err: any) {
      showMessage(
        "error",
        `Error al actualizar la ruta. ${err.message || err}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle>Editar Ruta de Delivery</CardTitle>
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
          {/* Información de la Ruta */}
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
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "PPP", { locale: es })
                      ) : (
                        <span>Selecciona una fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
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

          {/* Información de la Orden */}
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
            ) : (
              "Guardar Cambios"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DeliveryRouteFormEdit;
