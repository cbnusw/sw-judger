'use client';

import React, { useEffect } from 'react';
import EmptyMyContestPostListItem from './EmptyMyContestPostListItem';
import MyContestPostListItem from './MyContestPostListItem';
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { ContestInfo } from '@/types/contest';
import MyContestPostListLoadingSkeleton from './MyContestPostListLoadingSkeleton';
import PaginationNav from '@/app/components/PaginationNav';

// 본인이 작성한 대회 게시글 목록 반환 API (10개 게시글 단위로)
const fetchMyContests = async ({ queryKey }: any) => {
  const page = queryKey[1];
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/contest/me?page=${page}&limit=10&sort=-createdAt`,
  );
  return response.data;
};

export default function MyContestPostList() {
  const params = useSearchParams();

  const page = Number(params?.get('page')) || 1;

  const { isPending, data } = useQuery({
    queryKey: ['myContests', page],
    queryFn: fetchMyContests,
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

  useEffect(() => {
    // page가 유효한 양의 정수가 아닌 경우, ?page=1로 리다이렉트
    if (!params?.has('page') || !Number.isInteger(page) || page < 1) {
      router.replace('/mypage/managing-my-post?page=1');
    }
  }, [page, params, router]);

  if (isPending) return <MyContestPostListLoadingSkeleton />;

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
                  대회명
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] px-4 py-2 hover:bg-[#e6e8eb]"
                >
                  신청기간
                </th>
                <th
                  scope="col"
                  className="font-medium text-[#333d4b] px-4 py-2 hover:bg-[#e6e8eb]"
                >
                  대회시간
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
                <EmptyMyContestPostListItem />
              ) : (
                <>
                  {resData?.documents.map(
                    (contestInfo: ContestInfo, index: number) => (
                      <MyContestPostListItem
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

      <PaginationNav
        page={page}
        totalPages={totalPages}
        handlePagination={handlePagination}
      />
    </div>
  );
}
