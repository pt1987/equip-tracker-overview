
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { 
  OrderTimeline,
  YearlyBudgetReport, 
  YearlyAssetPurchaseReport, 
  AssetUsageDurationReport, 
  WarrantyDefectReport 
} from "@/lib/types";
import { formatCurrency, formatDate, localizeCategory } from "@/lib/utils";

// Function to export data to Excel
export function exportToExcel(data: any[], fileName: string, sheetName: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

// Function to export data to PDF
export function exportToPDF(
  title: string, 
  data: any[], 
  columns: { header: string; dataKey: string; formatter?: (value: any) => string }[],
  fileName: string
) {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 20);
  doc.setFontSize(10);
  doc.text(`Generated: ${formatDate(new Date().toISOString())}`, 14, 30);
  
  // Prepare data for autoTable
  const headers = columns.map(col => col.header);
  const dataRows = data.map(item => {
    return columns.map(col => {
      const value = item[col.dataKey];
      return col.formatter ? col.formatter(value) : value;
    });
  });
  
  // Add table
  autoTable(doc, {
    head: [headers],
    body: dataRows,
    startY: 40,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 }
  });
  
  doc.save(`${fileName}.pdf`);
}

// Specific export functions for each report type
export function exportOrderTimeline(data: OrderTimeline[], format: 'excel' | 'pdf' = 'excel') {
  // Transform data for export
  const exportData = data.flatMap(employee => 
    employee.orders.map(order => ({
      Employee: employee.employeeName,
      Date: formatDate(order.date),
      Asset: order.assetName,
      Type: order.assetType,
      Price: order.price
    }))
  );
  
  if (format === 'excel') {
    exportToExcel(exportData, 'OrderTimeline', 'Orders');
  } else {
    exportToPDF(
      'Employee Order Timeline', 
      exportData,
      [
        { header: 'Employee', dataKey: 'Employee' },
        { header: 'Date', dataKey: 'Date' },
        { header: 'Asset', dataKey: 'Asset' },
        { header: 'Type', dataKey: 'Type' },
        { header: 'Price', dataKey: 'Price', formatter: (value) => formatCurrency(value) }
      ],
      'OrderTimeline'
    );
  }
}

export function exportYearlyBudget(data: YearlyBudgetReport[], format: 'excel' | 'pdf' = 'excel') {
  const exportData = data.map(item => ({
    Year: item.year,
    TotalSpent: item.totalSpent
  }));
  
  if (format === 'excel') {
    exportToExcel(exportData, 'YearlyBudget', 'Budget');
  } else {
    exportToPDF(
      'Yearly Budget Usage', 
      exportData,
      [
        { header: 'Year', dataKey: 'Year' },
        { header: 'Total Spent', dataKey: 'TotalSpent', formatter: (value) => formatCurrency(value) }
      ],
      'YearlyBudget'
    );
  }
}

export function exportYearlyPurchases(data: YearlyAssetPurchaseReport[], format: 'excel' | 'pdf' = 'excel') {
  const exportData = data.map(item => ({
    Year: item.year,
    Laptops: item.assetsByType.laptop || 0,
    Smartphones: item.assetsByType.smartphone || 0,
    Tablets: item.assetsByType.tablet || 0,
    Mice: item.assetsByType.mouse || 0,
    Keyboards: item.assetsByType.keyboard || 0,
    Accessories: item.assetsByType.accessory || 0,
    Total: item.total
  }));
  
  if (format === 'excel') {
    exportToExcel(exportData, 'YearlyPurchases', 'Purchases');
  } else {
    exportToPDF(
      'Yearly Asset Purchases', 
      exportData,
      [
        { header: 'Year', dataKey: 'Year' },
        { header: 'Laptops', dataKey: 'Laptops' },
        { header: 'Smartphones', dataKey: 'Smartphones' },
        { header: 'Tablets', dataKey: 'Tablets' },
        { header: 'Mice', dataKey: 'Mice' },
        { header: 'Keyboards', dataKey: 'Keyboards' },
        { header: 'Accessories', dataKey: 'Accessories' },
        { header: 'Total', dataKey: 'Total' }
      ],
      'YearlyPurchases'
    );
  }
}

export function exportUsageDuration(data: AssetUsageDurationReport[], format: 'excel' | 'pdf' = 'excel') {
  const exportData = data.map(item => ({
    Category: localizeCategory(item.category),
    AverageMonths: item.averageMonths,
    Count: item.count
  }));
  
  if (format === 'excel') {
    exportToExcel(exportData, 'UsageDuration', 'Usage');
  } else {
    exportToPDF(
      'Average Asset Usage Duration', 
      exportData,
      [
        { header: 'Category', dataKey: 'Category' },
        { header: 'Average Months', dataKey: 'AverageMonths' },
        { header: 'Count', dataKey: 'Count' }
      ],
      'UsageDuration'
    );
  }
}

export function exportWarrantyDefects(data: WarrantyDefectReport, format: 'excel' | 'pdf' = 'excel') {
  const exportData = [
    {
      Status: 'With Warranty',
      Count: data.withWarranty.count,
      Percentage: `${data.withWarranty.percentage.toFixed(1)}%`
    },
    {
      Status: 'Without Warranty',
      Count: data.withoutWarranty.count,
      Percentage: `${data.withoutWarranty.percentage.toFixed(1)}%`
    },
    {
      Status: 'Total',
      Count: data.withWarranty.count + data.withoutWarranty.count,
      Percentage: '100%'
    }
  ];
  
  if (format === 'excel') {
    exportToExcel(exportData, 'WarrantyDefects', 'Warranty');
  } else {
    exportToPDF(
      'Defective Hardware Warranty Analysis', 
      exportData,
      [
        { header: 'Status', dataKey: 'Status' },
        { header: 'Count', dataKey: 'Count' },
        { header: 'Percentage', dataKey: 'Percentage' }
      ],
      'WarrantyDefects'
    );
  }
}
