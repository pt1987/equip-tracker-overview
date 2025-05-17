
import { memo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingTable = memo(() => (
  <div>
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Belegdatum</TableHead>
            <TableHead>Lieferant</TableHead>
            <TableHead>Artikel-/Güterbezeichnung</TableHead>
            <TableHead className="text-right">Menge</TableHead>
            <TableHead>Einheit</TableHead>
            <TableHead className="text-right">Nettobetrag €</TableHead>
            <TableHead className="text-right">MwSt €</TableHead>
            <TableHead className="text-right">MwSt-Satz %</TableHead>
            <TableHead>Sachkonto</TableHead>
            <TableHead>Kostenstelle</TableHead>
            <TableHead>Asset-ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>GoBD</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array(5).fill(0).map((_, i) => (
            <TableRow key={i}>
              {Array(14).fill(0).map((_, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
));

LoadingTable.displayName = "LoadingTable";

export default LoadingTable;
