export interface Order {
  id: number;
  sequence: number;
  value: number;
  priority: boolean;
}

export interface RouteData {
  id: number;
  driver: number;
  date: string;
  notes: string | null;
  orders: Order[];
}

export interface RouteResponse {
  routes: RouteData[];
  message: string;
}

export interface Driver {
  id: number;
  name: string;
}

export interface DriverResponse {
  driver: Driver[];
  message: string;
}

export interface FormErrorProps {
  message?: string;
}

export interface FormSuccessProps {
  message?: string;
}

export interface CheckmarkProps {
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}

export interface ReportDialogProps {
  isOpen: boolean;
  handleClose: () => void;
  selectedFile?: { name: string } | null;
  exportType: "excel" | "pdf" | null;
}
