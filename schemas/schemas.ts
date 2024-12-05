import * as z from "zod";

export const RouteSchema = z.object({
  id: z.number().optional(),
  driverId: z.number().min(1, { message: "El campo 'driverId' es requerido" }),
  date: z.string().min(1, { message: "El campo 'date' es requerido" }),
  notes: z.string().nullable(),
  orders: z
    .array(
      z.object({
        id: z.number(),
        sequence: z.number(),
        value: z.number(),
        priority: z.boolean(),
      })
    )
    .min(1, { message: "Debe haber al menos una orden asociada" }),
});
