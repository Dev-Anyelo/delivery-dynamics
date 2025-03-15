"use client";

import { format } from "date-fns";
import { Visit } from "@/types/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VisitCardGuideDetails } from "./viits-list";
import { useState, useEffect, useMemo } from "react";
import { Search, Pin, X, Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const SearchableVisitsList = ({ visits }: { visits: Visit[] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search to improve performance with large datasets
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  // Filter visits based on search query
  const filteredVisits = useMemo(() => {
    if (!searchQuery.trim()) return visits;

    const query = searchQuery.toLowerCase().trim();

    return visits.filter((visit) => {
      // Search in customer name
      if (visit.customer?.name?.toLowerCase().includes(query)) return true;

      // Search in customer ID
      if (visit.customer?.id?.toLowerCase().includes(query)) return true;

      // Search in address
      if (visit.address?.toLowerCase().includes(query)) return true;

      // Search in notes
      if (visit.notes?.toLowerCase().includes(query)) return true;

      // Search in planned arrival time
      if (visit.plannedArrivalTime) {
        const formattedDate = format(
          new Date(visit.plannedArrivalTime),
          "PPP p"
        );
        if (formattedDate.toLowerCase().includes(query)) return true;
      }

      // Search in actual arrival time
      if (visit.actualArrivalTime) {
        const formattedDate = format(
          new Date(visit.actualArrivalTime),
          "PPP p"
        );
        if (formattedDate.toLowerCase().includes(query)) return true;
      }

      return false;
    });
  }, [visits, searchQuery]);

  // Clear search query
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por cliente, dirección, fecha..."
            className="pl-8 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9"
              onClick={handleClearSearch}
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
              <span className="sr-only">Limpiar búsqueda</span>
            </Button>
          )}
        </div>

        {searchQuery && (
          <div className="mt-2 flex items-center justify-between text-sm">
            <Badge variant="secondary" className="font-normal">
              {isSearching ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" /> Buscando...
                </span>
              ) : (
                `${filteredVisits.length} ${
                  filteredVisits.length === 1 ? "resultado" : "resultados"
                }`
              )}
            </Badge>
          </div>
        )}
      </div>

      {filteredVisits.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            {searchQuery ? (
              <>
                No se encontraron visitas que coincidan con "{searchQuery}"
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearSearch}
                  >
                    Limpiar búsqueda
                  </Button>
                </div>
              </>
            ) : (
              "No hay visitas programadas para este plan"
            )}
          </CardContent>
        </Card>
      ) : (
        filteredVisits.map((visit, idx) => (
          <VisitCardGuideDetails
            key={visit.id || idx}
            visit={visit}
            index={idx + 1}
            highlight={searchQuery}
          />
        ))
      )}
    </div>
  );
};
