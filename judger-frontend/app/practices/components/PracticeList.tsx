'use client';

import React, { useEffect } from 'react';
import EmptyPracticeListItem from './EmptyPracticeListItem';
import axiosInstance from '@/utils/axiosInstance';
import useDebounce from '@/hooks/useDebounce';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import PracticeListItem from './PracticeListItem';
import { ProblemInfo } from '@/types/problem';
import PracticeListLoadingSkeleton from './PracticeListLoadingSkeleton';
import PaginationNav from '@/app/components/PaginationNav';

interface PracticeListProps {
  searchQuery: string;
}

// 연습문제 목록 반환 API (10개 게시글 단위로)
const fetchPractices = async ({ queryKey }: any) => {
  const page = queryKey[1];
  const searchQuery = encodeURIComponent(queryKey[2]);
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/practice/?page=${page}&limit=10&sort=-createdAt&q=title,writer=${searchQuery}`,
  );
  return response.data;
};

export default function PracticeList({ searchQuery }: PracticeListProps) {
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
      router.replace(`/practices?${newQuery.toString()}`);
    }
  }, [params, router]);

  // 검색어 변경 시 URL 업데이트
  useEffect(() => {
    if (debouncedSearchQuery !== titleQuery) {
      const newQuery = new URLSearchParams(params.toString());
      newQuery.set('page', '1'); // 검색어 변경 시 페이지를 1로 초기화
      newQuery.set('title', encodeURIComponent(debouncedSearchQuery));
      router.replace(`/practices?${newQuery.toString()}`);
    }
  }, [debouncedSearchQuery, titleQuery, params, router]);

  const { isPending, data } = useQuery({
    queryKey: ['practiceList', page, titleQuery],
    queryFn: fetchPractices,
  });

  const resData = data?.data;
  const startItemNum = (resData?.page - 1) * 10 + 1;
  const endItemNum = startItemNum - 1 + resData?.documents.length;
  const totalPages = Math.ceil(resData?.total / 10);

  const handlePagination = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const newQuery = new URLSearchParams(params.toString());
    newQuery.set('page', String(newPage));
    router.push(`/practices?${newQuery.toString()}`, { scroll: false });
  };

  if (isPending) return <PracticeListLoadingSkeleton />;

  return (
    <div className="mx-auto w-full">
      <div className="relative overflow-hidden rounded-sm">
        <div className="overflow-x-auto">
          {resData?.documents.length === 0 ? (
            <EmptyPracticeListItem />
          ) : (
            <>
              <div className="flex flex-col gap-4">
                {resData?.documents.map(
                  (practiceInfo: ProblemInfo, index: number) => (
                    <PracticeListItem
                      practiceInfo={practiceInfo}
                      total={resData.total}
                      page={page}
                      index={index}
                      key={index}
                    />
                  ),
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
