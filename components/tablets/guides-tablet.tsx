"use client";

import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import * as React from "react";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { ScrollArea } from "../ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { FormField, FormItem } from "@/components/ui/form";
import { fetchAllGuides, deleteRoute, fetchGuideById } from "@/actions/actions";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import {
  PlanSchema,
  FilterGuidesSchema,
  SearchGuideSchema,
} from "@/schemas/schemas";

import {
  Loader,
  Trash,
  Edit,
  Search,
  CalendarIcon,
  MoreHorizontal,
  Copy,
  ChevronLeft,
  ChevronRight,
  Columns,
  ChevronDown,
  ArrowUpRight,
  Filter,
  Plus,
  X,
  SlidersHorizontal,
  RefreshCcw,
  FileStack,
} from "lucide-react";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { RowsTableSkeletons } from "../skeletons/dashboard-skeletons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function GuidesTable() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<z.infer<typeof PlanSchema>[]>([]);
  const [isCopied, setIsCopied] = React.useState<boolean>(false);
  const [isSearchingGuidByID, setIsSearchingGuidByID] =
    React.useState<boolean>(false);
  const [showFilters, setShowFilters] = React.useState<boolean>(false);

  // Table states
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Forms
  const filterForm = useForm<z.infer<typeof FilterGuidesSchema>>({
    resolver: zodResolver(FilterGuidesSchema),
    defaultValues: {
      assignedUserId: "",
      date: new Date(),
    },
  });

  const searchForm = useForm<z.infer<typeof SearchGuideSchema>>({
    resolver: zodResolver(SearchGuideSchema),
    defaultValues: {
      guideSearchID: "",
    },
  });

  // Table columns definition
  const columns: ColumnDef<z.infer<typeof PlanSchema>>[] = React.useMemo(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8 data-[state=open]:bg-accent"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <span>ID</span>
              <ChevronDown className="ml-1 size-4" />
            </Button>
          </div>
        ),
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue("id")}</span>
        ),
      },
      {
        accessorKey: "assignedUserId",
        header: ({ column }) => (
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8 data-[state=open]:bg-accent"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <span>Conductor</span>
              <ChevronDown className="ml-1 size-4" />
            </Button>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-full">
              {row.original.assignedUserId || "—"}
            </Badge>
          </div>
        ),
      },
      {
        accessorKey: "date",
        header: ({ column }) => (
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8 data-[state=open]:bg-accent"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <span>Fecha</span>
              <ChevronDown className="ml-1 size-4" />
            </Button>
          </div>
        ),
        cell: ({ row }) => {
          const date = new Date(row.original.date);
          return (
            <div className="flex flex-col">
              <span className="font-medium">
                {new Intl.DateTimeFormat("es-ES", {
                  dateStyle: "medium",
                }).format(date)}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Intl.DateTimeFormat("es-ES", {
                  timeStyle: "short",
                }).format(date)}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "visits",
        header: "Visitas",
        cell: ({ row }) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="cursor-help">
                  {row.original.visits?.length || 0} visitas
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-sm">
                <ScrollArea className="h-[200px] w-[300px] rounded-md border p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Detalles de visitas</h4>
                    {row.original.visits?.length ? (
                      <ul className="space-y-2">
                        {row.original.visits?.map(
                          (visit: any, index: number) => (
                            <li
                              key={index}
                              className="border-b pb-2 last:border-0"
                            >
                              <div className="font-medium">{visit.address}</div>
                              <div className="text-sm text-muted-foreground">
                                Estado: {visit.status}
                              </div>
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No hay visitas programadas
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
      },
      {
        accessorKey: "truck",
        header: "Vehículo",
        cell: ({ row }) => (
          <Badge variant="outline">
            {row.original.truck?.id || "No asignado"}
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
          const status = row.original.actualEndTimestamp
            ? "Completado"
            : "En progreso";
          return (
            <Badge
              className={
                status === "Completado"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
              }
            >
              {status}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        header: "",
        cell: ({ row }) => {
          const guide = row.original as z.infer<typeof PlanSchema>;
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <span className="sr-only">Abrir menú</span>
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/guides/guides-details/${guide.id}`}
                      className="flex items-center cursor-pointer"
                    >
                      <Edit className="mr-2 size-4" /> Ver detalles
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopy}>
                    <Copy className="mr-2 size-4" /> Copiar información
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDeleteGuide(guide.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash className="mr-2 size-4" /> Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    []
  );

  // Initialize table
  const table = useReactTable({
    data,
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

  // Handler functions
  const searchGuidesByDateAndDriver = async (
    formData: z.infer<typeof FilterGuidesSchema>
  ) => {
    const formattedDate =
      formData.date instanceof Date
        ? formData.date.toISOString().split("T")[0]
        : formData.date;

    setLoading(true);

    try {
      const { success, message, data } = await fetchAllGuides(
        formattedDate,
        formData.assignedUserId || ""
      );

      if (success) {
        setData(data || []);
        toast.success(message || "Datos cargados correctamente");
        setShowFilters(false);
      } else {
        setData([]);
        toast.error(message || "Error en la solicitud");
      }
    } catch (error: any) {
      toast.error(error.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const searchGuideByID = async (
    formData: z.infer<typeof SearchGuideSchema>
  ) => {
    const { guideSearchID } = formData;

    if (!guideSearchID) {
      toast.error("Por favor, ingrese un ID de guía válido.");
      return;
    }

    setIsSearchingGuidByID(true);
    try {
      const response = await fetchGuideById(guideSearchID);
      if (response.success) {
        setData([response.data]);
        toast.success(response.message || "Guía encontrada.");
      } else {
        setData([]);
        toast.error(response.message || "No se encontró la guía.");
      }
    } catch (error) {
      console.error("Error al buscar la guía", error);
      toast.error("Error al buscar la guía");
    } finally {
      setIsSearchingGuidByID(false);
    }
  };

  const handleDeleteGuide = async (guideId: number) => {
    if (!guideId) {
      toast.error("ID de guía inválido");
      return;
    }

    try {
      const result = await deleteRoute(guideId);
      if (result.success) {
        setData((prevData) => prevData.filter((guide) => guide.id !== guideId));
        toast.success("Guía eliminada correctamente");
      } else {
        toast.error("Error al eliminar la guía");
      }
    } catch (error: any) {
      toast.error("Error al eliminar la guía");
    }
  };

  const handleCopy = () => {
    if (data.length === 0) return;

    const textToCopy = data
      .map((guide) => {
        const formattedDate = new Intl.DateTimeFormat("es-ES", {
          dateStyle: "full",
        }).format(new Date(guide.date));
        return `ID de la Guía: ${guide.id}
        Conductor asignado: ${guide.assignedUserId || "Desconocido"}
        Fecha: ${formattedDate}
        ID de la Ruta: ${guide.guideId || "No disponible"}
        Órdenes: ${guide.orders || "Órdenes no disponible"}`;
      })
      .join("\n\n")
      .trim();

    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    toast.success("Información copiada al portapapeles");
    setTimeout(() => setIsCopied(false), 3000);
  };

  const resetFilters = () => {
    table.resetColumnFilters();
    filterForm.reset({
      assignedUserId: "",
      date: new Date(),
    });
    searchForm.reset({
      guideSearchID: "",
    });
  };

  return (
    <TooltipProvider>
      <div className="w-full space-y-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3 px-0 pt-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl">
                  Gestión de Guías
                </CardTitle>
                <CardDescription>
                  Administra y visualiza todas las guías de transporte
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading || isSearchingGuidByID}
                  onClick={() => setShowFilters(!showFilters)}
                  className="hidden md:flex"
                >
                  <Filter className="mr-2 size-4" />
                  {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
                </Button>
                <Button
                  disabled={loading || isSearchingGuidByID}
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden"
                >
                  <Filter className="size-4" />
                </Button>
                <Button
                  asChild
                  size="sm"
                  disabled={loading || isSearchingGuidByID}
                >
                  <Link href="/guides/new">
                    <Plus className="size-4" />
                    Nueva Guía
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all" className="w-full p-0">
              <div className="flex items-center justify-between py-3">
                <TabsList>
                  <TabsTrigger value="all">Todas</TabsTrigger>
                  <TabsTrigger value="active">En progreso</TabsTrigger>
                  <TabsTrigger value="completed">Completadas</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                    <Input
                      disabled={loading || isSearchingGuidByID}
                      placeholder="Buscar por conductor..."
                      value={
                        (table
                          .getColumn("assignedUserId")
                          ?.getFilterValue() as string) ?? ""
                      }
                      onChange={(event) =>
                        table
                          .getColumn("assignedUserId")
                          ?.setFilterValue(event.target.value)
                      }
                      className="pl-9 h-9"
                    />
                    {(table
                      .getColumn("assignedUserId")
                      ?.getFilterValue() as string) && (
                      <Button
                        disabled={loading || isSearchingGuidByID}
                        variant="ghost"
                        size="icon"
                        className="absolute right-0.5 top-0.5 h-8 w-8"
                        onClick={() =>
                          table.getColumn("assignedUserId")?.setFilterValue("")
                        }
                      >
                        <X className="size-4" />
                        <span className="sr-only">Limpiar búsqueda</span>
                      </Button>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="size-9">
                        <SlidersHorizontal className="size-4" />
                        <span className="sr-only">Opciones de tabla</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Columnas visibles</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                              column.toggleVisibility(!!value)
                            }
                          >
                            {column.id === "assignedUserId"
                              ? "Conductor"
                              : column.id === "id"
                              ? "ID"
                              : column.id}
                          </DropdownMenuCheckboxItem>
                        ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={resetFilters}
                        disabled={loading || isSearchingGuidByID}
                      >
                        <X className="mr-2 size-4" />
                        Reiniciar filtros
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {showFilters && (
                <div className="p-6 dark:bg-muted/35 rounded-lg">
                  <div className="mb-4">
                    <h1 className="text-lg font-semibold">Filtros</h1>
                    <p className="text-sm text-muted-foreground">
                      Puedes filtrar las guías por criterios específicos o
                      generales.
                    </p>
                  </div>

                  {/* Sección 1: Búsqueda específica */}
                  <div className="mb-6">
                    <h2 className="text-md font-semibold mb-2">
                      Búsqueda por ID
                    </h2>
                    <Card className="border shadow-none">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium">
                          ID de la Guía
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <form
                          onSubmit={searchForm.handleSubmit(searchGuideByID)}
                          className="space-y-2"
                        >
                          <div className="flex space-x-2">
                            <div className="relative flex-1">
                              <Input
                                id="guideSearchID"
                                placeholder="Ej: 1234"
                                {...searchForm.register("guideSearchID")}
                                className="pr-10"
                                disabled={loading || isSearchingGuidByID}
                              />
                              {searchForm.watch("guideSearchID") && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 size-9"
                                  onClick={() =>
                                    searchForm.setValue("guideSearchID", "")
                                  }
                                >
                                  <X className="size-4" />
                                  <span className="sr-only">Limpiar</span>
                                </Button>
                              )}
                            </div>
                            <Button
                              type="submit"
                              size="icon"
                              disabled={loading || isSearchingGuidByID}
                              className="size-9"
                            >
                              {isSearchingGuidByID ? (
                                <Loader className="size-4 animate-spin" />
                              ) : (
                                <Search className="size-4" />
                              )}
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sección 2: Filtros Generales */}
                  <div>
                    <h2 className="text-md font-semibold mb-2">
                      Filtros Generales
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Filtrar por fecha */}
                      <Card className="border shadow-none">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Fecha
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <FormProvider {...filterForm}>
                            <FormField
                              control={filterForm.control}
                              name="date"
                              render={({ field }) => (
                                <FormItem className="space-y-2">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                        disabled={
                                          loading || isSearchingGuidByID
                                        }
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value
                                          ? new Intl.DateTimeFormat("es-ES", {
                                              dateStyle: "long",
                                            }).format(new Date(field.value))
                                          : "Seleccione fecha"}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto p-0"
                                      align="start"
                                    >
                                      <Calendar
                                        mode="single"
                                        selected={
                                          field.value instanceof Date
                                            ? field.value
                                            : new Date(field.value)
                                        }
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                          date > new Date() ||
                                          date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </FormItem>
                              )}
                            />
                          </FormProvider>
                        </CardContent>
                      </Card>

                      {/* Filtrar por conductor */}
                      <Card className="border shadow-none">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Conductor
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <FormProvider {...filterForm}>
                            <FormField
                              control={filterForm.control}
                              name="assignedUserId"
                              render={({ field }) => (
                                <FormItem className="space-y-2">
                                  <div className="relative">
                                    <Input
                                      placeholder="ID del conductor"
                                      {...field}
                                      className="pr-10"
                                      disabled={loading || isSearchingGuidByID}
                                    />
                                    {field.value && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 size-9"
                                        onClick={() =>
                                          filterForm.setValue(
                                            "assignedUserId",
                                            ""
                                          )
                                        }
                                      >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Limpiar</span>
                                      </Button>
                                    )}
                                  </div>
                                </FormItem>
                              )}
                            />
                          </FormProvider>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex justify-end mt-6 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetFilters}
                      disabled={loading || isSearchingGuidByID}
                    >
                      <RefreshCcw className="size-4" />
                      Reiniciar
                    </Button>
                    <Button
                      disabled={loading || isSearchingGuidByID}
                      size="sm"
                      onClick={filterForm.handleSubmit(
                        searchGuidesByDateAndDriver
                      )}
                    >
                      {loading ? (
                        <Loader className="size-4 animate-spin" />
                      ) : (
                        <>
                          <Search className="size-4" />
                          Buscar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              <TabsContent value="all" className="p-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableHead key={header.id}>
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
                      {loading ? (
                        <RowsTableSkeletons columns={columns.length} />
                      ) : table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                            className="group"
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
                          <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                          >
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <div className="rounded-full bg-muted p-3 mb-2">
                                <FileStack className="size-4" />
                              </div>
                              <p className="text-sm">No se encontraron guías</p>
                              <p className="text-xs">
                                Intenta con otros filtros o crea una nueva guía
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="active" className="p-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableHead key={header.id}>
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
                      {loading ? (
                        <RowsTableSkeletons columns={columns.length} />
                      ) : table
                          .getRowModel()
                          .rows.filter(
                            (row) => !row.original.actualEndTimestamp
                          ).length > 0 ? (
                        table
                          .getRowModel()
                          .rows.filter(
                            (row) => !row.original.actualEndTimestamp
                          )
                          .map((row) => (
                            <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && "selected"}
                              className="group"
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
                          <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                          >
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <div className="rounded-full bg-muted p-3 mb-2">
                                <FileStack className="size-4" />
                              </div>
                              <p className="text-sm">
                                No hay guías en progreso
                              </p>
                              <p className="text-xs">
                                Todas las guías están completadas
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="completed" className="p-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableHead key={header.id}>
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
                      {loading ? (
                        <RowsTableSkeletons columns={columns.length} />
                      ) : table
                          .getRowModel()
                          .rows.filter((row) => row.original.actualEndTimestamp)
                          .length > 0 ? (
                        table
                          .getRowModel()
                          .rows.filter((row) => row.original.actualEndTimestamp)
                          .map((row) => (
                            <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && "selected"}
                              className="group"
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
                          <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                          >
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <div className="rounded-full bg-muted p-3 mb-2">
                                <FileStack className="size-4" />
                              </div>
                              <p className="text-sm">
                                No hay guías completadas
                              </p>
                              <p className="text-xs">
                                Todas las guías están en progreso
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex items-center justify-between p-4 border-t">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <span>
                  {table.getFilteredSelectedRowModel().rows.length} de{" "}
                  {table.getFilteredRowModel().rows.length} filas seleccionadas
                </span>
              ) : (
                <span>
                  {table.getFilteredRowModel().rows.length} guías encontradas
                </span>
              )}
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Filas por página</p>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue
                      placeholder={table.getState().pagination.pageSize}
                    />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Página {table.getState().pagination.pageIndex + 1} de{" "}
                {table.getPageCount()}
              </div>
              <div className="flex items-center space-x-2">
                {/* <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Ir a la primera página</span>
                  <ChevronLeft className="size-4" />
                  <ChevronLeft className="size-4" />
                </Button> */}
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Ir a la página anterior</span>
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Ir a la página siguiente</span>
                  <ChevronRight className="size-4" />
                </Button>
                {/* <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Ir a la última página</span>
                  <ChevronRight className="size-4" />
                  <ChevronRight className="size-4" />
                </Button> */}
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </TooltipProvider>
  );
}
