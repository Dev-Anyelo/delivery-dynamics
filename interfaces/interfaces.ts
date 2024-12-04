export interface RouteData {
  id?: number;
  driverId: number;
  driver: {
    id: number;
    name: string;
  };
  date: string;
  notes: string | null;
  orders: {
    id: number;
    sequence: number;
    value: number;
    priority: boolean;
  }[];
}
