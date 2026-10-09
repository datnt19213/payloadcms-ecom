import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "../ui/paginations";

interface PaginationsProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Paginations: React.FC<PaginationsProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const renderPageLinks = () => {
    const pages = [];
    let ellipsisAddedBefore = false;
    let ellipsisAddedAfter = false;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        i === currentPage ||
        i === currentPage - 1 ||
        i === currentPage + 1
      ) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(i);
              }}
              className={currentPage === i ? "bg-gray-900 text-white" : ""}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (i < currentPage && !ellipsisAddedBefore) {
        pages.push(
          <PaginationItem key={`ellipsis-before`}>
            <PaginationEllipsis />
          </PaginationItem>
        );
        ellipsisAddedBefore = true;
      } else if (i > currentPage && !ellipsisAddedAfter) {
        pages.push(
          <PaginationItem key={`ellipsis-after`}>
            <PaginationEllipsis />
          </PaginationItem>
        );
        ellipsisAddedAfter = true;
      }
    }

    return pages;
  };

  return (
    <div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) {
                  onPageChange(currentPage - 1);
                }
              }}
            />
          </PaginationItem>
          {renderPageLinks()}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                  onPageChange(currentPage + 1);
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Paginations;
