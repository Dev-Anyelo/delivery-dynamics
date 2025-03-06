"use client";

import * as z from "zod";
import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { deleteRoute } from "@/actions/actions";
import { fetchAllGuides } from "@/actions/actions";
import { Calendar } from "@/components/ui/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlanSchema, FilterGuidesSchema } from "@/schemas/schemas";
import { Loader, Trash, Edit, Search, CalendarIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

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

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function GuidesTable() {
  const { toast } = useToast();
  const [filter, setFilter] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<z.infer<typeof PlanSchema>[]>([]);

  const form = useForm<z.infer<typeof FilterGuidesSchema>>({
    resolver: zodResolver(FilterGuidesSchema),
    defaultValues: {
      assignedUserId: "",
      date: new Date(),
    },
  });

  const { handleSubmit } = form;

  const onSubmit = async (formData: z.infer<typeof FilterGuidesSchema>) => {
    const formattedDate =
      formData.date instanceof Date
        ? formData.date.toISOString().split("T")[0]
        : formData.date;
    setLoading(true);
    try {
      const response = await fetchAllGuides(
        formattedDate,
        formData.assignedUserId
      );
      if (Array.isArray(response)) {
        setData(response);
        toast({
          title: "Guías cargadas",
          variant: "default",
          description: "Se cargaron las guías correctamente.",
        });
      } else {
        const typedResponse = response as {
          guides?: z.infer<typeof PlanSchema>[];
          message?: string;
        };
        setData(typedResponse.guides || []);
        toast({
          title: typedResponse.message || "Guías cargadas",
          variant: "default",
          description: "Se cargaron las guías correctamente.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error al cargar las guías",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Definición de columnas para la tabla (sin cambios en este ejemplo)
  const columns: ColumnDef<z.infer<typeof PlanSchema>>[] = [
    {
      accessorKey: "id",
      header: "ID de la Guía",
      cell: ({ row }) => <span>{row.getValue("id")}</span>,
    },
    {
      accessorKey: "assignedUserId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Conductor asignado
        </Button>
      ),
      cell: ({ row }) => (
        <span>{row.original.assignedUserId || "Desconocido"}</span>
      ),
    },
    {
      accessorKey: "date",
      header: "Fecha",
      cell: ({ row }) => (
        <span>{row.getValue("date") || "Fecha no disponible"}</span>
      ),
    },
    {
      accessorKey: "guideId",
      header: "ID de la Ruta",
      cell: ({ row }) => (
        <span>{row.getValue("guideId") || "No disponible"}</span>
      ),
    },
    {
      accessorKey: "orders",
      header: "Órdenes",
      cell: ({ row }) => (
        <span>{row.getValue("orders") || "Órdenes no disponible"}</span>
      ),
    },
    {
      accessorKey: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <TableCell className="flex gap-x-4 justify-center items-center w-full">
          <Link href={`/guides/guides-details/${row.original.id}`}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log(`Edit guide ID: ${row.original.id}`)}
            >
              <Edit className="mr-2" />
              Editar
            </Button>
          </Link>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteGuide(row.original.id!)}
          >
            <Trash className="mr-2" />
            Eliminar
          </Button>
        </TableCell>
      ),
    },
  ];

  // Se podría mantener o eliminar este useEffect, dependiendo si se quiere cargar inicialmente
  // las guías con los valores por defecto del formulario.
  // React.useEffect(() => {
  //   handleSubmit(onSubmit)();
  // }, []);

  const handleDeleteGuide = async (guideId: number) => {
    if (guideId) {
      try {
        const result = await deleteRoute(guideId);
        if (result.success) {
          setData((prevData) =>
            prevData.filter((guide) => guide.id !== guideId)
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
        description: "ID de la guía no encontrado",
        variant: "destructive",
      });
    }
  };

  // Definición y configuración de la tabla (código sin modificaciones)
  const filteredData = React.useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter((guide) =>
      guide.assignedUserId?.toLowerCase().includes(filter.toLowerCase())
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
    <div className="w-full pt-6">
      <Label htmlFor="filter">Buscar por conductor</Label>
      <div className="flex items-center justify-between space-x-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Buscar por nombre del conductor"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-8 max-w-sm"
          />
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center space-x-4 justify-center">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center justify-start">
                    <FormLabel htmlFor="date">Fecha</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Seleccione una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedUserId"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel htmlFor="assignedUserId">Usuario</FormLabel>
                    <Input
                      {...field}
                      placeholder="ID del conductor"
                      className="w-full"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" variant="default" size="sm">
                {loading ? (
                  <Loader className="animate-spin size-4" />
                ) : (
                  "Buscar"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Sección de carga y tabla */}
      <div className="rounded-md border mt-2">
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <Loader className="animate-spin size-4" />
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
                    No hay guías disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Paginación */}
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
