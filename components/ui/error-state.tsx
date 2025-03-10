import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";

export const ErrorState = ({ message }: { message: string }) => (
  <div className="container mx-auto py-6">
    <Alert
      variant="default"
      className="space-y-2 text-red-400 bg-red-900/70 dark:bg-red-900/15"
    >
      <AlertTitle className="flex items-center gap-1">
        <AlertCircleIcon className="inline size-4" />
        Error
      </AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  </div>
);
