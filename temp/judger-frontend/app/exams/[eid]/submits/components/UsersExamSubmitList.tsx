'use client';

import React, { useEffect, useState } from 'react';
import UsersExamSubmitListItem from './UsersExamSubmitListItem';
import EmptyUsersExamSubmitListItem from './EmptyUsersExamSubmitListItem';
import Loading from '@/app/loading';
import axiosInstance from '@/utils/axiosInstance';
import useDebounce from '@/hooks/useDebounce';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ExamSubmitInfo } from '@/types/exam';
import { RenderPaginationButtons } from '@/app/components/RenderPaginationButtons';

// 시험 코드 제출 목록 조회 API
const fetchExamSubmitsInfo = ({ queryKey }: any) => {
  const eid = queryKey[1];
  const page = queryKey[2];
  const searchQuery = queryKey[3];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/submit/assignment/${eid}?page=${page}&limit=10&sort=-createdAt&q=user,language=${searchQuery}`,
  );
};

interface UsersExamSubmitListProps {
  eid: string;
  searchQuery: string;
}

export default function UsersExamSubmitList({
  eid,
  searchQuery,
}: UsersExamSubmitListProps) {
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const params = useSearchParams();

  const page = Number(params?.get('page')) || 1;

  const { isPending, data } = useQuery({
    queryKey: ['contestSubmitsInfo', eid, page, debouncedSearchQuery],
    queryFn: fetchExamSubmitsInfo,
    retry: 0,
  });

  const router = useRouter();

  const resData = data?.data.data;
  const contestSubmitsInfo: ExamSubmitInfo[] = resData?.documents;
  const startItemNum = (resData?.page - 1) * 10 + 1;
  const endItemNum = startItemNum - 1 + resData?.documents.length;
  const totalPages = Math.ceil(resData?.total / 10);

  const handlePagination = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    router.push(`/exams/${eid}/submits?page=${newPage}`);
  };

  useEffect(() => {
    // page가 유효한 양의 정수가 아닌 경우, ?page=1로 리다이렉트
    if (!params?.has('page') || !Number.isInteger(page) || page < 1) {
      router.replace(`exams/${eid}/submits?page=1`);
    }
  }, [page, params, router, eid]);

  if (isPending) return <Loading />;

  return (
    <div className="mx-auto w-full">
      <div className="border dark:bg-gray-800 relative overflow-hidden rounded-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 text-center">
              <tr>
                <th scope="col" className="w-16 px-4 py-2">
                  번호
                </th>
                <th scope="col" className="px-4 py-2">
                  학번
                </th>
                <th scope="col" className="px-4 py-2">
                  이름
                </th>
                <th scope="col" className="px-4 py-2">
                  문제명
                </th>
                <th scope="col" className="px-4 py-2">
                  결과
                </th>
                <th scope="col" className="px-4 py-2">
                  메모리
                </th>
                <th scope="col" className="px-4 py-2">
                  시간
                </th>
                <th scope="col" className="px-4 py-2">
                  언어
                </th>
                <th scope="col" className="px-4 py-2">
                  제출 시간
                </th>
              </tr>
            </thead>
            <tbody>
              {contestSubmitsInfo?.length === 0 && (
                <EmptyUsersExamSubmitListItem />
              )}
              {contestSubmitsInfo.map((examSubmitInfo, idx) => (
                <UsersExamSubmitListItem
                  key={idx}
                  examSubmitInfo={examSubmitInfo}
                  total={resData.total}
                  page={page}
                  eid={eid}
                  index={idx}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <nav
        className="flex flex-col md:flex-row text-xs justify-between items-start md:items-center space-y-3 md:space-y-0 pl-1 mt-3"
        aria-label="Table navigation"
      >
        <span className="text-gray-500 dark:text-gray-400">
          <span className="text-gray-500 dark:text-white">
            {startItemNum} - {endItemNum}
          </span>{' '}
          of{' '}
          <span className="text-gray-500 dark:text-white">{resData.total}</span>
        </span>
        <ul className="inline-flex items-stretch -space-x-px">
          <li>
            <button
              onClick={() => handlePagination(Number(page) - 1)}
              className="flex items-center justify-center h-full py-1.5 px-[0.3rem] ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Previous</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
          {RenderPaginationButtons(page, totalPages, handlePagination)}
          <li>
            <button
              onClick={() => handlePagination(Number(page) + 1)}
              className="flex items-center justify-center h-full py-1.5 px-[0.3rem] leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Next</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
