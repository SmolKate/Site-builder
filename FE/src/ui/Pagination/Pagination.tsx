import ReactPaginate from "react-paginate";
import type { FC } from "react";
import type { ISelectedPage } from "@/utils/types";
import {
  MARGIN_PAGES_DISPLAYED,
  PAGE_RANGE_DISPLAYED,
} from "@/utils/constants";
import "./styles.scss";

interface IPaginationProps {
  onPageChange: (selected: ISelectedPage) => void;
  pageCount: number;
  page: number;
}

const Pagination: FC<IPaginationProps> = ({
  onPageChange,
  pageCount,
  page,
}) => {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=">"
      onPageChange={onPageChange}
      pageRangeDisplayed={PAGE_RANGE_DISPLAYED}
      marginPagesDisplayed={MARGIN_PAGES_DISPLAYED}
      pageCount={pageCount}
      previousLabel="<"
      forcePage={page - 1}
      containerClassName="pagination-container"
      pageClassName="pagination-page"
      previousClassName="pagination-previous-page"
      nextClassName="pagination-next-page"
      activeClassName="pagination-active-page"
    />
  );
};

export default Pagination;
