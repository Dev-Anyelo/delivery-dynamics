import * as z from "zod";
import { OrderSchema, VisitSchema } from "@/schemas/schemas";

export type VisitProps = {
  visits: z.infer<typeof VisitSchema>[];
};

export type OrderProps = {
  orders: z.infer<typeof OrderSchema>[];
};
