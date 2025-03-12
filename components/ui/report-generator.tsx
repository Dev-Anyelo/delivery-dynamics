"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileSpreadsheet, FileText, Download, File } from "lucide-react";
import { CheckmarkProps, ReportDialogProps } from "@/interfaces/interfaces";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        delay: i * 0.2,
        type: "spring",
        duration: 1.5,
        bounce: 0.2,
        ease: "easeInOut",
      },
      opacity: { delay: i * 0.2, duration: 0.2 },
    },
  }),
};

function AnimatedCheckmark({
  size = 60,
  strokeWidth = 3,
  color = "rgb(22 163 74)",
  className = "",
}: CheckmarkProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      initial="hidden"
      animate="visible"
      className={className}
    >
      <title>Reporte Completado</title>
      <motion.circle
        cx="50"
        cy="50"
        r="40"
        stroke={color}
        variants={draw}
        custom={0}
        style={{
          strokeWidth,
          strokeLinecap: "round",
          fill: "transparent",
        }}
      />
      <motion.path
        d="M30 50L45 65L70 35"
        stroke={color}
        variants={draw}
        custom={1}
        style={{
          strokeWidth,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          fill: "transparent",
        }}
      />
    </motion.svg>
  );
}

// Mock data for available files
const availableFiles = [
  { id: 1, name: "Reporte de Ventas", type: "sales" },
  { id: 2, name: "Inventario Actual", type: "inventory" },
  { id: 3, name: "Análisis Financiero", type: "finance" },
  { id: 4, name: "Datos de Clientes", type: "customers" },
  { id: 5, name: "Métricas de Rendimiento", type: "performance" },
];

export function ReportDialog({
  isOpen,
  handleClose,
  selectedFile,
  exportType,
}: ReportDialogProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Simular progreso cuando el diálogo está abierto
  useEffect(() => {
    if (isOpen && !isComplete) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 5;
          if (newProgress >= 100) {
            clearInterval(interval);
            setIsComplete(true);
            return 100;
          }
          return newProgress;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isOpen, isComplete]);

  // Resetear el estado cuando se cierra el diálogo
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setProgress(0);
        setIsComplete(false);
      }, 300);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generando Reporte</DialogTitle>
          <DialogDescription>
            {selectedFile?.name} en formato{" "}
            {exportType === "excel" ? "Excel" : "PDF"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="flex items-center justify-center mb-4">
            {isComplete ? (
              <motion.div
                className="flex flex-col items-center gap-3 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 blur-xl bg-green-500/20 rounded-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.2,
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                  />
                  <AnimatedCheckmark size={70} className="relative z-10" />
                </div>
                <motion.p
                  className="text-sm font-medium mt-2"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.4 }}
                >
                  ¡Reporte generado con éxito!
                </motion.p>
              </motion.div>
            ) : (
              <div className="w-full space-y-2">
                <Progress value={progress} className="h-2 w-full" />
                <p className="text-sm text-center text-muted-foreground">
                  {progress.toFixed(0)}% completado
                </p>
              </div>
            )}
          </div>

          {isComplete && (
            <motion.div
              className="flex justify-center mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.4 }}
            >
              <Button onClick={handleClose}>Cerrar</Button>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ReportGenerator() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<
    (typeof availableFiles)[0] | null
  >(null);
  const [exportType, setExportType] = useState<"excel" | "pdf" | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleFileSelect = (
    file: (typeof availableFiles)[0],
    type: "excel" | "pdf"
  ) => {
    setSelectedFile(file);
    setExportType(type);
    setIsOpen(true);
    setIsDropdownOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="group" variant="secondary">
            <Download className="size-4 transition-transform duration-300 group-hover:scale-95 group-hover:-translate-y-[2px]" />
            Generar Reporte
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 transition-all duration-200 ease-in-out"
          style={{
            opacity: isDropdownOpen ? 1 : 0,
            transform: isDropdownOpen ? "translateY(0)" : "translateY(-8px)",
          }}
        >
          <DropdownMenuLabel>Seleccione un archivo</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {availableFiles.map((file) => (
            <div key={file.id}>
              <DropdownMenuLabel className="font-normal flex items-center gap-2 py-2">
                <File className="size-4 text-muted-foreground" />
                {file.name}
              </DropdownMenuLabel>

              <div className="pl-6 pr-2 pb-2">
                <DropdownMenuItem
                  onClick={() => handleFileSelect(file, "excel")}
                  className="gap-2 cursor-pointer transition-all hover:translate-x-1 duration-200"
                >
                  <FileSpreadsheet className="size-4" />
                  <span>Excel</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleFileSelect(file, "pdf")}
                  className="gap-2 cursor-pointer transition-all hover:translate-x-1 duration-200"
                >
                  <FileText className="size-4" />
                  <span>PDF</span>
                </DropdownMenuItem>
              </div>

              {file.id !== availableFiles.length && <DropdownMenuSeparator />}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <ReportDialog
        isOpen={isOpen}
        handleClose={handleClose}
        selectedFile={selectedFile}
        exportType={exportType}
      />
    </>
  );
}
