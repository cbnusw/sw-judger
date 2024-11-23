'use client';

import UserPracticeSubmitListItem from './UserPracticeSubmitListItem';
import EmptyUserPracticeSubmitListItem from './EmptyUserPracticeSubmitListItem';
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { PracticeSubmitInfo } from '@/types/practice';

// 사용자의 코드 제출 정보 목록 정보 조회 API
const fetchPersonalUserPracticeSubmitsInfo = ({ queryKey }: any) => {
  const pid = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/practice/${pid}/my-submits`,
  );
};

interface PracticeSubmitListProps {
  pid: string;
}

export default function UserPracticeSubmitList({
  pid,
}: PracticeSubmitListProps) {
  const { isPending, data } = useQuery({
    queryKey: ['personalUserPracticeSubmitsInfo', pid],
    queryFn: fetchPersonalUserPracticeSubmitsInfo,
    retry: 0,
    refetchInterval: 1500,
  });

  const resData = data?.data.data;
  const personalUserPracticeSubmitsInfo: PracticeSubmitInfo[] = resData;

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
              {personalUserPracticeSubmitsInfo?.length === 0 ? (
                <EmptyUserPracticeSubmitListItem />
              ) : (
                <>
                  {personalUserPracticeSubmitsInfo.map(
                    (personalUserPracticeSubmitInfo, idx) => (
                      <UserPracticeSubmitListItem
                        key={idx}
                        personalUserPracticeSubmitInfo={
                          personalUserPracticeSubmitInfo
                        }
                        total={resData.length}
                        pid={pid}
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
