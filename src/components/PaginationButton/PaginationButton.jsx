import './PaginationButton.css';

export default function PaginationButton({ pageNumber, handlePageClick, currentPage }) {
  function handleClick() {
    handlePageClick(pageNumber);
  }

  return (
    <button
      onClick={handleClick}
      className="pagination-button"
      style={{
        color: pageNumber === currentPage ? '#ffffff' : '#61BB61',
        backgroundColor: pageNumber === currentPage ? '#61BB61' : '#ffffff',
      }}
    >
      {pageNumber}
    </button>
  );
}
