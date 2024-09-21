'use client';

import UserContestSubmitListItem from './UserContestSubmitListItem';
import EmptyUserContestSubmitListItem from './EmptyUserContestSubmitListItem';
import Loading from '@/app/loading';
import axiosInstance from '@/utils/axiosInstance';
import { ContestSubmitInfo } from '@/types/contest';
import { useQuery } from '@tanstack/react-query';

// 사용자의 코드 제출 정보 목록 정보 조회 API
const fetchPersonalUserContestSubmitsInfo = ({ queryKey }: any) => {
  const problemId = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/submit/problem/${problemId}/me`,
  );
};

interface ContestSubmitListProps {
  cid: string;
  problemId: string;
}

export default function UserContestSubmitList({
  cid,
  problemId,
}: ContestSubmitListProps) {
  const { isPending, data } = useQuery({
    queryKey: ['personalUserContestSubmitsInfo', problemId],
    queryFn: fetchPersonalUserContestSubmitsInfo,
    retry: 0,
    refetchInterval: 1500,
  });

  const resData = data?.data.data;
  const personalUserContestSubmitsInfo: ContestSubmitInfo[] =
    resData?.documents;

  if (isPending) return <Loading />;

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
              {personalUserContestSubmitsInfo?.length === 0 && (
                <EmptyUserContestSubmitListItem />
              )}
              {personalUserContestSubmitsInfo.map(
                (personalUserContestSubmitInfo, idx) => (
                  <UserContestSubmitListItem
                    key={idx}
                    personalUserContestSubmitInfo={
                      personalUserContestSubmitInfo
                    }
                    total={resData.total}
                    cid={cid}
                    problemId={problemId}
                    index={idx}
                  />
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
