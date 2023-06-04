import React from "react";
import ReactPaginate from "react-paginate";

export default function Pagination({ page, perPage, total, onChange }) {
  const pageCount = Math.floor(total / perPage) + 1;
  return (
    <ReactPaginate
      previousLabel={"‹"}
      nextLabel={"›"}
      breakLabel={"..."}
      breakClassName={"break-me"}
      pageCount={pageCount}
      forcePage={page - 1}
      marginPagesDisplayed={1}
      pageRangeDisplayed={3}
      onPageChange={(p) => onChange(p.selected + 1)}
      containerClassName="pagination float-right"
      breakClassName="page-item mx-1"
      breakLabel={<a className="page-link">...</a>}
      pageClassName="page-item mx-1"
      previousClassName="page-item mx-1"
      nextClassName="page-item mx-1"
      pageLinkClassName="page-link"
      previousLinkClassName="page-link"
      nextLinkClassName="page-link"
      activeClassName="active"
    />
  );
}
