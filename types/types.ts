import * as z from "zod";

import {
  LineItemSchema,
  loginSchema,
  OrderSchema,
  PlanSchema,
  PlansSchema,
  UserSchema,
  VisitSchema,
} from "@/schemas/schemas";

export type Plan = z.infer<typeof PlanSchema>;
export type Plans = z.infer<typeof PlansSchema>;
export type Visit = z.infer<typeof VisitSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type LineItem = z.infer<typeof LineItemSchema>;

export type VisitProps = {
  visits: z.infer<typeof VisitSchema>[];
  
};

export type OrderProps = {
  orders: z.infer<typeof OrderSchema>[];
};

export type LoginFormValues = z.infer<typeof loginSchema>;

export type User = z.infer<typeof UserSchema>;
