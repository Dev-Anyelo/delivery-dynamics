import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";
import { Card, CardContent, CardHeader } from "../ui/card";

export const UserSkeleton = () => (
  <div className="p-4 border border-border/50 rounded-xl bg-card/30">
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  </div>
);

export const RowsTableSkeletons = ({ columns }: { columns: number }) => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className="border-b dark:border-gray-700">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex} className="p-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

// Guide details Skeleton
export const LoadingState = () => (
  <div className="container mx-auto py-6 space-y-6">
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    </div>
  </div>
);
