export interface RouteData {
  id?: number;
  driverId: number;
  date: string;
  notes: string | null;
  orders: {
    id: number;
    sequence: number;
    value: number;
    priority: boolean;
  }[];
}

export interface DeliveryRouteFormProps {
  routeId: string;
  routeData: RouteData;
}

export interface FormErrorProps {
  message?: string;
}

export interface FormSuccessProps {
  message?: string;
}
