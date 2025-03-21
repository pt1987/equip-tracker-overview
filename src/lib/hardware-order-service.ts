
import { toast } from "@/hooks/use-toast";
import { Employee } from "@/lib/types";
import { HardwareOrderFormData, hardwareCategoryInfo } from "./hardware-order-types";
import { formatCurrency, formatDate } from "@/lib/utils";

// Email recipient
const RECIPIENT_EMAIL = "xxx@domain.de";

// Function to generate HTML content for the email
function generateOrderHtml(orderData: HardwareOrderFormData, employee: Employee | undefined): string {
  const categoryName = orderData.articleCategory ? hardwareCategoryInfo[orderData.articleCategory].name : 'Unbekannt';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
            .container { max-width: 800px; margin: 0 auto; border: 1px solid #ddd; border-radius: 5px; overflow: hidden; }
            .header { background-color: #2563eb; color: white; padding: 15px; }
            .content { padding: 20px; }
            .footer { background-color: #f9fafb; padding: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f1f5f9; }
            .info-box { background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 5px; padding: 15px; margin: 15px 0; }
            .warning-box { background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 5px; padding: 15px; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Hardware-Bestellung</h2>
            </div>
            <div class="content">
                <p>Eine neue Hardware-Bestellung wurde eingereicht.</p>
                
                <h3>Mitarbeiterinformationen</h3>
                <table>
                    <tr>
                        <th>Name</th>
                        <td>${employee?.firstName || ''} ${employee?.lastName || ''}</td>
                    </tr>
                    <tr>
                        <th>Position</th>
                        <td>${employee?.position || ''}</td>
                    </tr>
                    <tr>
                        <th>Eintrittsdatum</th>
                        <td>${employee ? formatDate(employee.entryDate || employee.startDate) : ''}</td>
                    </tr>
                </table>
                
                <h3>Bestelldetails</h3>
                <table>
                    <tr>
                        <th>Kategorie</th>
                        <td>${categoryName}</td>
                    </tr>
                    <tr>
                        <th>Artikelname</th>
                        <td>${orderData.articleName}</td>
                    </tr>
                    <tr>
                        <th>Konfiguration</th>
                        <td>${orderData.articleConfiguration}</td>
                    </tr>
                    <tr>
                        <th>Link</th>
                        <td><a href="${orderData.articleLink}">${orderData.articleLink}</a></td>
                    </tr>
                    <tr>
                        <th>Geschätzter Preis</th>
                        <td>${formatCurrency(orderData.estimatedPrice)}</td>
                    </tr>
                    ${orderData.justification ? `
                    <tr>
                        <th>Begründung</th>
                        <td>${orderData.justification}</td>
                    </tr>
                    ` : ''}
                </table>
                
                ${orderData.articleCategory === "special" || 
                 (orderData.articleCategory === "smartphone" && orderData.estimatedPrice > 1000) ? `
                <div class="warning-box">
                    <strong>Hinweis:</strong> Diese Bestellung erfordert besondere Genehmigung, da es sich um eine Sonderbestellung handelt.
                </div>
                ` : ''}
                
                <div class="info-box">
                    <strong>Budget-Information:</strong><br>
                    Budget des Mitarbeiters: ${employee ? formatCurrency(employee.budget) : 'Unbekannt'}<br>
                    Bereits verwendet: ${employee ? formatCurrency(employee.usedBudget) : 'Unbekannt'}<br>
                    Verfügbar: ${employee ? formatCurrency(employee.budget - employee.usedBudget) : 'Unbekannt'}<br>
                    Verbleibend nach dieser Bestellung: ${employee ? formatCurrency(employee.budget - employee.usedBudget - orderData.estimatedPrice) : 'Unbekannt'}
                </div>
            </div>
            <div class="footer">
                <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.</p>
                <p>Bestellung eingereicht am: ${formatDate(new Date().toISOString())}</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

// Function to generate the PDF version (placeholder)
function generateOrderPdf(orderData: HardwareOrderFormData, employee: Employee | undefined): Blob {
  // In a real implementation, you would use a library like jspdf to generate a PDF
  // For this example, we'll just create a simple text blob
  const content = `
    Hardware-Bestellung
    
    Mitarbeiter: ${employee?.firstName || ''} ${employee?.lastName || ''}
    Position: ${employee?.position || ''}
    
    Artikel: ${orderData.articleName}
    Kategorie: ${orderData.articleCategory ? hardwareCategoryInfo[orderData.articleCategory].name : 'Unbekannt'}
    Konfiguration: ${orderData.articleConfiguration}
    Preis: ${formatCurrency(orderData.estimatedPrice)}
    Link: ${orderData.articleLink}
    ${orderData.justification ? `Begründung: ${orderData.justification}` : ''}
    
    Budget-Information:
    Budget: ${employee ? formatCurrency(employee.budget) : 'Unbekannt'}
    Bereits verwendet: ${employee ? formatCurrency(employee.usedBudget) : 'Unbekannt'}
    Verfügbar: ${employee ? formatCurrency(employee.budget - employee.usedBudget) : 'Unbekannt'}
    
    Datum: ${formatDate(new Date().toISOString())}
  `;
  
  // Create a blob from the text content
  return new Blob([content], { type: 'application/pdf' });
}

// In a real application, this would be a server-side function
export async function sendOrderEmail(
  orderData: HardwareOrderFormData, 
  employee: Employee | undefined
): Promise<boolean> {
  try {
    console.log("Sending email to:", RECIPIENT_EMAIL);
    console.log("Order data:", orderData);
    console.log("Employee:", employee);
    
    // Generate HTML content for the email
    const htmlContent = generateOrderHtml(orderData, employee);
    
    // Generate PDF attachment
    const pdfAttachment = generateOrderPdf(orderData, employee);
    
    // In a real application, you would send the email using a backend service
    // This is just a simulation for the example
    console.log("Email HTML:", htmlContent);
    console.log("PDF generated:", pdfAttachment);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful email sending
        toast({
          title: "E-Mail versendet",
          description: `Die Bestellung wurde an ${RECIPIENT_EMAIL} gesendet.`,
        });
        resolve(true);
      }, 1000);
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send email");
  }
}
