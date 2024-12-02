export const RenderPaginationButtons = (
  currentPage: number,
  totalPages: number,
  handlePagination: (page: number) => void,
) => {
  let buttons: JSX.Element[] = [];
  let startPage, endPage;

  // totalPages가 0인 경우에도 최소한 1 페이지를 가정
  if (totalPages <= 1) {
    totalPages = 1;
  }

  if (totalPages <= 3) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= 2) {
      startPage = 1;
      endPage = 3;
    } else if (currentPage >= totalPages - 1) {
      startPage = totalPages - 2;
      endPage = totalPages;
    } else {
      startPage = currentPage - 1;
      endPage = currentPage + 1;
    }
  }

  if (startPage > 1) {
    buttons.push(
      <li key="first-ellipsis">
        <button
          onClick={() => handlePagination(1)}
          className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-400 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700  dark:hover:bg-gray-700 dark:hover:text-white"
        >
          ...
        </button>
      </li>,
    );
  }

  for (let i = startPage; i <= endPage; i++) {
    buttons.push(
      <li key={i}>
        <button
          onClick={() => handlePagination(i)}
          className={`text-sm py-2 px-3 leading-tight ${
            currentPage === i
              ? 'text-primary-600 bg-primary-50 border border-primary-300'
              : 'text-gray-400 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
          } dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white`}
        >
          {i}
        </button>
      </li>,
    );
  }

  if (endPage < totalPages) {
    buttons.push(
      <li key="last-ellipsis">
        <button
          onClick={() => handlePagination(totalPages)}
          className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-400 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700  dark:hover:bg-gray-700 dark:hover:text-white"
        >
          ...
        </button>
      </li>,
    );
  }

  return buttons; // 항상 buttons 배열을 반환합니다.
};
