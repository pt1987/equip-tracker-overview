import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { 
  OrderTimeline,
  YearlyBudgetReport, 
  YearlyAssetPurchaseReport, 
  AssetUsageDurationReport, 
  WarrantyDefectReport,
  FixedAssetsReport,
  VendorPurchaseReport,
  Employee
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

export function exportFixedAssetsReport(data: FixedAssetsReport, format: 'excel' | 'pdf' = 'excel') {
  const fixedAssetsExportData = data.fixedAssets.map(asset => {
    const netPrice = asset.netPurchasePrice || asset.price / 1.19;
    return {
      Name: asset.name,
      Type: asset.type,
      Category: asset.category,
      Manufacturer: asset.manufacturer,
      Model: asset.model,
      SerialNumber: asset.serialNumber || '',
      PurchaseDate: formatDate(asset.purchaseDate),
      OriginalValue: netPrice,
      CurrentBookValue: data.currentBookValue
    };
  });

  const gwgAssetsExportData = data.gwgAssets.map(asset => {
    const netPrice = asset.netPurchasePrice || asset.price / 1.19;
    return {
      Name: asset.name,
      Type: asset.type,
      Category: asset.category,
      Manufacturer: asset.manufacturer,
      Model: asset.model,
      SerialNumber: asset.serialNumber || '',
      PurchaseDate: formatDate(asset.purchaseDate),
      Value: netPrice
    };
  });

  const summaryData = [
    {
      Category: 'Anlagevermögen',
      Count: data.assetCount.fixed,
      TotalValue: data.fixedAssetValue,
      CurrentBookValue: data.currentBookValue,
      DepreciationAmount: data.depreciationAmount
    },
    {
      Category: 'GWG',
      Count: data.assetCount.gwg,
      TotalValue: data.gwgValue,
      CurrentBookValue: 0,
      DepreciationAmount: data.gwgValue
    },
    {
      Category: 'Gesamt',
      Count: data.assetCount.fixed + data.assetCount.gwg,
      TotalValue: data.fixedAssetValue + data.gwgValue,
      CurrentBookValue: data.currentBookValue,
      DepreciationAmount: data.depreciationAmount + data.gwgValue
    }
  ];

  if (format === 'excel') {
    const workbook = XLSX.utils.book_new();
    
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Übersicht');
    
    const fixedAssetsSheet = XLSX.utils.json_to_sheet(fixedAssetsExportData);
    XLSX.utils.book_append_sheet(workbook, fixedAssetsSheet, 'Anlagevermögen');
    
    const gwgSheet = XLSX.utils.json_to_sheet(gwgAssetsExportData);
    XLSX.utils.book_append_sheet(workbook, gwgSheet, 'GWG');
    
    XLSX.writeFile(workbook, 'FixedAssetsReport.xlsx');
  } else {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Anlagevermögen & GWG Bericht', 14, 20);
    doc.setFontSize(10);
    doc.text(`Erstellt am: ${formatDate(new Date().toISOString())}`, 14, 30);
    
    autoTable(doc, {
      head: [['Kategorie', 'Anzahl', 'Gesamtwert', 'Buchwert', 'AfA Betrag']],
      body: summaryData.map(item => [
        item.Category,
        item.Count.toString(),
        formatCurrency(item.TotalValue),
        formatCurrency(item.CurrentBookValue),
        formatCurrency(item.DepreciationAmount)
      ]),
      startY: 40,
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Anlagevermögen', 14, 20);
    
    autoTable(doc, {
      head: [['Name', 'Kategorie', 'Kaufdatum', 'Anschaffungswert', 'Buchwert']],
      body: data.fixedAssets.map(asset => {
        const netPrice = asset.netPurchasePrice || asset.price / 1.19;
        const bookValue = data.currentBookValue;
        return [
          asset.name,
          asset.category,
          formatDate(asset.purchaseDate),
          formatCurrency(netPrice),
          formatCurrency(bookValue)
        ];
      }),
      startY: 30,
      headStyles: { fillColor: [41, 128, 185] },
      didDrawPage: (data) => {
        doc.setFontSize(14);
        doc.text('Anlagevermögen', 14, 20);
      }
    });
    
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Geringwertige Wirtschaftsgüter (GWG)', 14, 20);
    
    autoTable(doc, {
      head: [['Name', 'Kategorie', 'Kaufdatum', 'Wert']],
      body: data.gwgAssets.map(asset => {
        const netPrice = asset.netPurchasePrice || asset.price / 1.19;
        return [
          asset.name,
          asset.category,
          formatDate(asset.purchaseDate),
          formatCurrency(netPrice)
        ];
      }),
      startY: 30,
      headStyles: { fillColor: [41, 128, 185] },
      didDrawPage: (data) => {
        doc.setFontSize(14);
        doc.text('Geringwertige Wirtschaftsgüter (GWG)', 14, 20);
      }
    });
    
    doc.save('FixedAssetsReport.pdf');
  }
}

export function exportVendorPurchaseReport(data: VendorPurchaseReport[], format: 'excel' | 'pdf' = 'excel') {
  if (format === 'excel') {
    const workbook = XLSX.utils.book_new();
    
    // Main vendor data
    const vendorData = data.map(vendor => ({
      Vendor: vendor.vendor,
      AssetCount: vendor.assetCount,
      Revenue: vendor.revenue
    }));
    
    const vendorSheet = XLSX.utils.json_to_sheet(vendorData);
    XLSX.utils.book_append_sheet(workbook, vendorSheet, 'Vendors');
    
    // Create sheets for each vendor's manufacturer distribution
    data.forEach(vendor => {
      if (vendor.manufacturerDistribution.length > 0) {
        const mfrData = vendor.manufacturerDistribution.map(mfr => ({
          Manufacturer: mfr.manufacturer,
          Count: mfr.count,
          Percentage: ((mfr.count / vendor.assetCount) * 100).toFixed(1) + '%'
        }));
        
        const mfrSheet = XLSX.utils.json_to_sheet(mfrData);
        XLSX.utils.book_append_sheet(workbook, mfrSheet, vendor.vendor.substring(0, 30));
      }
    });
    
    XLSX.writeFile(workbook, 'VendorPurchaseReport.xlsx');
  } else {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Vendor Purchase Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${formatDate(new Date().toISOString())}`, 14, 30);
    
    // Main vendor data
    autoTable(doc, {
      head: [['Vendor', 'Asset Count', 'Revenue']],
      body: data.map(vendor => [
        vendor.vendor,
        vendor.assetCount.toString(),
        formatCurrency(vendor.revenue)
      ]),
      startY: 40,
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    // For each vendor, add manufacturer distribution
    // Use a variable to track Y position instead of accessing doc.lastAutoTable
    let yPos = 120; // Default position if autoTable doesn't provide final position
    
    // Try to update the Y position based on the autoTable result
    // The plugin adds this property but TypeScript doesn't know about it
    const tableDetails = (doc as any).lastAutoTable;
    if (tableDetails && typeof tableDetails.finalY !== 'undefined') {
      yPos = tableDetails.finalY + 20;
    }
    
    data.forEach((vendor, index) => {
      if (index > 0 && yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(12);
      doc.text(`${vendor.vendor} - Manufacturer Distribution`, 14, yPos);
      
      autoTable(doc, {
        head: [['Manufacturer', 'Count', 'Percentage']],
        body: vendor.manufacturerDistribution.map(mfr => [
          mfr.manufacturer,
          mfr.count.toString(),
          ((mfr.count / vendor.assetCount) * 100).toFixed(1) + '%'
        ]),
        startY: yPos + 10,
        headStyles: { fillColor: [41, 128, 185] }
      });
      
      // Update the Y position for the next table
      const currentTableDetails = (doc as any).lastAutoTable;
      yPos = currentTableDetails && typeof currentTableDetails.finalY !== 'undefined' 
        ? currentTableDetails.finalY + 20 
        : yPos + 60;
    });
    
    doc.save('VendorPurchaseReport.pdf');
  }
}

export function exportEmployeeBudgetReport(data: Employee[], format: 'excel' | 'pdf' = 'excel') {
  const exportData = data.map(employee => {
    const remainingBudget = employee.budget - employee.usedBudget;
    const budgetPercentage = employee.budget > 0 
      ? Math.min(100, Math.round((employee.usedBudget / employee.budget) * 100)) 
      : 0;
      
    return {
      Name: `${employee.firstName} ${employee.lastName}`,
      Position: employee.position,
      Cluster: employee.cluster,
      TotalBudget: employee.budget,
      UsedBudget: employee.usedBudget,
      RemainingBudget: remainingBudget,
      UsagePercentage: `${budgetPercentage}%`
    };
  }).sort((a, b) => a.Name.localeCompare(b.Name));
  
  if (format === 'excel') {
    exportToExcel(exportData, 'EmployeeBudgetReport', 'Mitarbeiter Budget');
  } else {
    exportToPDF(
      'Mitarbeiter Budget Übersicht', 
      exportData,
      [
        { header: 'Name', dataKey: 'Name' },
        { header: 'Position', dataKey: 'Position' },
        { header: 'Cluster', dataKey: 'Cluster' },
        { header: 'Gesamtbudget', dataKey: 'TotalBudget', formatter: (value) => formatCurrency(value) },
        { header: 'Genutzt', dataKey: 'UsedBudget', formatter: (value) => formatCurrency(value) },
        { header: 'Verfügbar', dataKey: 'RemainingBudget', formatter: (value) => formatCurrency(value) },
        { header: 'Nutzung', dataKey: 'UsagePercentage' }
      ],
      'EmployeeBudgetReport'
    );
  }
}
