"use server";

import * as z from "zod";
import axios from "axios";
import { RouteSchema } from "@/schemas/schemas";
import { ROUTE_API_URL } from "@/constants/constants";

// Create a new route
export const CreateRoute = async (data: z.infer<typeof RouteSchema>) => {
  const validateFields = RouteSchema.safeParse(data);

  if (!validateFields.success) return { error: "Invalid fields" };

  const { id, driverId, date, notes, orders } = validateFields.data;

  try {
    const response = await axios.post(ROUTE_API_URL, {
      id,
      driverId,
      date,
      notes,
      orders,
    });

    console.log(response.data);
    return response.data;
  } catch (error: any) {
    return { error: "Error creating route" };
  }
};
