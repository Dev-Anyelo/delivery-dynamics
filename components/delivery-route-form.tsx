"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DeliveryRouteForm() {
  const [isPriority, setIsPriority] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Formulario enviado");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Formulario de Ruta de Delivery</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Información de la ruta */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="routeId">ID de la Ruta</Label>
              <Input id="routeId" placeholder="Ingrese el ID de la ruta" />
            </div>
            <div>
              <Label htmlFor="driverName">Nombre del Conductor</Label>
              <Input
                id="driverName"
                placeholder="Ingrese el nombre del conductor"
              />
            </div>
            <div>
              <Label htmlFor="scheduledDate">Fecha Programada</Label>
              <Input id="scheduledDate" type="date" />
            </div>
            <div>
              <Label htmlFor="notes">Notas</Label>
              <Textarea id="notes" placeholder="Ingrese notas o descripción" />
            </div>
          </div>

          {/* Información de la orden */}
          <Card>
            <CardHeader>
              <CardTitle>Información de la Orden</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sequence">Secuencia</Label>
                <Input
                  id="sequence"
                  type="number"
                  placeholder="Ingrese la secuencia"
                />
              </div>
              <div>
                <Label htmlFor="value">Valor $</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  placeholder="Ingrese el valor"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="priority"
                  checked={isPriority}
                  onCheckedChange={setIsPriority}
                />
                <Label htmlFor="priority">Prioritaria</Label>
              </div>
            </CardContent>
          </Card>

          {/* Botón de envío */}
          <Button type="submit" className="w-full">
            Crear Ruta
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
