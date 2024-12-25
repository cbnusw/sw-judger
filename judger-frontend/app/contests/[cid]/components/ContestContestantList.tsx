'use client';

import { ContestInfo } from '@/types/contest';
import EmptyContestContestantListItem from './EmptyContestContestantListItem';
import ContestContestantListItem from './ContestContestantListItem';

export interface ContestContestantListProps {
  contestContestants: ContestInfo['contestants'];
}

export default function ContestContestantList(
  props: ContestContestantListProps,
) {
  const { contestContestants } = props;

  return (
    <div className="mt-3 relative overflow-hidden rounded-sm">
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
                학번
              </th>
              <th
                scope="col"
                className="font-medium text-[#333d4b] px-4 py-2 hover:bg-[#e6e8eb]"
              >
                이름
              </th>
              <th
                scope="col"
                className="font-medium text-[#333d4b] px-4 py-2 hover:bg-[#e6e8eb]"
              >
                대학교
              </th>
              <th
                scope="col"
                className="font-medium text-[#333d4b] px-4 py-2 hover:bg-[#e6e8eb]"
              >
                학부(과)
              </th>
              <th
                scope="col"
                className="font-medium text-[#333d4b] px-4 py-2 hover:bg-[#e6e8eb]"
              >
                이메일
              </th>
            </tr>
          </thead>
          <tbody>
            {contestContestants.length === 0 ? (
              <EmptyContestContestantListItem />
            ) : (
              <>
                {contestContestants.map((contestant, index) => (
                  <ContestContestantListItem
                    contestantInfo={contestant}
                    total={contestContestants.length}
                    index={index}
                    key={index}
                  />
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
