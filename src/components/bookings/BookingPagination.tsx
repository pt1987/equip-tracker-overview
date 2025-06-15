
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface BookingPaginationProps {
  currentPage: number;
  totalPages: number;
  totalBookings: number;
  bookingsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function BookingPagination({
  currentPage,
  totalPages,
  totalBookings,
  bookingsPerPage,
  onPageChange
}: BookingPaginationProps) {
  const startIndex = (currentPage - 1) * bookingsPerPage;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <>
      <div className="mt-4 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <PaginationItem key={page}>
                <PaginationLink 
                  isActive={currentPage === page} 
                  onClick={() => onPageChange(page)}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      
      {totalBookings > bookingsPerPage && (
        <div className="text-center text-sm text-muted-foreground mt-2">
          Zeige {Math.min(startIndex + 1, totalBookings)}-{Math.min(startIndex + bookingsPerPage, totalBookings)} von {totalBookings} Buchungen
        </div>
      )}
    </>
  );
}
