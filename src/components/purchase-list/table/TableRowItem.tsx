
import { memo } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { PurchaseItem } from "@/lib/purchase-list-types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { StatusBadge, GoBDStatusBadge } from "./StatusBadges";

interface TableRowItemProps {
  item: PurchaseItem;
  onViewDetails: (item: PurchaseItem) => void;
}

const TableRowItem = memo(({ item, onViewDetails }: TableRowItemProps) => (
  <TableRow>
    <TableCell>{formatDate(item.documentDate)}</TableCell>
    <TableCell>{item.supplier}</TableCell>
    <TableCell className="max-w-[200px] truncate" title={item.itemDescription}>
      {item.itemDescription}
    </TableCell>
    <TableCell className="text-right">{item.quantity}</TableCell>
    <TableCell>{item.unit}</TableCell>
    <TableCell className="text-right">{formatCurrency(item.netAmount)}</TableCell>
    <TableCell className="text-right">{formatCurrency(item.vatAmount)}</TableCell>
    <TableCell className="text-right">{item.vatRate}%</TableCell>
    <TableCell>{item.accountNumber}</TableCell>
    <TableCell>{item.costCenter}</TableCell>
    <TableCell>
      {item.assetId ? (
        <a 
          href={`/asset/${item.assetId}`} 
          className="text-primary hover:underline"
        >
          {item.assetId}
        </a>
      ) : (
        "-"
      )}
    </TableCell>
    <TableCell><StatusBadge status={item.status} /></TableCell>
    <TableCell><GoBDStatusBadge status={item.gobdStatus} /></TableCell>
    <TableCell>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onViewDetails(item)}
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">Details anzeigen</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Details anzeigen</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TableCell>
  </TableRow>
));

TableRowItem.displayName = "TableRowItem";

export default TableRowItem;
