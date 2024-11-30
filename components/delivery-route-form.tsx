"use client";

import * as z from "zod";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RouteSchema } from "@/schemas/schemas";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateRoute } from "@/actions/actions";

export default function DeliveryRouteForm() {
  const [isPriority, setIsPriority] = useState(false);

  const formMethods = useForm<z.infer<typeof RouteSchema>>({
    resolver: zodResolver(RouteSchema),
    defaultValues: {
      id: 0,
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
    watch,
    setValue,
    formState: { errors },
  } = formMethods;

  const onSubmit = async (values: z.infer<typeof RouteSchema>) => {
    try {
      const data = await CreateRoute(values);
      console.log(data);
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Formulario de Ruta de Delivery</CardTitle>
        {/* Sección de búsqueda */}
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Buscar ID de ruta"
            className="flex-grow"
          />
          <Button type="button" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Información de la ruta */}
          <div className="w-ful">
            <CardHeader>
              <CardTitle>Información de la Ruta</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="routeId">ID de la Ruta</Label>
                <Input
                  id="routeId"
                  placeholder="Ingrese el ID de la ruta"
                  {...register("id", { valueAsNumber: true })}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="driverName">ID del Conductor</Label>
                <Input
                  id="driverName"
                  placeholder="Ingrese el ID del conductor"
                  {...register("driverId", { valueAsNumber: true })}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="scheduledDate">Fecha Programada</Label>
                <Input id="scheduledDate" type="date" {...register("date")} />
              </div>
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  placeholder="Ingrese notas"
                  {...register("notes")}
                  rows={5}
                />
              </div>
            </CardContent>
          </div>

          {/* Información de la orden */}
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Información de la Orden</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap justify-center items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="sequence">Secuencia</Label>
                <Input
                  id="sequence"
                  type="number"
                  placeholder="Ingrese la secuencia"
                  {...register("orders.0.sequence", { valueAsNumber: true })}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="value">Valor $</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  placeholder="Ingrese el valor"
                  {...register("orders.0.value", { valueAsNumber: true })}
                />
              </div>
              <div className="flex items-center space-x-2 min-w-[200px]">
                <Switch
                  id="priority"
                  checked={watch("orders.0.priority")}
                  onCheckedChange={(checked) =>
                    setValue("orders.0.priority", checked)
                  }
                />
                <Label htmlFor="priority">Prioritaria</Label>
              </div>
            </CardContent>
          </Card>

          {/* Botón de envío */}
          <div className="flex justify-end">
            <Button type="submit" className="w-full max-w-[200px]">
              Crear Ruta
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
