import { Alert, AlertDescription, AlertTitle } from "./alert";

export const ErrorState = ({ message }: { message: string }) => (
  <div className="container mx-auto py-6">
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  </div>
);
