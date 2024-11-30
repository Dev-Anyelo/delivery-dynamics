"use server";

import * as z from "zod";
import { RouteSchema } from "@/schemas/schemas";

export const CreateRoute = async (data: z.infer<typeof RouteSchema>) => {
  const validateFields = RouteSchema.safeParse(data);

  if (!validateFields.success) return { error: "Campos inválidos" };

  const { id, driverId, date, notes, orders } = validateFields.data;

  console.log(
    "Datos recibidos:",
    JSON.stringify({ id, driverId, date, notes, orders }, null, 2)
  );

  return { success: true, route: validateFields.data };
};
