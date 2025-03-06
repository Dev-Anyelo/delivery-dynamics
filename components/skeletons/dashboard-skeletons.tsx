import { Skeleton } from "../ui/skeleton";

export function UserSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
      <div className="flex items-center gap-4">
        {/* Simulamos el avatar */}
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-row gap-4">
          {/* Simulamos el nombre del usuario */}
          <Skeleton className="h-4 w-24 rounded-md" />
          {/* Simulamos las badges de rol y estado */}
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>
      </div>
      <div className="flex gap-2">
        {/* Simulamos los botones */}
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  );
}
