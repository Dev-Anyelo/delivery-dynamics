"use client";

import * as z from "zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Loader, Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RouteSchema } from "@/schemas/schemas";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { useForm, FormProvider } from "react-hook-form";
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

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { FormError } from "./form-errors";
import { FormSuccess } from "./form-success";
import { Driver } from "@/interfaces/interfaces";

const DeliveryRouteForm = ({ routeId }: { routeId?: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchId, setSearchId] = useState<number | null>(null);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  // const [drivers, setDrivers] = useState<Driver[]>([]);

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

  const { handleSubmit, setValue, watch, reset, formState } = formMethods;

  // Cargar conductores
  // useEffect(() => {
  //   const fetchDrivers = async () => {
  //     try {
  //       const driversData = await getDrivers();
  //       setDrivers(driversData);
  //     } catch (error: any) {
  //       setMessage({ type: "error", text: error.message });
  //     }
  //   };

  //   fetchDrivers();
  // }, []);

  // Cargar datos de la ruta si se proporciona un ID
  useEffect(() => {
    if (routeId) {
      const fetchRouteData = async () => {
        setIsLoading(true);
        try {
          const result = await findRoute(Number(routeId));
          if (result.success) {
            reset(result.data);
            setValue("driverId", result.data.driverId);
            setDate(new Date(result.data.date));
            setMessage({ type: "success", text: result.message });
          } else {
            setMessage({ type: "error", text: "Ruta no encontrada" });
            reset({
              id: Number(routeId),
              driverId: 0,
              date: new Date().toISOString(),
              notes: "",
              orders: [],
            });
          }
        } catch (err: any) {
          setMessage({ type: "error", text: `Error: ${err.message || err}` });
        } finally {
          setIsLoading(false);
        }
      };

      fetchRouteData();
    }
  }, [routeId, reset, setValue]);

  // Mostrar mensajes de error o éxito
  const showMessage = (type: "error" | "success", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // useEffect(() => {
  //   const fetchDrivers = async () => {
  //     try {
  //       const response = await getDrivers();
  //       console.log("Conductores cargados:", response);
  //       if (response.success) {
  //         setDrivers(response.data);
  //       } else {
  //         showMessage("error", "No se encontraron conductores.");
  //       }
  //     } catch (err) {
  //       console.error("Error fetching drivers:", err);
  //       showMessage("error", "Error al cargar los conductores.");
  //     }
  //   };

  //   fetchDrivers();
  // }, []);

  // Buscar ruta por ID
  const onSearchRoute = async () => {
    if (!searchId || searchId <= 0) {
      showMessage("error", "Por favor, ingresa un ID válido.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await findRoute(searchId);

      if (result.success) {
        reset(result.data);
        setValue("id", Number(result.data.id));
        setValue("driverId", result.data.driverId);
        setDate(new Date(result.data.date));
        showMessage("success", result.message);
      } else {
        showMessage("error", result.message || "Ruta no encontrada");
        reset({
          id: searchId,
          driverId: 0,
          date: new Date().toISOString(),
          notes: "",
          orders: [],
        });
      }
    } catch (err: any) {
      showMessage("error", `Error: ${err.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const normalizedDate = format(
        new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        ),
        "yyyy-MM-dd"
      );
      setDate(selectedDate);
      setValue("date", normalizedDate);
    } else {
      setDate(new Date());
    }
  };

  // Crear o actualizar ruta de delivery
  const handleFormSubmit = async (values: z.infer<typeof RouteSchema>) => {
    if (values.orders.length < 1) {
      showMessage("error", "Debe haber al menos una orden asociada.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (routeId) {
        const id = Number(routeId);
        const result = await updateRoute(id, values);

        if (!result.success) {
          showMessage("error", result.error || "Error al guardar la ruta.");
          return;
        }

        showMessage(
          "success",
          result.message || "Ruta guardada correctamente."
        );
        return;
      }

      const { id, ...rest } = values;
      const payload = id ? values : rest;

      const result = await createRoute(payload);

      if (!result.success) {
        showMessage("error", result.error || "Error al guardar la ruta.");
        return;
      }

      showMessage("success", result.message || "Ruta guardada correctamente.");
      reset();
    } catch (err: any) {
      showMessage("error", `Error al guardar la ruta. ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {routeId
              ? "Editar Ruta de Delivery"
              : "Crear Nueva Ruta de Delivery"}
          </CardTitle>
          {!routeId && (
            <div className="flex items-center space-x-2 pt-2">
              <Input
                className="flex-grow"
                placeholder="Buscar ID de ruta"
                value={Number(searchId) || ""}
                onChange={(e) => setSearchId(Number(e.target.value) || null)}
                disabled={isLoading || isSubmitting}
              />
              <Button
                type="button"
                size="icon"
                onClick={onSearchRoute}
                disabled={isLoading || isSubmitting}
              >
                {isLoading ? (
                  <Loader className="w-6 h-6 animate-spin" />
                ) : (
                  <Search className="w-6 h-6" />
                )}
              </Button>
            </div>
          )}
          {message?.type === "error" && <FormError message={message.text} />}
          {message?.type === "success" && (
            <FormSuccess message={message.text} />
          )}
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Información de la Ruta */}
            <Card>
              <CardHeader>
                <CardTitle>Información de la Ruta</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  name="id"
                  control={formMethods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID de la Ruta</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled
                          placeholder="ID de la ruta"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="driverId"
                  control={formMethods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Conductor</FormLabel>
                      <FormControl>
                        {/* {drivers.length > 0 ? ( */}
                          <Select
                            value={field.value?.toString() || ""}
                            onValueChange={(value) =>
                              setValue("driverId", Number(value))
                            }
                            disabled={isLoading || isSubmitting}
                          >
                            <SelectTrigger>
                              <SelectValue>
                                {/* {(Array.isArray(drivers) &&
                                  drivers.find((d) => d.id === field.value)
                                    ?.name) ||
                                  "Selecciona un conductor"} */}
                                Selecciona un conductor
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {/* {drivers.map((driver) => (
                                <SelectItem
                                  key={driver.id}
                                  value={driver.id.toString()}
                                >
                                  {driver.name}
                                </SelectItem>
                              ))} */}
                              Anyelo Benavides
                            </SelectContent>
                          </Select>
                        {/* ) : (
                          <Select disabled value=" ">
                            <SelectTrigger>
                              <SelectValue>
                                <div className="flex items-center space-x-2">
                                  <Loader className="size-4 animate-spin" />
                                  <span>Cargando conductores</span>
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                          </Select>
                        )} */}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="date"
                  control={formMethods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha Programada</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                              )}
                              disabled={isLoading || isSubmitting}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date && !isNaN(date.getTime()) ? (
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="notes"
                  control={formMethods.control}
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Notas</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value ?? ""}
                          rows={5}
                          disabled={isLoading || isSubmitting}
                          placeholder="Escribe notas adicionales"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Información de la Orden */}
            <Card>
              <CardHeader>
                <CardTitle>Información de la Orden</CardTitle>
              </CardHeader>
              <CardContent
                className={
                  `w-full ${
                    isLoading
                      ? "flex justify-center items-center"
                      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  } ` + (isLoading ? "opacity-50" : "")
                }
              >
                {isLoading ? (
                  <div className="flex justify-center items-center space-x-2">
                    <Loader className="size-4 animate-spin" />
                    <span>Cargando Ordenes</span>
                  </div>
                ) : (
                  watch("orders")?.map((_, index) => (
                    <div key={index} className="flex gap-3 flex-wrap mb-4">
                      <FormField
                        name={`orders.${index}.sequence`}
                        control={formMethods.control}
                        render={({ field }) => (
                          <FormItem className="w-full sm:w-1/3">
                            <FormLabel>Secuencia</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                value={field.value ? field.value : ""}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                disabled={isLoading || isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name={`orders.${index}.value`}
                        control={formMethods.control}
                        render={({ field }) => (
                          <FormItem className="w-full sm:w-1/3">
                            <FormLabel>Valor $</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                value={field.value ? field.value : ""}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                disabled={isLoading || isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name={`orders.${index}.priority`}
                        control={formMethods.control}
                        render={({ field }) => (
                          <FormItem className="w-full sm:w-1/3">
                            <div className="flex items-center justify-between gap-x-3">
                              <FormControl>
                                <Switch
                                  id={`orders.${index}.priority`}
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={isLoading || isSubmitting}
                                />
                              </FormControl>
                              <FormLabel htmlFor={`orders.${index}.priority`}>
                                Prioritaria
                              </FormLabel>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader className="w-6 h-6 animate-spin" />
              ) : routeId ? (
                "Actualizar Ruta"
              ) : (
                "Crear Ruta"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
};

export default DeliveryRouteForm;
