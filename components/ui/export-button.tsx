"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportExcel = () => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      console.log("Exporting to Excel...");
      setIsExporting(false);
      // Here you would implement the actual Excel export functionality
    }, 1000);
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      console.log("Exporting to PDF...");
      setIsExporting(false);
      // Here you would implement the actual PDF export functionality
    }, 1000);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-2" disabled={isExporting}>
          <Download className="h-4 w-4" />
          {isExporting ? "Generando..." : "Generar Reporte"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={handleExportExcel}
          className="gap-2 cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Exportar a Excel</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleExportPDF}
          className="gap-2 cursor-pointer"
        >
          <FileText className="h-4 w-4" />
          <span>Exportar a PDF</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
