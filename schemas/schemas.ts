import * as z from "zod";

export const RouteSchema = z.object({
  id: z.number().optional(),
  driverId: z.number().min(1, { message: "El campo es requerido" }),
  driver: z.object({
    id: z
      .number()
      .min(1, { message: "El campo 'id' del conductor es requerido" }),
    name: z
      .string()
      .min(1, { message: "El campo 'name' del conductor es requerido" }),
  }),
  date: z.string(),
  notes: z.string().nullable(),
  orders: z.array(
    z.object({
      id: z.number(),
      sequence: z.number(),
      value: z.number(),
      priority: z.boolean(),
    })
  ),
});
