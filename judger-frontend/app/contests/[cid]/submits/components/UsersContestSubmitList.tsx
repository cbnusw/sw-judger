'use client';

import React, { useEffect } from 'react';
import UsersContestSubmitListItem from './UsersContestSubmitListItem';
import EmptyUsersContestSubmitListItem from './EmptyUsersContestSubmitListItem';
import { useQuery } from '@tanstack/react-query';
import { ContestSubmitInfo } from '@/types/contest';
import axiosInstance from '@/utils/axiosInstance';
import { useRouter, useSearchParams } from 'next/navigation';
import { RenderPaginationButtons } from '@/app/components/RenderPaginationButtons';
import useDebounce from '@/hooks/useDebounce';

// 대회 코드 제출 목록 조회 API
const fetchContestSubmitsInfo = ({ queryKey }: any) => {
  const cid = queryKey[1];
  const page = queryKey[2];
  const searchQuery = queryKey[3];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/submit/contest/${cid}?page=${page}&limit=10&sort=-createdAt&q=user,language=${searchQuery}`,
  );
};

interface UsersContestSubmitListProps {
  cid: string;
  searchQuery: string;
}

export default function UsersContestSubmitList({
  cid,
  searchQuery,
}: UsersContestSubmitListProps) {
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const params = useSearchParams();
  const router = useRouter();

  // 현재 URL의 파라미터 값 가져오기
  const page = Number(params?.get('page')) || 1;
  const query = decodeURIComponent(params?.get('q') || '');

  // 초기 로드 및 URL 설정
  useEffect(() => {
    if (!params?.has('page') || !params?.has('q')) {
      const newQuery = new URLSearchParams(params.toString());
      newQuery.set('page', '1');
      newQuery.set('q', '');
      router.replace(`/contests/${cid}/submits?${newQuery.toString()}`);
    }
  }, [params, router, cid]);

  // 검색어 변경 시 URL 업데이트
  useEffect(() => {
    if (debouncedSearchQuery !== query) {
      const newQuery = new URLSearchParams(params.toString());
      newQuery.set('page', '1'); // 검색어 변경 시 페이지를 1로 초기화
      newQuery.set('q', encodeURIComponent(debouncedSearchQuery));
      router.replace(`/contests/${cid}/submits?${newQuery.toString()}`);
    }
  }, [debouncedSearchQuery, query, params, router, cid]);

  const { isPending, data } = useQuery({
    queryKey: ['contestSubmitsInfo', cid, page, debouncedSearchQuery],
    queryFn: fetchContestSubmitsInfo,
    retry: 0,
  });

  const resData = data?.data.data;
  const contestSubmitsInfo: ContestSubmitInfo[] = resData?.documents;
  const startItemNum = (resData?.page - 1) * 10 + 1;
  const endItemNum = startItemNum - 1 + resData?.documents.length;
  const totalPages = Math.ceil(resData?.total / 10);

  // 페이지네이션 핸들링
  const handlePagination = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const newQuery = new URLSearchParams(params.toString());
    newQuery.set('page', String(newPage));
    router.push(`/contests/${cid}/submits?${newQuery.toString()}`);
  };

  if (isPending) return null;

  return (
    <div className="mx-auto w-full">
      <div className="relative overflow-hidden rounded-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 ">
            <thead className="border-y-[1.25px] border-[#d1d6db] text-xs uppercase bg-[#f2f4f6] text-center">
              <tr className="h-[2rem]">
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] w-16 px-4 py-2"
                >
                  번호
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] px-4 py-2"
                >
                  대학
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] px-4 py-2"
                >
                  학과(부)
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] px-4 py-2"
                >
                  학번
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] px-4 py-2"
                >
                  이름
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] px-4 py-2"
                >
                  문제명
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] px-4 py-2"
                >
                  결과
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] px-4 py-2"
                >
                  메모리
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] px-4 py-2"
                >
                  시간
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] px-4 py-2"
                >
                  언어
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] px-4 py-2"
                >
                  제출 시간
                </th>
              </tr>
            </thead>
            <tbody>
              {contestSubmitsInfo?.length === 0 ? (
                <EmptyUsersContestSubmitListItem />
              ) : (
                <>
                  {contestSubmitsInfo.map((contestSubmitInfo, idx) => (
                    <UsersContestSubmitListItem
                      key={idx}
                      contestSubmitInfo={contestSubmitInfo}
                      total={resData.total}
                      page={page}
                      cid={cid}
                      index={idx}
                    />
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <nav
        className="flex flex-col md:flex-row text-xs justify-between items-start md:items-center space-y-3 md:space-y-0 pl-1 mt-3"
        aria-label="Table navigation"
      >
        <span className="text-gray-500 ">
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
              className="flex items-center justify-center h-full py-1.5 px-[0.3rem] ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700  dark:hover:bg-gray-700 dark:hover:text-white"
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
              className="flex items-center justify-center h-full py-1.5 px-[0.3rem] leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700  dark:hover:bg-gray-700 dark:hover:text-white"
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
