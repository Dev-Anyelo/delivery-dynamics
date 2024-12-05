import { Check } from "lucide-react";
import { FormSuccessProps } from "@/interfaces/interfaces";

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;

  return (
    <div className="p-2 rounded-md mt-4 text-green-500">
      <Check className="inline-block mr-2 size-4" />
      {message}
    </div>
  );
};
