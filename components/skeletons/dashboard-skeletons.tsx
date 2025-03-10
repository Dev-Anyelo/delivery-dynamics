import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

export function UserSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-row gap-4">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  );
}

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
