'use client';

import React, { useEffect } from 'react';
import NoticeListItem from './NoticeListItem';
import EmptyNoticeListItem from './EmptyNoticeListItem';
import axiosInstance from '@/utils/axiosInstance';
import useDebounce from '@/hooks/useDebounce';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { NoticeInfo } from '@/types/notice';
import NoticeListLoadingSkeleton from './NoticeListLoadingSkeleton';
import PaginationNav from '@/app/components/PaginationNav';

interface NoticeListProps {
  searchQuery: string;
}

//  목록 반환 API (10개 게시글 단위로)
const fetchNotices = async ({ queryKey }: any) => {
  const page = queryKey[1];
  const searchQuery = queryKey[2];
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/notice/?page=${page}&limit=10&sort=-createdAt&q=title,writer=${searchQuery}`,
  );
  return response.data;
};

export default function NoticeList({ searchQuery }: NoticeListProps) {
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
      router.replace(`/notices?${newQuery.toString()}`);
    }
  }, [params, router]);

  // 검색어 변경 시 URL 업데이트
  useEffect(() => {
    if (debouncedSearchQuery !== titleQuery) {
      const newQuery = new URLSearchParams(params.toString());
      newQuery.set('page', '1'); // 검색어 변경 시 페이지를 1로 초기화
      newQuery.set('title', encodeURIComponent(debouncedSearchQuery));
      router.replace(`/notices?${newQuery.toString()}`);
    }
  }, [debouncedSearchQuery, titleQuery, params, router]);

  const { isPending, data } = useQuery({
    queryKey: ['noticeList', page, titleQuery],
    queryFn: fetchNotices,
  });

  const resData = data?.data;
  const startItemNum = (resData?.page - 1) * 10 + 1;
  const endItemNum = startItemNum - 1 + resData?.documents.length;
  const totalPages = Math.ceil(resData?.total / 10);

  const handlePagination = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const newQuery = new URLSearchParams(params.toString());
    newQuery.set('page', String(newPage));
    router.push(`/notices?${newQuery.toString()}`);
  };

  if (isPending) return <NoticeListLoadingSkeleton />;

  return (
    <div className="mx-auto w-full">
      <div className="relative overflow-hidden rounded-sm">
        <div className="overflow-x-auto">
          <div className="w-[60rem] 3xs:w-full text-sm text-left text-gray-500">
            {resData?.documents.length === 0 ? (
              <EmptyNoticeListItem />
            ) : (
              <>
                {resData?.documents.map(
                  (noticeInfo: NoticeInfo, index: number) => (
                    <NoticeListItem
                      noticeInfo={noticeInfo}
                      total={resData.total}
                      page={page}
                      index={index}
                      key={index}
                    />
                  ),
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <PaginationNav
          page={page}
          totalPages={totalPages}
          handlePagination={handlePagination}
        />
      </div>
    </div>
  );
}
