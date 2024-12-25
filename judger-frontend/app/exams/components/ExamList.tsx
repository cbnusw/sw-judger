'use client';

import React, { useEffect } from 'react';
import ExamListItem from './ExamListItem';
import EmptyExamListItem from './EmptyExamListItem';
import axiosInstance from '@/utils/axiosInstance';
import useDebounce from '@/hooks/useDebounce';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ExamInfo } from '@/types/exam';
import ExamListLoadingSkeleton from './ExamListLoadingSkeleton';
import PaginationNav from '@/app/components/PaginationNav';

interface ExamListProps {
  searchQuery: string;
}

// 시험 목록 반환 API (10개 게시글 단위로)
const fetchExams = async ({ queryKey }: any) => {
  const page = queryKey[1];
  const searchQuery = encodeURIComponent(queryKey[2]);
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/assignment/?page=${page}&limit=10&sort=-createdAt&q=title,course,writer=${searchQuery}`,
  );
  return response.data;
};

export default function ExamList({ searchQuery }: ExamListProps) {
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
      router.replace(`/exams?${newQuery.toString()}`);
    }
  }, [params, router]);

  // 검색어 변경 시 URL 업데이트
  useEffect(() => {
    if (debouncedSearchQuery !== titleQuery) {
      const newQuery = new URLSearchParams(params.toString());
      newQuery.set('page', '1'); // 검색어 변경 시 페이지를 1로 초기화
      newQuery.set('title', encodeURIComponent(debouncedSearchQuery));
      router.replace(`/exams?${newQuery.toString()}`);
    }
  }, [debouncedSearchQuery, titleQuery, params, router]);

  const { isPending, data } = useQuery({
    queryKey: ['examList', page, titleQuery],
    queryFn: fetchExams,
  });

  const resData = data?.data;
  const startItemNum = (resData?.page - 1) * 10 + 1;
  const endItemNum = startItemNum - 1 + resData?.documents.length;
  const totalPages = Math.ceil(resData?.total / 10);

  const handlePagination = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const newQuery = new URLSearchParams(params.toString());
    newQuery.set('page', String(newPage));
    router.push(`/exams?${newQuery.toString()}`, { scroll: false });
  };

  if (isPending) return <ExamListLoadingSkeleton />;

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
                  className="font-medium text-start text-[#333d4b] px-4 py-2 hover:bg-[#e6e8eb]"
                >
                  시험명
                </th>
                <th
                  scope="col"
                  className="font-medium text-start text-[#333d4b] px-4 py-2 hover:bg-[#e6e8eb]"
                >
                  수업명
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] px-4 py-2 hover:bg-[#e6e8eb]"
                >
                  작성자
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] px-4 py-2 hover:bg-[#e6e8eb]"
                >
                  시험 시간
                </th>
              </tr>
            </thead>
            <tbody>
              {resData?.documents.length === 0 ? (
                <EmptyExamListItem />
              ) : (
                <>
                  {resData?.documents.map(
                    (examInfo: ExamInfo, index: number) => (
                      <ExamListItem
                        examInfo={examInfo}
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

      <PaginationNav
        page={page}
        totalPages={totalPages}
        handlePagination={handlePagination}
      />
    </div>
  );
}
