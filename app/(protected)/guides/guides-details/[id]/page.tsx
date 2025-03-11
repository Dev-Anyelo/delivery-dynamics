"use client";

import axios from "axios";
import type React from "react";
import { Plan } from "@/types/types";
import { useParams } from "next/navigation";
import { PlanSchema } from "@/schemas/schemas";
import { useEffect, useState, useRef } from "react";
import { VisitsList } from "@/components/ui/viits-list";
import { ErrorState } from "@/components/ui/error-state";
import { TimelineView } from "@/components/ui/time-line-view";
import { PlanDetails, PlanHeader } from "@/components/ui/plan";
import { LoadingState } from "@/components/skeletons/dashboard-skeletons";

const GuideDetailsPage = () => {
  const { id } = useParams() as { id: string };
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados y refs para los tabs animados
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fetch de los detalles del plan
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/guides/guides-details/${id}`);
        const result = response.data;

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

    if (id) fetchData();
  }, [id]);

  // Actualiza el estilo del highlight al hacer hover
  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex];
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement;
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  }, [hoveredIndex]);

  // Actualiza el estilo del indicador activo
  useEffect(() => {
    const activeElement = tabRefs.current[activeIndex];
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setActiveStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      });
    }
  }, [activeIndex]);

  // Establece el indicador activo en el primer tab al montar el componente
  useEffect(() => {
    requestAnimationFrame(() => {
      const defaultElement = tabRefs.current[0];
      if (defaultElement) {
        const { offsetLeft, offsetWidth } = defaultElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    });
  }, []);

  if (loading) return <LoadingState />;

  if (error || !plan)
    return <ErrorState message={error || "Plan information not found."} />;

  return (
    <div className="container mx-auto space-y-6">
      <PlanHeader plan={plan} />

      {/* Tabs Animados */}
      <div className="relative">
        {/* Hover Highlight */}
        <div
          className="absolute h-[30px] transition-all duration-300 ease-out bg-[#0e0f1114] dark:bg-[#ffffff1a] rounded-[6px] flex items-center"
          style={{
            ...hoverStyle,
            opacity: hoveredIndex !== null ? 1 : 0,
          }}
        />

        {/* Active Indicator */}
        <div
          className="absolute bottom-[-6px] h-[2px] bg-[#0e0f11] dark:bg-white transition-all duration-300 ease-out"
          style={activeStyle}
        />

        {/* Lista de Tabs */}
        <div className="relative flex space-x-[6px] items-center">
          {/* Tab "Detalle" */}
          <div
            ref={(el) => {
              tabRefs.current[0] = el;
            }}
            className={`px-3 py-2 cursor-pointer transition-colors duration-300 h-[30px] ${
              activeIndex === 0
                ? "text-[#0e0e10] dark:text-white"
                : "text-[#0e0f1199] dark:text-[#ffffff99]"
            }`}
            onMouseEnter={() => setHoveredIndex(0)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => setActiveIndex(0)}
          >
            <div className="text-sm font-[var(--www-mattmannucci-me-geist-regular-font-family)] leading-5 whitespace-nowrap flex items-center justify-center h-full">
              Detalle
            </div>
          </div>

          {/* Tab "Visitas" */}
          <div
            ref={(el) => {
              tabRefs.current[1] = el;
            }}
            className={`px-3 py-2 cursor-pointer transition-colors duration-300 h-[30px] ${
              activeIndex === 1
                ? "text-[#0e0e10] dark:text-white"
                : "text-[#0e0f1199] dark:text-[#ffffff99]"
            }`}
            onMouseEnter={() => setHoveredIndex(1)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => setActiveIndex(1)}
          >
            <div className="text-sm font-[var(--www-mattmannucci-me-geist-regular-font-family)] leading-5 whitespace-nowrap flex items-center justify-center h-full">
              Visitas ({plan.visits.length})
            </div>
          </div>

          {/* Tab "Línea de Tiempo" */}
          <div
            ref={(el) => {
              tabRefs.current[2] = el;
            }}
            className={`px-3 py-2 cursor-pointer transition-colors duration-300 h-[30px] ${
              activeIndex === 2
                ? "text-[#0e0e10] dark:text-white"
                : "text-[#0e0f1199] dark:text-[#ffffff99]"
            }`}
            onMouseEnter={() => setHoveredIndex(2)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => setActiveIndex(2)}
          >
            <div className="text-sm font-[var(--www-mattmannucci-me-geist-regular-font-family)] leading-5 whitespace-nowrap flex items-center justify-center h-full">
              Línea de Tiempo
            </div>
          </div>
        </div>
      </div>

      {/* Contenido del Tab Seleccionado */}
      <div>
        {activeIndex === 0 && <PlanDetails plan={plan} />}
        {activeIndex === 1 && <VisitsList visits={plan.visits} />}
        {activeIndex === 2 && <TimelineView plan={plan} />}
      </div>
    </div>
  );
};

export default GuideDetailsPage;
