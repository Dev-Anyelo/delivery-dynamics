import * as z from "zod";

const RouteSchema = z.object({
  id: z.number(),
  driverId: z.number(),
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

export { RouteSchema };
