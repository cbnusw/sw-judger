'use client';

import { ContestInfo } from '@/types/contest';
import EmptyContestContestantListItem from './EmptyContestContestantListItem';
import ContestContestantListItem from './ContestContestantListItem';

export interface ContestContestContestantListProps {
  contestContestants: ContestInfo['contestants'];
}

export default function ContestContestContestantList(
  props: ContestContestContestantListProps,
) {
  const { contestContestants } = props;

  return (
    <div className="border mt-3 relative overflow-hidden rounded-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100  text-center">
            <tr>
              <th scope="col" className="px-4 py-2">
                학번
              </th>
              <th scope="col" className="px-4 py-2">
                이름
              </th>
              <th scope="col" className="px-4 py-2">
                대학교
              </th>
              <th scope="col" className="px-4 py-2">
                학부(과)
              </th>
              <th scope="col" className="px-4 py-2">
                이메일
              </th>
            </tr>
          </thead>
          <tbody>
            {contestContestants.length === 0 && (
              <EmptyContestContestantListItem />
            )}
            {contestContestants.map((contestant, index) => (
              <ContestContestantListItem
                contestantInfo={contestant}
                key={index}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
