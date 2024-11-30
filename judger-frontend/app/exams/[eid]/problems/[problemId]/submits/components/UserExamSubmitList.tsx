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
    retry: 0,
    refetchInterval: 1500,
  });

  const resData = data?.data.data;
  const personalUserExamSubmitsInfo: ExamSubmitInfo[] = resData?.documents;

  if (isPending) return null;

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
