'use client';

import React from 'react';
import { RenderPaginationButtons } from '@/app/components/RenderPaginationButtons';

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
  return (
    <nav
      className="flex flex-col md:flex-row text-xs justify-between items-start md:items-center space-y-3 md:space-y-0 pl-1 mt-5 p-1"
      aria-label="Table navigation"
    >
      <ul className="flex gap-x-[0.35rem]">
        <li>
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
              width={25}
              height={25}
              viewBox="0 0 24 24"
            >
              <path
                d="M14.3 17.4c-.2 0-.5-.1-.6-.3l-4.5-4.5c-.4-.4-.4-.9 0-1.3l4.5-4.5c.4-.4.9-.4 1.3 0s.4.9 0 1.3L11 12l3.9 3.9c.4.4.4.9 0 1.3-.2.1-.4.2-.6.2z"
                fill="#a8b2bc"
              ></path>
            </svg>
          </button>
        </li>
        {RenderPaginationButtons(page, totalPages, handlePagination)}
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
              enable-background="new 0 0 24 24"
              width={25}
              height={25}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                d="m9.8 6.5c-.2 0-.5.1-.6.3-.4.4-.4.9 0 1.3l3.8 3.8-3.9 3.9c-.4.4-.4.9 0 1.3s.9.4 1.3 0l4.5-4.5c-.4-.4-.4-.9 0-1.3l-4.5-4.5c-.2-.1-.4-.3-.6-.3"
                fill="#b0b8c1"
                fillRule="evenodd"
              ></path>
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
}
