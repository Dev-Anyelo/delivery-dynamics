"use client";

import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import * as React from "react";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { formatDate } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import VisitCards from "../ui/visit-cards";
import { TooltipProvider } from "../ui/tooltip";
import { Alert, AlertDescription } from "../ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { FormField, FormItem } from "@/components/ui/form";
import { fetchAllGuides, fetchGuideById } from "@/actions/actions";
import { RowsTableSkeletons } from "../skeletons/dashboard-skeletons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import {
  PlanSchema,
  FilterGuidesSchema,
  SearchGuideSchema,
  OperationType,
  PointOfInterestType,
} from "@/schemas/schemas";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Loader,
  Edit,
  Search,
  CalendarIcon,
  MoreHorizontal,
  Copy,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Filter,
  Plus,
  X,
  SlidersHorizontal,
  RefreshCcw,
  FileStack,
  Trash2,
  AlertCircle,
  Truck,
  ShoppingCart,
  Building,
  CalendarDays,
  Check,
  Info,
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useAuth } from "../AuthContext";

export function GuidesTable() {
  const { user } = useAuth();
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
      date: new Date("2018-01-24"),
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
      // Columna ID
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue("id")}</span>
        ),
      },
      {
        accessorKey: "operationType",
        header: "Tipo de operación",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={`rounded-full font-semibold ${
              row.getValue("operationType") === OperationType.Values.delivery
                ? "bg-blue-500/15 text-blue-500"
                : "bg-emerald-500/15 text-emerald-500"
            }`}
          >
            {row.getValue("operationType") === OperationType.Values.delivery ? (
              <>
                <Truck className="mr-1 size-4" />
                Entrega
              </>
            ) : (
              <>
                <ShoppingCart className="mr-1 size-3" />
                Ventas
              </>
            )}
          </Badge>
        ),
      },

      // Columna Conductor ID
      {
        accessorKey: "assignedUserId",
        header: "Conductor",
        cell: ({ row }) => (
          <div className="flex justify-center items-center gap-2">
            <Badge
              variant="outline"
              className="rounded-full text-primary font-semibold bg-emerald-500/15 text-emerald-500"
            >
              {row.original.assignedUserId || "—"}
            </Badge>
          </div>
        ),
      },

      {
        accessorKey: "startPoint",
        header: "Punto de partida",
        cell: ({ row }) => {
          const { address, type } = row.original.startPoint as {
            address: string;
            type: keyof typeof typeMapping;
          };

          const typeMapping = {
            [PointOfInterestType.Values.distribution_center]: {
              label: "Centro de distribución",
            },
            [PointOfInterestType.Values.store]: {
              label: "Tienda",
            },
            [PointOfInterestType.Values.warehouse]: {
              label: "Almacén",
            },
            [PointOfInterestType.Values.headquarters]: {
              label: "Sede",
            },
          };

          return (
            <div className="flex flex-col justify-center items-center gap-1 text-sm text-center">
              <span className="font-medium text-primary text-center">
                {address}
              </span>
              {typeMapping[type as keyof typeof typeMapping] && (
                <span className="flex justify-center items-center text-muted-foreground">
                  {typeMapping[type as keyof typeof typeMapping].label}
                </span>
              )}
            </div>
          );
        },
      },

      {
        accessorKey: "endPoint",
        header: "Punto de llegada",
        cell: ({ row }) => {
          const { address, type } = row.original.endPoint as {
            address: string;
            type: keyof typeof typeMapping;
          };

          const typeMapping = {
            [PointOfInterestType.Values.distribution_center]: {
              label: "Centro de distribución",
            },
            [PointOfInterestType.Values.store]: {
              label: "Tienda",
            },
            [PointOfInterestType.Values.warehouse]: {
              label: "Almacén",
            },
            [PointOfInterestType.Values.headquarters]: {
              label: "Sede",
            },
          };

          return (
            <div className="flex flex-col items-center gap-1 text-sm">
              <span className="font-medium text-primary">{address}</span>
              {typeMapping[type as keyof typeof typeMapping] && (
                <span className="flex items-center text-muted-foreground">
                  {typeMapping[type as keyof typeof typeMapping].label}
                </span>
              )}
            </div>
          );
        },
      },

      // Columna Fecha
      {
        accessorKey: "date",
        header: "Fecha",
        cell: ({ row }) => {
          const date = new Date(row.original.date);
          return (
            <div className="flex flex-col justify-center items-center">
              <span className="font-medium">
                {new Intl.DateTimeFormat("es-ES", {
                  dateStyle: "medium",
                }).format(date)}
              </span>
            </div>
          );
        },
      },

      // Columna Visitas (con diálogo para ver visitas)
      {
        accessorKey: "visits",
        header: "Visitas",
        cell: ({ row }) => {
          const visits = row.original.visits || [];
          return (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-primary/10 text-primary font-semibold hover:bg-blue-500/15 hover:text-blue-500 transition-all duration-500"
                >
                  {visits.length} visita{visits.length !== 1 && "s"}{" "}
                  <ArrowUpRight className="size-4 inline" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[1200px] 2xl:max-w-[1300px] flex flex-col  h-[80vh] sm:h-[70vh] lg:h-[60vh] xl:h-[70vh] 2xl:h-[90vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>Detalles de Visitas</DialogTitle>
                  <DialogDescription className="text-sm dark:text-gray-500 text-neutral-700">
                    Información detallada de las visitas del plan.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col flex-1 overflow-y-auto relative p-4">
                  {visits && visits.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <VisitCards visits={visits} />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Alert variant="default" className="h-12 w-fit">
                        <AlertDescription>
                          <AlertCircle className="size-4 inline mr-2" />
                          No se encontraron visitas para este plan.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="default" size="sm">
                      Cerrar
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          );
        },
      },

      // Columna Fechas activas
      {
        accessorKey: "activeDates",
        header: "Fechas activas",
        cell: ({ row }) => {
          const activeDates = row.original.activeDates || [];

          return (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-primary/10 text-primary font-semibold hover:bg-blue-500/15 hover:text-blue-500 transition-all duration-500"
                >
                  <CalendarDays className="size-4" />
                  Ver fechas
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Fechas activas</DialogTitle>
                  <DialogDescription>
                    Detalle de las fechas activas registradas.
                  </DialogDescription>
                </DialogHeader>

                {activeDates.length > 0 ? (
                  <div className="grid gap-2 max-h-64 overflow-auto mt-4">
                    {activeDates.map((date: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-muted transition-colors"
                      >
                        <span className="font-medium">
                          {new Intl.DateTimeFormat("es-ES", {
                            dateStyle: "full",
                          }).format(new Date(date))}
                        </span>
                        <CalendarDays className="size-4" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-4">
                    Sin fechas activas registradas.
                  </p>
                )}

                <DialogFooter className="pt-4">
                  <DialogClose asChild>
                    <Button variant="default">Cerrar</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          );
        },
      },

      // Columna Acciones
      {
        id: "actions",
        enableHiding: false,
        header: "Acciones",
        cell: ({ row }) => {
          const guide = row.original as z.infer<typeof PlanSchema>;
          return (
            <div className="flex justify-center items-center">
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
                      <Info className="mr-2 size-4" /> Detalles
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={isCopied || !guide.id}
                    onClick={handleCopy}
                    className="flex items-center cursor-pointer"
                  >
                    <Copy className="mr-2 size-4" /> Copiar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <span className="flex justify-center items-center gap-2">
                          <Trash2 className="size-4" /> Eliminar
                        </span>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Eliminar historial de mantenimiento
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            ¿Estás seguro de que deseas eliminar esta guía?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteGuide(guide.id)}
                          >
                            Continuar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

  // Fetch all guides by date and driver
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

  // Fetch guide by ID
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

  // TODO: Delete guide by ID
  const handleDeleteGuide = async (guideId: number) => {};

  const handleCopy = () => {
    if (data.length === 0) return;

    const textToCopy = data
      .map((guide) => {
        return `ID: ${guide.id}
          Conductor: ${guide.assignedUserId || "—"}
          Tipo de operación: ${
            guide.operationType === OperationType.Values.delivery
              ? "Entrega"
              : "Ventas"
          }
          Punto de partida: ${guide.startPoint.address}
          Punto de llegada: ${guide.endPoint.address}
          Fecha: ${formatDate(guide.date)}
          Visitas: ${guide.visits.length}
          Fechas activas: ${guide.activeDates.length}`;
      })
      .join("\n\n")
      .trim();

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setIsCopied(true);
        toast.success("Información copiada al portapapeles");
        setTimeout(() => setIsCopied(false), 3000);
      })
      .catch((error) => {
        toast.error("Error al copiar la información");
        console.error("Error al copiar la información: ", error);
      });
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
                  Administra, visualiza y controla todas las guías de transporte
                  de manera eficiente y detallada.
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
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all" className="w-full p-0">
              <div className="flex items-center justify-between py-3">
                <TabsList>
                  <TabsTrigger value="all">Todas</TabsTrigger>
                  <TabsTrigger
                    value="active"
                    disabled
                    className="cursor-not-allowed"
                  >
                    En progreso
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    disabled
                    className="cursor-not-allowed"
                  >
                    Completadas
                  </TabsTrigger>
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
                                        <CalendarIcon className="mr-2 size-4" />
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
                                        <X className="size-4" />
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
                      {loading ? (
                        <RowsTableSkeletons columns={columns.length} />
                      ) : table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                            className="group text-center"
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
                                No se encontraron guías.
                              </p>
                              <p className="text-xs">
                                Realiza una búsqueda o aplica filtros para ver
                                las guías disponibles.
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
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </TooltipProvider>
  );
}
