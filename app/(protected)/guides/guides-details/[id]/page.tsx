"use client";

import type React from "react";
import { Plan } from "@/types/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PlanSchema } from "@/schemas/schemas";
import { VisitsList } from "@/components/ui/viits-list";
import { ErrorState } from "@/components/ui/error-state";
import { TimelineView } from "@/components/ui/time-line-view";
import { PlanDetails, PlanHeader } from "@/components/ui/plan";
import { LoadingState } from "@/components/skeletons/dashboard-skeletons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GuideDetailsPage = () => {
  const { id } = useParams() as { id: string };
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/guides/guides-details/${id}`);
        const result = await response.json();

        if (result.success) {
          const parsed = PlanSchema.safeParse(result.data);
          if (parsed.success) {
            setPlan(parsed.data);
          } else {
            setError(`Validation error: ${parsed.error.message}`);
          }
        } else {
          setError(result.message || "Failed to load plan information");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) return <LoadingState />;
  if (error || !plan)
    return <ErrorState message={error || "Plan information not found."} />;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PlanHeader plan={plan} />

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="details">Plan Details</TabsTrigger>
          <TabsTrigger value="visits">
            Visits ({plan.visits.length})
          </TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 mt-6">
          <PlanDetails plan={plan} />
        </TabsContent>

        <TabsContent value="visits" className="space-y-4 mt-6">
          <VisitsList visits={plan.visits} />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4 mt-6">
          <TimelineView plan={plan} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GuideDetailsPage;
