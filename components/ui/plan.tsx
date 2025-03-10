import { format } from "date-fns";
import { Badge } from "./badge";
import { Plan } from "@/types/types";
import { InfoItem } from "./info-item";
import { Separator } from "./separator";
import { formatDuration, getOperationTypeVariant } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { CalendarIcon, Clock, MapPin, Truck, User } from "lucide-react";

export const PlanHeader = ({ plan }: { plan: Plan }) => (
  <div className="space-y-2">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Plan {plan.id}</h1>
        <p className="text-muted-foreground">
          {format(new Date(plan.date), "PPP")}
        </p>
      </div>
      <Badge
        className="w-fit"
        variant={getOperationTypeVariant(plan.operationType)}
      >
        {plan.operationType}
      </Badge>
    </div>
    <Separator />
  </div>
);

export const PlanDetails = ({ plan }: { plan: Plan }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          <span>Route Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Route ID" value={plan.routeId} />
          <InfoItem label="Truck ID" value={plan.truckId} />
          <InfoItem label="Business Segment" value={plan.businessSegmentId} />
          <InfoItem
            label="Planned Total Time"
            value={
              plan.plannedTotalTimeH !== null
                ? `${plan.plannedTotalTimeH} hours`
                : undefined
            }
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Locations</span>
          </h4>

          <div className="pl-6 border-l-2 border-muted space-y-3">
            <div>
              <p className="text-sm font-medium">Start Point</p>
              {plan.startPoint ? (
                <div className="text-sm">
                  <p className="font-medium">{plan.startPoint.name}</p>
                  <p className="text-muted-foreground">
                    {plan.startPoint.address}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Not specified</p>
              )}
            </div>

            <div>
              <p className="text-sm font-medium">End Point</p>
              {plan.endPoint ? (
                <div className="text-sm">
                  <p className="font-medium">{plan.endPoint.name}</p>
                  <p className="text-muted-foreground">
                    {plan.endPoint.address}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Not specified</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <span>Schedule & Assignment</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <InfoItem
            label="Assigned User"
            value={plan.assignedUserId}
            icon={<User className="h-4 w-4" />}
          />

          <div>
            <p className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Active Dates</span>
            </p>
            {plan.activeDates && plan.activeDates.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {plan.activeDates.map((date: any, index: any) => (
                  <Badge key={index} variant="outline">
                    {format(new Date(date), "PP")}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No active dates</p>
            )}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="font-medium">Actual Execution</h4>

          <div className="grid grid-cols-1 gap-2">
            <InfoItem
              label="Started"
              value={
                plan.actualStartTimestamp
                  ? format(new Date(plan.actualStartTimestamp), "PPp")
                  : undefined
              }
            />
            <InfoItem
              label="Ended"
              value={
                plan.actualEndTimestamp
                  ? format(new Date(plan.actualEndTimestamp), "PPp")
                  : undefined
              }
            />

            {plan.actualStartTimestamp && plan.actualEndTimestamp && (
              <InfoItem
                label="Duration"
                value={formatDuration(
                  new Date(plan.actualEndTimestamp).getTime() -
                    new Date(plan.actualStartTimestamp).getTime()
                )}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
