'use client';

import React, { useEffect } from 'react';
import UsersExamSubmitListItem from './UsersExamSubmitListItem';
import EmptyUsersExamSubmitListItem from './EmptyUsersExamSubmitListItem';
import axiosInstance from '@/utils/axiosInstance';
import useDebounce from '@/hooks/useDebounce';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ExamSubmitInfo } from '@/types/exam';
import PaginationNav from '@/app/components/PaginationNav';

// 시험 코드 제출 목록 조회 API
const fetchExamSubmitsInfo = ({ queryKey }: any) => {
  const eid = queryKey[1];
  const page = queryKey[2];
  const searchQuery = queryKey[3];
  return axiosInstance.get(
    `${
      process.env.NEXT_PUBLIC_API_VERSION
    }/submit/assignment/${eid}?page=${page}&limit=10&sort=-createdAt&q=user,language=${encodeURIComponent(
      searchQuery || '',
    )}`,
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
      router.replace(`/exams/${eid}/submits?${newQuery.toString()}`);
    }
  }, [params, router, eid]);

  // 검색어 변경 시 URL 업데이트
  useEffect(() => {
    if (debouncedSearchQuery !== query) {
      const newQuery = new URLSearchParams(params.toString());
      newQuery.set('page', '1'); // 검색어 변경 시 페이지를 1로 초기화
      newQuery.set('q', encodeURIComponent(debouncedSearchQuery));
      router.replace(`/exams/${eid}/submits?${newQuery.toString()}`);
    }
  }, [debouncedSearchQuery, query, params, router, eid]);

  const { isPending, data } = useQuery({
    queryKey: ['examSubmitsInfo', eid, page, debouncedSearchQuery],
    queryFn: fetchExamSubmitsInfo,
  });

  const resData = data?.data.data;
  const contestSubmitsInfo: ExamSubmitInfo[] = resData?.documents;
  const startItemNum = (resData?.page - 1) * 10 + 1;
  const endItemNum = startItemNum - 1 + resData?.documents.length;
  const totalPages = Math.ceil(resData?.total / 10);

  // 페이지네이션 핸들링
  const handlePagination = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const newQuery = new URLSearchParams(params.toString());
    newQuery.set('page', String(newPage));
    router.push(`/exams/${eid}/submits?${newQuery.toString()}`, {
      scroll: false,
    });
  };

  if (isPending) return null;

  return (
    <div className="mx-auto w-full">
      <div className="relative overflow-hidden rounded-sm">
        <div className="overflow-x-auto">
          <table className="w-[60rem] 3xs:w-full text-sm text-left text-gray-500">
            <thead className="border-y-[1.25px] border-[#d1d6db] text-xs uppercase bg-[#f2f4f6] text-center">
              <tr className="h-[2rem]">
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] w-16 px-4 py-2 hover:bg-[#e6e8eb]"
                >
                  번호
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] px-4 py-2 hover:bg-[#e6e8eb]"
                >
                  학번
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] px-4 py-2 hover:bg-[#e6e8eb]"
                >
                  이름
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] px-4 py-2 hover:bg-[#e6e8eb]"
                >
                  문제명
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] px-4 py-2 hover:bg-[#e6e8eb]"
                >
                  결과
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] px-4 py-2 hover:bg-[#e6e8eb]"
                >
                  메모리
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] px-4 py-2 hover:bg-[#e6e8eb]"
                >
                  시간
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] px-4 py-2 hover:bg-[#e6e8eb]"
                >
                  언어
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] px-4 py-2 hover:bg-[#e6e8eb]"
                >
                  제출 시간
                </th>
              </tr>
            </thead>
            <tbody>
              {contestSubmitsInfo?.length === 0 ? (
                <EmptyUsersExamSubmitListItem />
              ) : (
                <>
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
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PaginationNav
        page={page}
        totalPages={totalPages}
        handlePagination={handlePagination}
      />
    </div>
  );
}
