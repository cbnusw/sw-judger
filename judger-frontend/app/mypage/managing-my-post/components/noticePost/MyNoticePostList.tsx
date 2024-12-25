'use client';

import React, { useEffect, useState } from 'react';
import EmptyMyNoticePostListItem from './EmptyMyNoticePostListItem';
import MyNoticePostListItem from './MyNoticePostListItem';
import axiosInstance from '@/utils/axiosInstance';
import { NoticeInfo } from '@/types/notice';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import MyNoticePostListLoadingSkeleton from './MyNoticePostListLoadingSkeleton';
import PaginationNav from '@/app/components/PaginationNav';

// 본인이 작성한 공지사항 게시글 목록 반환 API (10개 게시글 단위로)
const fetchMyNotices = async ({ queryKey }: any) => {
  const page = queryKey[1];
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/notice/me?page=${page}&limit=10&sort=-createdAt`,
  );
  return response.data;
};

export default function MyNoticePostList() {
  const params = useSearchParams();

  const page = Number(params?.get('page')) || 1;

  const { isPending, data } = useQuery({
    queryKey: ['myNotices', page],
    queryFn: fetchMyNotices,
  });

  const router = useRouter();

  const resData = data?.data;
  const startItemNum = (resData?.page - 1) * 10 + 1;
  const endItemNum = startItemNum - 1 + resData?.documents.length;
  const totalPages = Math.ceil(resData?.total / 10);

  const handlePagination = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    router.push(`/mypage/managing-my-post?page=${newPage}`, { scroll: false });
  };

  if (isPending) return <MyNoticePostListLoadingSkeleton />;

  return (
    <div className="mx-auto mt-6 w-full">
      <div className="relative overflow-hidden rounded-sm">
        <div className="overflow-x-auto">
          <table className="w-[60rem] 3xs:w-full text-sm text-left text-gray-500">
            <thead className="border-y-[1.25px] border-[#d1d6db] text-xs uppercase bg-[#f2f4f6] text-center">
              <tr>
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
                  제목
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] px-4 py-2 hover:bg-[#e6e8eb]"
                >
                  작성일
                </th>
              </tr>
            </thead>
            <tbody>
              {resData?.documents.length === 0 ? (
                <EmptyMyNoticePostListItem />
              ) : (
                <>
                  {resData?.documents.map(
                    (noticeInfo: NoticeInfo, index: number) => (
                      <MyNoticePostListItem
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
