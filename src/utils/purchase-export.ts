
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { PurchaseItem } from "@/lib/purchase-list-types";
import { formatDate, formatCurrency } from "@/lib/utils";
import * as XLSX from 'xlsx';

/**
 * Export data to Excel or PDF format
 * @param items Data items to export
 * @param format Export format ('excel' or 'pdf')
 * @param fileName Optional file name (without extension)
 * @param title Optional title for PDF export
 */
export const exportPurchaseList = (items: any[], format: 'excel' | 'pdf', fileName?: string, title?: string) => {
  if (format === 'excel') {
    exportToExcel(items, fileName);
  } else {
    exportToPdf(items, title, fileName);
  }
};

/**
 * Export data to Excel
 * @param items Data items to export
 * @param fileName Optional file name (without extension)
 */
const exportToExcel = (items: any[], fileName?: string) => {
  // For purchase list items, transform them to the expected format
  let exportData = items;
  
  if (items.length > 0 && 'documentDate' in items[0]) {
    // These are purchase items, transform them
    exportData = (items as PurchaseItem[]).map(item => ({
      "Belegdatum": formatDate(item.documentDate),
      "Lieferant": item.supplier,
      "Artikelbezeichnung": item.itemDescription,
      "Menge": item.quantity,
      "Einheit": item.unit,
      "Nettobetrag": item.netAmount,
      "MwSt-Betrag": item.vatAmount,
      "MwSt-Satz": item.vatRate,
      "Sachkonto": item.accountNumber,
      "Kostenstelle": item.costCenter,
      "Rechnungsnummer": item.invoiceNumber,
      "Rechnungsdatum": formatDate(item.invoiceDate),
      "Zahlungsart": item.paymentMethod,
      "Asset-ID": item.assetId || "",
      "Status": item.status,
      "GoBD-Status": item.gobdStatus,
      "Erstellt am": formatDate(item.createdAt),
      "Aktualisiert am": formatDate(item.lastModifiedAt),
    }));
  }

  // Create a new workbook and add the data
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Export");
  
  // Generate the Excel file
  const today = new Date().toISOString().slice(0, 10);
  const outputFileName = fileName ? `${fileName}.xlsx` : `Export_${today}.xlsx`;
  XLSX.writeFile(workbook, outputFileName);
};

/**
 * Export data to PDF
 * @param items Data items to export
 * @param title Optional title
 * @param fileName Optional file name (without extension)
 */
const exportToPdf = (items: any[], title?: string, fileName?: string) => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title || "Exportierte Daten", 14, 22);
  
  // Add export date
  doc.setFontSize(11);
  doc.text(`Exportiert am: ${formatDate(new Date().toISOString())}`, 14, 30);
  
  // Prepare table columns and data based on the items structure
  let columns: any[] = [];
  let data: any[] = [];
  
  if (items.length > 0) {
    if ('documentDate' in items[0]) {
      // Purchase list items
      columns = [
        { header: "Belegdatum", dataKey: "date" },
        { header: "Lieferant", dataKey: "supplier" },
        { header: "Artikelbezeichnung", dataKey: "item" },
        { header: "Nettobetrag", dataKey: "net" },
        { header: "MwSt-Betrag", dataKey: "vat" },
        { header: "Sachkonto", dataKey: "account" },
        { header: "Status", dataKey: "status" },
      ];
      
      data = (items as PurchaseItem[]).map(item => ({
        date: formatDate(item.documentDate),
        supplier: item.supplier,
        item: item.itemDescription,
        net: formatCurrency(item.netAmount),
        vat: formatCurrency(item.vatAmount),
        account: item.accountNumber,
        status: formatStatus(item.status),
      }));
    } else {
      // Generic data - extract keys from first item for columns
      const keys = Object.keys(items[0]).filter(key => 
        typeof items[0][key] !== 'object' || items[0][key] === null
      );
      
      columns = keys.map(key => ({
        header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
        dataKey: key,
      }));
      
      data = items.map(item => {
        const rowData: Record<string, any> = {};
        keys.forEach(key => {
          const value = item[key];
          rowData[key] = typeof value === 'number' ? 
            value.toFixed(2) : 
            (value?.toString() || '');
        });
        return rowData;
      });
    }
  }
  
  // Generate the table
  autoTable(doc, {
    startY: 40,
    head: [columns.map(col => col.header)],
    body: data.map(row => columns.map(col => row[col.dataKey])),
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      lineWidth: 0.1,
      lineColor: [220, 220, 220],
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 40 },
  });
  
  // If these are purchase items, add summary
  if (items.length > 0 && 'netAmount' in items[0] && 'vatAmount' in items[0]) {
    const purchaseItems = items as PurchaseItem[];
    const totalNet = purchaseItems.reduce((sum, item) => sum + item.netAmount, 0);
    const totalVat = purchaseItems.reduce((sum, item) => sum + item.vatAmount, 0);
    const totalGross = totalNet + totalVat;
    
    const finalY = (doc as any).lastAutoTable.finalY || 40;
    doc.setFontSize(10);
    doc.text(`Gesamtbetrag netto: ${formatCurrency(totalNet)}`, 14, finalY + 15);
    doc.text(`Gesamtbetrag MwSt: ${formatCurrency(totalVat)}`, 14, finalY + 22);
    doc.text(`Gesamtbetrag brutto: ${formatCurrency(totalGross)}`, 14, finalY + 29);
  }
  
  // Add footer
  const finalY = (doc as any).lastAutoTable.finalY || 40;
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(
    "Erstellt mit Asset Management System",
    14,
    finalY + 45
  );
  
  // Add page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Seite ${i} von ${pageCount}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);
  }
  
  // Save the PDF
  const today = new Date().toISOString().slice(0, 10);
  const outputFileName = fileName ? `${fileName}.pdf` : `Export_${today}.pdf`;
  doc.save(outputFileName);
};

/**
 * Format status for display
 * @param status Purchase status
 * @returns Formatted status string
 */
const formatStatus = (status: string): string => {
  switch (status) {
    case "draft": return "Entwurf";
    case "pending": return "Prüfung ausstehend";
    case "approved": return "Genehmigt";
    case "rejected": return "Abgelehnt";
    case "exported": return "Exportiert";
    case "archived": return "Archiviert";
    default: return status;
  }
};
