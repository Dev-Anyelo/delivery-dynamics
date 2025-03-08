import * as z from "zod";
import { VisitSchema } from "@/schemas/schemas";

export type VisitProps = {
  visits: z.infer<typeof VisitSchema>[];
};
