import { Plan, Visit } from "@/types/types";
import { format, formatDate } from "date-fns";
import { Clock, MapPin, Truck } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";

export const TimelineView = ({ plan }: { plan: Plan }) => (
  <Card>
    <CardHeader>
      <CardTitle>Plan Timeline</CardTitle>
      <CardDescription>Overview of the plan execution timeline</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary/20 text-primary rounded-full p-2">
            <Truck className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Plan Created</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(plan.date), "PPp")}
            </p>
          </div>
        </div>

        {plan.actualStartTimestamp && (
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 text-primary rounded-full p-2">
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Plan Started</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(new Date(plan.actualStartTimestamp), "PPp")}
              </p>
            </div>
          </div>
        )}

        {plan.visits.map(
          (visit: Visit, idx: number) =>
            visit.actualArrivalTime && (
              <div key={idx} className="flex items-center gap-4">
                <div className="bg-primary/20 text-primary rounded-full p-2">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    Visit to {visit.customer?.name || `Customer #${idx + 1}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(visit.actualArrivalTime), "PPp")}
                  </p>
                </div>
              </div>
            )
        )}

        {plan.actualEndTimestamp && (
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 text-primary rounded-full p-2">
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Plan Completed</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(plan.actualEndTimestamp), "PPp")}
              </p>
            </div>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);
