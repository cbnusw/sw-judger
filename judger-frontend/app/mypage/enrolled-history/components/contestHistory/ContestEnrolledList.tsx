'use client';

import EmptyContestEnrolledListItem from './EmptyContestEnrolledListItem';
import ContestEnrolledListItem from './ContestEnrolledListItem';
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { ContestEnrolledInfo } from '@/types/contest';
import ContestEnrolledListLoadingSkeleton from './ContestEnrolledListLoadingSkeleton';

// 참가했던 대회 목록 반환 API
const fetchEnrolledContests = () => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/contest/enroll/me`,
  );
};

export default function ContestEnrolledList() {
  const { isPending, data } = useQuery({
    queryKey: ['myEnrolledContests'],
    queryFn: fetchEnrolledContests,
  });

  const resData = data?.data.data.reverse();

  if (isPending) return <ContestEnrolledListLoadingSkeleton />;

  return (
    <div className="mx-auto mt-6 w-full">
      <div className="relative overflow-hidden rounded-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 ">
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
              </tr>
            </thead>
            <tbody>
              {resData.length === 0 ? (
                <EmptyContestEnrolledListItem />
              ) : (
                <>
                  {resData?.map(
                    (
                      contestEnrolledInfo: ContestEnrolledInfo,
                      index: number,
                    ) => (
                      <ContestEnrolledListItem
                        contestEnrolledInfo={contestEnrolledInfo}
                        total={resData.length}
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
    </div>
  );
}
