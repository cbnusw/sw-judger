'use client';

import React, { useEffect, useState } from 'react';
import UserExamSubmitListItem from './UserExamSubmitListItem';
import EmptyUserExamSubmitListItem from './EmptyUserExamSubmitListItem';
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { ExamSubmitInfo } from '@/types/exam';

// 사용자의 코드 제출 정보 목록 정보 조회 API
const fetchPersonalUserExamSubmitsInfo = ({ queryKey }: any) => {
  const problemId = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/submit/problem/${problemId}/me`,
  );
};

interface ExamSubmitListProps {
  eid: string;
  problemId: string;
}

export default function UserExamSubmitList({
  eid,
  problemId,
}: ExamSubmitListProps) {
  const { isPending, data } = useQuery({
    queryKey: ['personalUserExamSubmitsInfo', problemId],
    queryFn: fetchPersonalUserExamSubmitsInfo,
    refetchInterval: 1000,
  });

  const resData = data?.data.data;
  const personalUserExamSubmitsInfo: ExamSubmitInfo[] = resData?.documents;

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
              {personalUserExamSubmitsInfo?.length === 0 ? (
                <EmptyUserExamSubmitListItem />
              ) : (
                <>
                  {personalUserExamSubmitsInfo.map(
                    (personalUserExamSubmitInfo, idx) => (
                      <UserExamSubmitListItem
                        key={idx}
                        personalUserExamSubmitInfo={personalUserExamSubmitInfo}
                        total={resData.total}
                        eid={eid}
                        problemId={problemId}
                        index={idx}
                      />
                    ),
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
