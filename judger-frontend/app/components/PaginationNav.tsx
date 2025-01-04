import React from 'react';
import { useEffect, useState } from 'react';
import { RenderPaginationButtons } from './RenderPaginationButtons';

interface PaginationNavProps {
  page: number;
  totalPages: number;
  handlePagination: (newPage: number) => void;
}

export default function PaginationNav({
  page,
  totalPages,
  handlePagination,
}: PaginationNavProps) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Check screen width
  useEffect(() => {
    const checkScreenWidth = () => {
      setIsSmallScreen(window.innerWidth < 570);
    };

    checkScreenWidth(); // Initial check
    window.addEventListener('resize', checkScreenWidth);

    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  return (
    <nav
      className="flex text-xs justify-between space-y-3 pl-1 mt-5 p-1"
      aria-label="Table navigation"
    >
      <ul className="flex gap-x-[0.35rem]">
        <div className="flex gap-x-[0.35rem] items-center">
          <li className="order-2 3xs:order-1">
            <button
              onClick={() => handlePagination(Number(page) - 1)}
              className={`pagination-arrow-btn flex justify-center items-center ${
                page <= 1
                  ? 'pagination-arrow-btn-disabled'
                  : 'pagination-arrow-btn-enabled'
              }`}
              disabled={page <= 1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                className="scale-125"
              >
                <path
                  d="M14.3 17.4c-.2 0-.5-.1-.6-.3l-4.5-4.5c-.4-.4-.4-.9 0-1.3l4.5-4.5c.4-.4.9-.4 1.3 0s.4.9 0 1.3L11 12l3.9 3.9c.4.4.4.9 0 1.3-.2.1-.4.2-.6.2z"
                  fill="#abb2b9"
                ></path>
              </svg>
            </button>
          </li>
          <div className="flex items-center gap-x-[0.35rem] order-1 3xs:order-2">
            {RenderPaginationButtons(
              page,
              totalPages,
              handlePagination,
              isSmallScreen,
            )}
          </div>
        </div>
        <li>
          <button
            onClick={() => handlePagination(Number(page) + 1)}
            className={`pagination-arrow-btn flex justify-center items-center ${
              page >= totalPages
                ? 'pagination-arrow-btn-disabled'
                : 'pagination-arrow-btn-enabled'
            }`}
            disabled={page >= totalPages}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              className="scale-125"
            >
              <path
                d="m9.8 6.5c-.2 0-.5.1-.6.3-.4.4-.4.9 0 1.3l3.8 3.8-3.9 3.9c-.4.4-.4.9 0 1.3s.9.4 1.3 0l4.5-4.5c-.4-.4-.4-.9 0-1.3l-4.5-4.5c-.2-.1-.4-.3-.6-.3"
                fill="#abb2b9"
              ></path>
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
}
