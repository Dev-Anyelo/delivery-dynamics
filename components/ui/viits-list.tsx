import { format } from "date-fns";
import { Order, Visit } from "@/types/types";
import { MapPin, Package } from "lucide-react";
import { OrderCardDetailGuide } from "./order-card";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";

export const VisitsList = ({ visits }: { visits: Visit[] }) => (
  <div className="space-y-4">
    {visits.length === 0 ? (
      <Card>
        <CardContent className="py-6 text-center text-muted-foreground">
          No visits scheduled for this plan
        </CardContent>
      </Card>
    ) : (
      visits.map((visit, idx) => (
        <VisitCardGuideDetails
          key={visit.id || idx}
          visit={visit}
          index={idx + 1}
        />
      ))
    )}
  </div>
);

export const VisitCardGuideDetails = ({
  visit,
  index,
}: {
  visit: Visit;
  index: number;
}) => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <CardTitle className="text-xl">
            Visit #{index}: {visit.customer?.name || "Unknown Customer"}
          </CardTitle>
          {visit.customer?.address && (
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {visit.customer.address}
            </CardDescription>
          )}
        </div>

        {(visit.plannedArrivalTime || visit.actualArrivalTime) && (
          <div className="flex flex-col gap-1 text-sm">
            {visit.plannedArrivalTime && (
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Planned:</span>
                <span>{format(new Date(visit.plannedArrivalTime), "p")}</span>
              </div>
            )}
            {visit.actualArrivalTime && (
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Actual:</span>
                <span>{format(new Date(visit.actualArrivalTime), "p")}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </CardHeader>

    <CardContent>
      <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
        <Package className="h-4 w-4" />
        <span>Orders</span>
      </h4>

      {visit.orders && visit.orders.length > 0 ? (
        <div className="space-y-4">
          {visit.orders.map((order: Order, orderIdx: number) => (
            <OrderCardDetailGuide key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No orders for this visit
        </p>
      )}
    </CardContent>
  </Card>
);
