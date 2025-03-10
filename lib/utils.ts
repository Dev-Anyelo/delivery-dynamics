import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const formatDuration = (ms: number): string => {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
};

export const getOperationTypeVariant = (
  type: string
): "default" | "secondary" | "outline" => {
  const typeMap: Record<string, "default" | "secondary" | "outline"> = {
    delivery: "default",
    pickup: "secondary",
    transfer: "outline",
  };

  return typeMap[type.toLowerCase()] || "default";
};
