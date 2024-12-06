"use client";

import Link from "next/link";
import * as React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { fetchRoutes } from "@/actions/actions";
import { deleteRoute } from "@/actions/actions";
import { Loader, Trash, Edit } from "lucide-react";
import { RouteData } from "@/interfaces/interfaces";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";

export function RoutesTable() {
  const { toast } = useToast();
  const [filter, setFilter] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<RouteData[]>([]);

  const columns: ColumnDef<RouteData>[] = [
    {
      accessorKey: "id",
      header: "ID Ruta",
      cell: ({ row }) => <span>{row.getValue("id")}</span>,
    },
    {
      accessorKey: "driverId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre del conductor
        </Button>
      ),
      cell: ({ row }) => (
        <span>{row.original.driver.name || "Desconocido"}</span>
      ),
    },
    {
      accessorKey: "date",
      header: "Fecha Programada",
      cell: ({ row }) => <span>{row.getValue("date")}</span>,
    },
    {
      accessorKey: "notes",
      header: "Notas",
      cell: ({ row }) => <span>{row.getValue("notes") || "Sin notas"}</span>,
    },
    {
      accessorKey: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <TableCell className="flex gap-x-4 justify-center items-center w-full">
          <Link href={`/routes/route-details/${row.original.id}`}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log(`Edit route ID: ${row.original.id}`)}
            >
              <Edit className="mr-2" />
              Editar
            </Button>
          </Link>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteRoute(row.original.id!)}
          >
            <Trash className="mr-2" />
            Eliminar
          </Button>
        </TableCell>
      ),
    },
  ];

  React.useEffect(() => {
    const loadRoutes = async () => {
      setLoading(true);
      try {
        const response = await fetchRoutes();
        setData(response.routes);
        toast({
          title: response.message,
          variant: "default",
          description: "Se cargaron las rutas correctamente.",
        });
      } catch (error: any) {
        toast({
          title: "Error al cargar las rutas",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadRoutes();
  }, [toast]);

  const handleDeleteRoute = async (routeId: number) => {
    if (routeId) {
      try {
        const result = await deleteRoute(routeId);
        if (result.success) {
          setData((prevData) =>
            prevData.filter((route) => route.id !== routeId)
          );
          toast({
            title: result.message,
            variant: "default",
          });
        } else {
          toast({
            title: result.message,
            variant: "destructive",
          });
        }
      } catch (error: any) {
        toast({
          title: "Error al eliminar la ruta",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "ID de ruta no encontrado",
        variant: "destructive",
      });
    }
  };

  const filteredData = React.useMemo(() => {
    return data.filter((route) =>
      route.driver.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [data, filter]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      {/* Filtro */}
      <Label htmlFor="filter">Buscar por conductor</Label>
      <div className="flex items-center py-4">
        <Input
          placeholder="Buscar por nombre del conductor..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Carga o tabla */}
      <div className="rounded-md border">
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <Loader className="mr-2 animate-spin size-4" />
            <span className="text-gray-400">Cargando rutas...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="text-center">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="text-center"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    No hay rutas disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
