import PaginationButton from '../PaginationButton/PaginationButton';
import './PaginationBar.css';

export default function PaginationBar({ pageNumbers, handlePageClick, currentPage }) {
  return (
    <div className="pagination-bar">
      {pageNumbers.map((pageNumber, index) => {
        return (
          <PaginationButton
            key={index}
            pageNumber={pageNumber}
            handlePageClick={handlePageClick}
            currentPage={currentPage}
          />
        );
      })}
    </div>
  );
}
