
import { useCallback } from "react";
import { PurchaseItem } from "@/lib/purchase-list-types";

export function useMockData() {
  const getMockPurchaseItems = useCallback(() => {
    // Mock data for the purchase list
    const mockItems: PurchaseItem[] = [
      {
        id: "1",
        documentDate: "2025-04-15",
        supplier: "Büro Schmidt GmbH",
        itemDescription: "ThinkPad X1 Carbon Gen 9",
        quantity: 1,
        unit: "Stück",
        netAmount: 1680.67,
        vatAmount: 319.33,
        vatRate: 19,
        accountNumber: "0650",
        costCenter: "2000",
        assetId: "a12345",
        status: "approved",
        invoiceNumber: "RE-12345",
        invoiceDate: "2025-04-15",
        paymentMethod: "bank_transfer",
        paymentDate: "2025-04-20",
        documentPath: "/documents/rechnung-12345.pdf",
        documentType: "application/pdf",
        createdAt: "2025-04-15T09:30:00Z",
        createdBy: "user1",
        lastModifiedAt: "2025-04-15T10:15:00Z",
        lastModifiedBy: "user2",
        reviewedAt: "2025-04-15T14:20:00Z",
        reviewedBy: "user3",
        gobdStatus: "green",
        integrationId: "int-12345",
        notes: "Neuer Laptop für Mitarbeiter Max Mustermann"
      },
      {
        id: "2",
        documentDate: "2025-04-10",
        supplier: "Office World",
        itemDescription: "Büromaterial (Stifte, Papier, Ordner)",
        quantity: 15,
        unit: "Stück",
        netAmount: 84.03,
        vatAmount: 15.97,
        vatRate: 19,
        accountNumber: "4400",
        costCenter: "1000",
        status: "pending",
        invoiceNumber: "2025-345",
        invoiceDate: "2025-04-10",
        paymentMethod: "credit_card",
        documentPath: "/documents/rechnung-2025-345.pdf",
        documentType: "application/pdf",
        createdAt: "2025-04-10T11:45:00Z",
        createdBy: "user1",
        lastModifiedAt: "2025-04-10T11:45:00Z",
        lastModifiedBy: "user1",
        gobdStatus: "yellow",
        integrationId: "int-12346"
      },
      {
        id: "3",
        documentDate: "2025-04-05",
        supplier: "IT Solutions AG",
        itemDescription: "Adobe Creative Cloud Lizenz (Jahresabo)",
        quantity: 1,
        unit: "Stück",
        netAmount: 588.24,
        vatAmount: 111.76,
        vatRate: 19,
        accountNumber: "4980",
        costCenter: "4000",
        status: "exported",
        invoiceNumber: "INV-5432",
        invoiceDate: "2025-04-05",
        paymentMethod: "bank_transfer",
        paymentDate: "2025-04-06",
        documentPath: "/documents/rechnung-inv-5432.pdf",
        documentType: "application/pdf",
        createdAt: "2025-04-05T08:20:00Z",
        createdBy: "user2",
        lastModifiedAt: "2025-04-05T15:30:00Z",
        lastModifiedBy: "user2",
        reviewedAt: "2025-04-05T16:45:00Z",
        reviewedBy: "user3",
        gobdStatus: "green",
        integrationId: "int-12347"
      },
      {
        id: "4",
        documentDate: "2025-04-01",
        supplier: "Büroland",
        itemDescription: "Ergonomischer Bürostuhl",
        quantity: 1,
        unit: "Stück",
        netAmount: 420.17,
        vatAmount: 79.83,
        vatRate: 19,
        accountNumber: "0650",
        costCenter: "1000",
        assetId: "a12346",
        status: "approved",
        invoiceNumber: "BL-2025-442",
        invoiceDate: "2025-04-01",
        paymentMethod: "bank_transfer",
        paymentDate: "2025-04-08",
        documentPath: "/documents/rechnung-bl-2025-442.pdf",
        documentType: "application/pdf",
        createdAt: "2025-04-02T10:15:00Z",
        createdBy: "user1",
        lastModifiedAt: "2025-04-02T13:20:00Z",
        lastModifiedBy: "user1",
        reviewedAt: "2025-04-03T09:10:00Z",
        reviewedBy: "user3",
        gobdStatus: "green",
        integrationId: "int-12348"
      },
      {
        id: "5",
        documentDate: "2025-03-28",
        supplier: "Catering Schmitt",
        itemDescription: "Catering für Teammeetiing",
        quantity: 1,
        unit: "Pauschal",
        netAmount: 158.88,
        vatAmount: 11.12,
        vatRate: 7,
        accountNumber: "4650",
        costCenter: "3000",
        status: "draft",
        invoiceNumber: "CS-3245",
        invoiceDate: "2025-03-28",
        paymentMethod: "cash",
        documentPath: "/documents/rechnung-cs-3245.pdf",
        documentType: "application/pdf",
        createdAt: "2025-03-28T16:40:00Z",
        createdBy: "user2",
        lastModifiedAt: "2025-03-28T16:40:00Z",
        lastModifiedBy: "user2",
        gobdStatus: "red",
        integrationId: "int-12349",
        notes: "Rechnung ist unvollständig, es fehlt die USt-ID des Lieferanten"
      }
    ];

    return mockItems;
  }, []);

  return {
    getMockPurchaseItems
  };
}
