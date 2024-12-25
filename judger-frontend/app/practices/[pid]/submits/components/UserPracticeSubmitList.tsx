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
    refetchInterval: 1000,
  });

  const resData = data?.data.data;
  const personalUserPracticeSubmitsInfo: PracticeSubmitInfo[] = resData;

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
