
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { PurchaseItem } from "@/lib/purchase-list-types";
import { formatDate, formatCurrency } from "@/lib/utils";
import * as XLSX from 'xlsx';

/**
 * Export purchase list data to DATEV format (Excel)
 * @param items Purchase items to export
 */
export const exportPurchaseList = (items: PurchaseItem[], format: 'excel' | 'pdf') => {
  if (format === 'excel') {
    exportToExcel(items);
  } else {
    exportToPdf(items);
  }
};

/**
 * Export purchase list data to Excel
 * @param items Purchase items to export
 */
const exportToExcel = (items: PurchaseItem[]) => {
  // Prepare data for Excel export
  const exportData = items.map(item => ({
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

  // Create a new workbook and add the data
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Einkaufsliste");
  
  // Generate the Excel file
  const today = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `Einkaufsliste_${today}.xlsx`);
};

/**
 * Export purchase list data to PDF
 * @param items Purchase items to export
 */
const exportToPdf = (items: PurchaseItem[]) => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text("Einkaufsliste", 14, 22);
  
  // Add export date
  doc.setFontSize(11);
  doc.text(`Exportiert am: ${formatDate(new Date().toISOString())}`, 14, 30);
  
  // Define table columns
  const columns = [
    { header: "Belegdatum", dataKey: "date" },
    { header: "Lieferant", dataKey: "supplier" },
    { header: "Artikelbezeichnung", dataKey: "item" },
    { header: "Nettobetrag", dataKey: "net" },
    { header: "MwSt-Betrag", dataKey: "vat" },
    { header: "Sachkonto", dataKey: "account" },
    { header: "Status", dataKey: "status" },
  ];
  
  // Prepare table data
  const data = items.map(item => ({
    date: formatDate(item.documentDate),
    supplier: item.supplier,
    item: item.itemDescription,
    net: formatCurrency(item.netAmount),
    vat: formatCurrency(item.vatAmount),
    account: item.accountNumber,
    status: formatStatus(item.status),
  }));
  
  // Generate the table
  autoTable(doc, {
    startY: 40,
    head: [columns.map(col => col.header)],
    body: data.map(row => columns.map(col => row[col.dataKey as keyof typeof row])),
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
  
  // Add summary
  const totalNet = items.reduce((sum, item) => sum + item.netAmount, 0);
  const totalVat = items.reduce((sum, item) => sum + item.vatAmount, 0);
  const totalGross = totalNet + totalVat;
  
  const finalY = (doc as any).lastAutoTable.finalY || 40;
  doc.setFontSize(10);
  doc.text(`Gesamtbetrag netto: ${formatCurrency(totalNet)}`, 14, finalY + 15);
  doc.text(`Gesamtbetrag MwSt: ${formatCurrency(totalVat)}`, 14, finalY + 22);
  doc.text(`Gesamtbetrag brutto: ${formatCurrency(totalGross)}`, 14, finalY + 29);
  
  // Add footer with GoBD compliance notice
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(
    "Diese Aufstellung wurde gemäß GoBD (Grundsätze zur ordnungsmäßigen Führung und Aufbewahrung von Büchern, Aufzeichnungen und Unterlagen in elektronischer Form sowie zum Datenzugriff) erstellt.",
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
  doc.save(`Einkaufsliste_${today}.pdf`);
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
