'use client';

import ContestListItem from './ContestListItem';
import EmptyContestListItem from './EmptyContestListItem';
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { ContestInfo } from '@/types/contest';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { RenderPaginationButtons } from '@/app/components/RenderPaginationButtons';
import useDebounce from '@/hooks/useDebounce';
import ContestListLoadingSkeleton from './ContestListLoadingSkeleton';

interface ContestListProps {
  searchQuery: string;
}

const fetchContests = async ({ queryKey }: any) => {
  const page = queryKey[1];
  const searchQuery = encodeURIComponent(queryKey[2] || '');
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/contest/?page=${page}&limit=10&sort=-createdAt&q=title=${searchQuery}`,
  );
  return response.data;
};

export default function ContestList({ searchQuery }: ContestListProps) {
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const params = useSearchParams();
  const router = useRouter();

  const page = Number(params?.get('page')) || 1;
  const titleQuery = decodeURIComponent(params?.get('title') || '');

  // 초기 로드 및 URL 설정
  useEffect(() => {
    if (!params?.has('page') || !params?.has('title')) {
      const newQuery = new URLSearchParams(params.toString());
      newQuery.set('page', '1');
      newQuery.set('title', '');
      router.replace(`/contests?${newQuery.toString()}`);
    }
  }, [params, router]);

  // 검색어 변경 시 URL 업데이트
  useEffect(() => {
    if (debouncedSearchQuery !== titleQuery) {
      const newQuery = new URLSearchParams(params.toString());
      newQuery.set('page', '1'); // 검색어 변경 시 페이지를 1로 초기화
      newQuery.set('title', encodeURIComponent(debouncedSearchQuery));
      router.replace(`/contests?${newQuery.toString()}`);
    }
  }, [debouncedSearchQuery, titleQuery, params, router]);

  const { isPending, data } = useQuery({
    queryKey: ['contestList', page, titleQuery],
    queryFn: fetchContests,
    retry: 0,
  });

  const resData = data?.data;
  const startItemNum = (resData?.page - 1) * 10 + 1;
  const endItemNum = startItemNum - 1 + resData?.documents.length;
  const totalPages = Math.ceil(resData?.total / 10);

  const handlePagination = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const newQuery = new URLSearchParams(params.toString());
    newQuery.set('page', String(newPage));
    router.push(`/contests?${newQuery.toString()}`);
  };

  if (isPending) return <ContestListLoadingSkeleton />;

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
                  대회명
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] px-4 py-2"
                >
                  신청기간
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] px-4 py-2"
                >
                  대회시간
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] w-24 px-4 py-2"
                >
                  작성일
                </th>
              </tr>
            </thead>
            <tbody>
              {resData?.documents.length === 0 ? (
                <EmptyContestListItem />
              ) : (
                <>
                  {resData?.documents.map(
                    (contestInfo: ContestInfo, index: number) => (
                      <ContestListItem
                        contestInfo={contestInfo}
                        total={resData.total}
                        page={page}
                        index={index}
                        key={index}
                      />
                    ),
                  )}
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
