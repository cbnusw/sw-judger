export const RenderPaginationButtons = (
  currentPage: number,
  totalPages: number,
  handlePagination: (page: number) => void,
  isSmallScreen: boolean,
) => {
  let buttons: JSX.Element[] = [];
  let startPage, endPage;

  // 최소한 1 페이지를 가정
  if (totalPages <= 1) {
    totalPages = 1;
  }

  const buttonsToShow = isSmallScreen ? 3 : 5;
  const offset = isSmallScreen ? 0 : 2;

  if (totalPages <= buttonsToShow) {
    // 총 페이지가 표시할 버튼 수 이하인 경우 모든 페이지 버튼 표시
    startPage = 1;
    endPage = totalPages;
  } else {
    // 현재 페이지가 시작부분에 있는 경우
    if (currentPage < buttonsToShow) {
      startPage = 1;
      endPage = buttonsToShow;
    }
    // 현재 페이지가 마지막부분에 있는 경우
    else if (currentPage > totalPages - (buttonsToShow - 1)) {
      startPage = totalPages - (buttonsToShow - 1);
      endPage = totalPages;
    }
    // 중간에 있는 경우 현재 페이지를 중심으로 offset만큼 양쪽으로 표시
    else {
      startPage = currentPage - offset;
      endPage = currentPage + offset;
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
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
          >
            <defs>
              <path id="icn-navigation-more-a" d="M0 0h24v24H0z"></path>
            </defs>
            <g fill="#333d4b">
              <path d="M4.8 10.4c.9 0 1.6.7 1.6 1.6 0 .4-.2.8-.5 1.1-.3.3-.7.5-1.1.5-.9 0-1.6-.7-1.6-1.6s.7-1.6 1.6-1.6z"></path>
              <circle cx="19.2" cy="12" r="1.6"></circle>
              <circle cx="12" cy="12" r="1.6"></circle>
            </g>
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
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
          >
            <defs>
              <path id="icn-navigation-more-a" d="M0 0h24v24H0z"></path>
            </defs>
            <g fill="#333d4b">
              <path d="M4.8 10.4c.9 0 1.6.7 1.6 1.6 0 .4-.2.8-.5 1.1-.3.3-.7.5-1.1.5-.9 0-1.6-.7-1.6-1.6s.7-1.6 1.6-1.6z"></path>
              <circle cx="19.2" cy="12" r="1.6"></circle>
              <circle cx="12" cy="12" r="1.6"></circle>
            </g>
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
