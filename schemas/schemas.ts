import * as z from "zod";

// ------ Enums ------ //

export const OperationType = z.enum(["delivery", "sales"]);
export const OrderStatus = z.enum(["pending", "in_progress", "completed"]);

export const PaymentMethodType = z.enum([
  "cash",
  "credit_card",
  "credit_note",
  "check",
  "bank_transfer",
  "other",
]);
export const PointOfInterestType = z.enum([
  "store",
  "warehouse",
  "distribution_center",
  "headquarters",
]);

// ------ Schemas ------ //

// User schema
export const UserSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(1, { message: "El campo 'name' es requerido" })
    .optional(),
  email: z
    .string()
    .email({ message: "El campo 'email' debe ser un correo electrónico" }),
  password: z
    .string()
    .min(8, { message: "El campo 'password' debe tener al menos 8 caracteres" })
    .optional(),
  role: z.string().min(1, { message: "El campo 'role' es requerido" }),
  active: z.boolean().optional(),
});

export const FilterGuidesSchema = z.object({
  assignedUserId: z.string({
    required_error: "El campo 'assignedUserId' es requerido",
  }),

  date: z.date({
    required_error: "La fecha es obligatoria",
  }),
});

export const SearchGuideSchema = z.object({
  guideSearchID: z.string(),
});

export const ReasonSchema = z.object({
  id: z.string(),
  labelEn: z.string(),
  labelEs: z.string(),
});

export const BankSchema: z.ZodType<any> = z.object({
  id: z.string(),
  name: z.string(),
  paymentMethods: z.array(z.lazy(() => PaymentMethodSchema)).optional(),
});

export const TruckTypeSchema: z.ZodType<any> = z.object({
  id: z.string(),
  label: z.string(),
  size: z.number(),
  maxCases: z.number(),
  maxValue: z.number(),
  maxVolume: z.number(),
  maxWeight: z.number(),
  notes: z.string().optional(),
  trucks: z.array(z.lazy(() => TruckSchema)).optional(),
  routes: z.array(z.lazy(() => RouteSchema)).optional(),
});

export const TruckSchema = z.object({
  id: z.string(),
  label: z.string().optional().nullable(),
  truckTypeId: z.string(),
  truckType: z
    .lazy(() => TruckTypeSchema)
    .optional()
    .nullable(),
  plans: z.array(z.lazy(() => PlanSchema)).optional(),
  routes: z.array(z.lazy(() => RouteSchema)).optional(),
});

export const RouteStopSchema = z.object({
  routeId: z.string(),
  route: z.lazy(() => RouteSchema),
  addressId: z.string(),
  address: z.lazy(() => AddressSchema),
  sequence: z.number(),
});

export const RouteSchema: z.ZodType<any> = z.object({
  id: z.string(),
  routeGroupId: z.string(),
  routeGroup: z.lazy(() => RouteGroupSchema),
  startPointId: z.string(),
  endPointId: z.string(),
  assignedTruckId: z.string().optional(),
  assignedTruck: z
    .lazy(() => TruckSchema)
    .optional()
    .nullable(),
  assignedTruckTypeId: z.string().optional(),
  assignedTruckType: z
    .lazy(() => TruckTypeSchema)
    .optional()
    .nullable(),
  assignedUserId: z.string(),
  stops: z.array(z.lazy(() => RouteStopSchema)).optional(),
  plans: z.array(z.lazy(() => PlanSchema)).optional(),
});

export const RouteGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  routes: z.array(z.lazy(() => RouteSchema)).optional(),
});

export const OrderGroupSchema: z.ZodType<any> = z.object({
  id: z.string(),
  orders: z.array(z.lazy(() => OrderSchema)).optional(),
});

export const SalesRepresentativeSchema: z.ZodType<any> = z.object({
  id: z.string(),
  name: z.string(),
  orders: z.array(z.lazy(() => OrderSchema)).optional(),
});

export const ProductSchema: z.ZodType<any> = z.object({
  id: z.string(),
  description: z.string().optional(),
  lineItems: z.array(z.lazy(() => LineItemSchema)).optional(),
});

export const LineItemSchema: z.ZodType<any> = z.object({
  id: z.string(),
  orderId: z.string(),
  order: z.lazy(() => OrderSchema),
  productId: z.string(),
  product: z.lazy(() => ProductSchema),
  lineNumber: z.number(),
  quantity: z.number(),
  unitPrice: z.number(),
  taxRate: z.number(),
  value: z.number(),
  actualQuantity: z.number(),
  actualValue: z.number(),
  status: z.string(),
  returnedReasonId: z.string().optional(),
  notes: z.string().optional(),
});

export const PaymentMethodSchema = z.object({
  id: z.string(),
  method: PaymentMethodType,
  value: z.number(),
  documentId: z.string().optional(),
  bankId: z.string().optional(),
  bank: z
    .lazy(() => BankSchema)
    .optional()
    .nullable(),
  accountNumber: z.string().optional(),
  visitId: z.string(),
  visit: z.lazy(() => VisitSchema),
});

export const DeliveryReassignmentSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  fromDeliveryPlanId: z.string(),
  fromOrderGroupId: z.string().optional(),
  toDeliveryPlanId: z.string(),
  toOrderGroupId: z.string().optional(),
  orderValue: z.number(),
  timestamp: z.date(),
  visitId: z.string(),
  visit: z.lazy(() => VisitSchema),
});

export const OrderSchema: z.ZodType<any> = z.object({
  id: z.string(),
  planId: z.string(),
  plan: z.lazy(() => PlanSchema),
  customerId: z.string(),
  customer: z.lazy(() => CustomerSchema),
  addressId: z.string(),
  address: z.lazy(() => AddressSchema),
  salesRepresentativeId: z.string().optional(),
  salesRepresentative: z
    .lazy(() => SalesRepresentativeSchema)
    .optional()
    .nullable(),
  serviceDate: z.coerce.date(),
  orderGroupId: z.string().optional(),
  orderGroup: z
    .lazy(() => OrderGroupSchema)
    .optional()
    .nullable(),
  startPointId: z.string().optional(),
  businessSegmentId: z.string(),
  businessSegment: z.lazy(() => BusinessSegmentSchema),
  value: z.number(),
  volume: z.number(),
  weight: z.number(),
  cases: z.number(),
  instructions: z.string().optional(),
  requiresSignature: z.boolean(),
  actualValue: z.number(),
  notes: z.string().optional(),
  status: OrderStatus,
  statusConfirmed: z.boolean().nullable(),
  statusTimestamp: z.coerce.date().optional().nullable(),
  deliveryVisitId: z.string().optional(),
  deliveryVisit: z
    .lazy(() => VisitSchema)
    .optional()
    .nullable(),
  pickupVisitId: z.string().optional(),
  pickupVisit: z
    .lazy(() => VisitSchema)
    .optional()
    .nullable(),
  lineItems: z.array(z.lazy(() => LineItemSchema)).optional(),
});

export const VisitSchema: z.ZodType<any> = z.object({
  id: z.string(),
  sequence: z.number(),
  planId: z.string().optional(),
  plan: z.lazy(() => PlanSchema).optional(),
  customerId: z.string(),
  customer: z.lazy(() => CustomerSchema),
  addressId: z.string(),
  address: z.lazy(() => AddressSchema),
  orders: z.array(z.lazy(() => OrderSchema)).optional(),
  pickupOrders: z.array(z.lazy(() => OrderSchema)).optional(),
  paymentMethods: z.array(z.lazy(() => PaymentMethodSchema)).optional(),
  reassignedDeliveries: z
    .array(z.lazy(() => DeliveryReassignmentSchema))
    .optional(),
});

export const PlanSchema: z.ZodType<any> = z.object({
  id: z.string(),
  operationType: OperationType,
  date: z.coerce.date(),
  activeDates: z.array(z.coerce.date()),
  assignedUserId: z.string().nullable().optional(),
  businessSegmentId: z.string(),
  businessSegment: z.lazy(() => BusinessSegmentSchema).optional(),
  routeId: z.string().optional(),
  route: z
    .lazy(() => RouteSchema)
    .optional()
    .nullable(),
  truckId: z.string().optional(),
  truck: z
    .lazy(() => TruckSchema)
    .optional()
    .nullable(),
  startPointId: z.string(),
  startPoint: z.lazy(() => PointOfInterestSchema),
  endPointId: z.string(),
  endPoint: z.lazy(() => PointOfInterestSchema),
  visits: z.array(z.lazy(() => VisitSchema)).optional(),
  orders: z.array(z.lazy(() => OrderSchema)).optional(),
});

export const PlansSchema = z.array(PlanSchema);

export const BusinessSegmentSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  plans: z.array(z.lazy(() => PlanSchema)).optional(),
  orders: z.array(z.lazy(() => OrderSchema)).optional(),
});

export const TimeWindowSchema: z.ZodType<any> = z.object({
  id: z.string(),
  openingTime: z.date(),
  closingTime: z.date(),
  firstForAddresses: z.array(z.lazy(() => AddressSchema)).optional(),
  secondForAddresses: z.array(z.lazy(() => AddressSchema)).optional(),
});

export const AddressSchema: z.ZodType<any> = z.object({
  id: z.string(),
  label: z.string().nullable(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  phone: z.string().nullable(),
  notes: z.string().nullable().optional(),
  contact: z.string().nullable(),
  businessType: z.string(),
  customerId: z.string().optional(),
  customer: z.lazy(() => CustomerSchema).optional(),
  firstDeliveryTimeWindowId: z.string().optional(),
  firstDeliveryTimeWindow: z
    .lazy(() => TimeWindowSchema)
    .optional()
    .nullable(),
  secondDeliveryTimeWindowId: z.string().optional(),
  secondDeliveryTimeWindow: z
    .lazy(() => TimeWindowSchema)
    .optional()
    .nullable(),
  visits: z.array(z.lazy(() => VisitSchema)).optional(),
  orders: z.array(z.lazy(() => OrderSchema)).optional(),
  routeStops: z.array(z.lazy(() => RouteStopSchema)).optional(),
});

export const CustomerSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  addresses: z.array(z.lazy(() => AddressSchema)).optional(),
  visits: z.array(z.lazy(() => VisitSchema)).optional(),
  orders: z.array(z.lazy(() => OrderSchema)).optional(),
});

export const PointOfInterestSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  type: PointOfInterestType,
  startPlans: z.array(z.lazy(() => PlanSchema)).optional(),
  endPlans: z.array(z.lazy(() => PlanSchema)).optional(),
});
