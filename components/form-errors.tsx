import { TriangleAlert } from "lucide-react";
import { FormErrorProps } from "@/interfaces/interfaces";

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className="p-2 rounded-md mt-4 text-red-500">
      <TriangleAlert className="inline-block mr-2 size-4" />
      {message}
    </div>
  );
};
