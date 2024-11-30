"use server";

import * as z from "zod";
import axios from "axios";
import { RouteSchema } from "@/schemas/schemas";

export const CreateRoute = async (data: z.infer<typeof RouteSchema>) => {
  /*
  Structure of the data object:

    "routes": [{
    "id": 234258,
    "driverId": 10,
    "date": "2024-10-28T00:00:00",
    "notes": null,
    "orders": [{
      "id": 3777161,
      "sequence": 1,
      "value": 20.54,
      "priority": false
    }]
 */

  const API_URL = "http://localhost:3000/routes";

  const validateFields = RouteSchema.safeParse(data);

  if (!validateFields.success) return { error: "Invalid Fields" };

  const { id, driverId, date, notes, orders } = validateFields.data;

  try {
    // const response = await axios.post(API_URL, {
    //   id,
    //   driverId,
    //   date,
    //   notes,
    //   orders,
    // });

    // return response.data;

    console.log("Route created successfully" + data);
  } catch (error: any) {
    console.error(error);
  }
};
