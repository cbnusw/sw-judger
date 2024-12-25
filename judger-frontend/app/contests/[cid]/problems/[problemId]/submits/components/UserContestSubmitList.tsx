'use client';

import UserContestSubmitListItem from './UserContestSubmitListItem';
import EmptyUserContestSubmitListItem from './EmptyUserContestSubmitListItem';
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
    refetchInterval: 1000,
  });

  const resData = data?.data.data;
  const personalUserContestSubmitsInfo: ContestSubmitInfo[] =
    resData?.documents;

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
              {personalUserContestSubmitsInfo?.length === 0 ? (
                <EmptyUserContestSubmitListItem />
              ) : (
                <>
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
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
