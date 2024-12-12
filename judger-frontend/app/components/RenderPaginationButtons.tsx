export const RenderPaginationButtons = (
  currentPage: number,
  totalPages: number,
  handlePagination: (page: number) => void,
) => {
  let buttons: JSX.Element[] = [];
  let startPage, endPage;

  // 최소한 1 페이지를 가정
  if (totalPages <= 1) {
    totalPages = 1;
  }

  if (totalPages <= 7) {
    // 총 페이지가 7 이하인 경우 모든 페이지 버튼 표시
    startPage = 1;
    endPage = totalPages;
  } else {
    // 현재 페이지가 1~5인 경우 처음 7개 버튼 표시
    if (currentPage <= 5) {
      startPage = 1;
      endPage = 7;
    }
    // 현재 페이지가 마지막 5페이지 이내인 경우 마지막 7개 버튼 표시
    else if (currentPage >= totalPages - 4) {
      startPage = totalPages - 6;
      endPage = totalPages;
    }
    // 그 외의 경우 현재 페이지를 중심으로 -2, +2 버튼 표시 (5개)
    else {
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }
  }

  // 첫 번째 페이지 버튼 추가
  if (startPage > 1) {
    buttons.push(
      <li key="first-page">
        <button
          onClick={() => handlePagination(1)}
          className="pagination-number-btn pagination--number-btn-disabled"
        >
          1
        </button>
      </li>,
    );
    if (startPage > 2) {
      buttons.push(
        <li
          key="first-ellipsis"
          className="w-[36px] h-[36px] flex justify-center items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={25}
            height={25}
            viewBox="0 0 24 24"
          >
            <path
              fill="#B0B8C1"
              d="M5.23 14a2 2 0 11.001-4.001A2 2 0 015.23 14m6.771 0a2 2 0 110-4 2 2 0 010 4m6.77 0a2 2 0 11.001-4.001A2 2 0 0118.771 14"
              fillRule="evenodd"
            ></path>
          </svg>
        </li>,
      );
    }
  }

  // 페이지 번호 버튼 렌더링
  for (let i = startPage; i <= endPage; i++) {
    buttons.push(
      <li key={i}>
        <button
          onClick={() => handlePagination(i)}
          className={`${
            currentPage === i
              ? 'pagination-number-btn-enabled'
              : 'pagination-number-btn-disabled'
          } pagination-number-btn`}
        >
          {i}
        </button>
      </li>,
    );
  }

  // 마지막 페이지 버튼 추가
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      buttons.push(
        <li
          key="last-ellipsis"
          className="w-[36px] h-[36px] flex justify-center items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={25}
            height={25}
            viewBox="0 0 24 24"
          >
            <path
              fill="#B0B8C1"
              d="M5.23 14a2 2 0 11.001-4.001A2 2 0 015.23 14m6.771 0a2 2 0 110-4 2 2 0 010 4m6.77 0a2 2 0 11.001-4.001A2 2 0 0118.771 14"
              fillRule="evenodd"
            ></path>
          </svg>
        </li>,
      );
    }
    buttons.push(
      <li key="last-page">
        <button
          onClick={() => handlePagination(totalPages)}
          className="pagination-number-btn pagination-number-btn-disabled"
        >
          {totalPages}
        </button>
      </li>,
    );
  }

  return buttons;
};
