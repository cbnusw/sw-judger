import { ContestInfo } from '@/types/contest';
import { formatDateToYYMMDD, formatDateToYYMMDDHHMM } from '@/utils/formatDate';
import { useRouter } from 'next/navigation';
import React from 'react';

interface ContestListItemProps {
  contestInfo: ContestInfo;
  total: number;
  page: number;
  index: number;
}

export default function MyContestPostListItem(props: ContestListItemProps) {
  const { contestInfo, total, page, index } = props;

  const router = useRouter();

  return (
    <tr
      className="h-[2.5rem] border-b-[1.25px] border-[#d1d6db] text-xs text-center cursor-pointer hover:bg-[#e8f3ff]"
      onClick={(e) => {
        router.push(`/contests/${contestInfo._id}`);
      }}
    >
      <th
        scope="row"
        className="px-2 py-2 font-normal text-[#4e5968] whitespace-nowrap dark:text-white"
      >
        {total - (page - 1) * 10 - index}
      </th>
      <td className="px-2 font-semibold text-start text-[#4e5968]">
        {contestInfo.title}
      </td>

      <td className="px-2 text-[#4e5968]">
        {contestInfo.applyingPeriod ? (
          <>~ {formatDateToYYMMDDHHMM(contestInfo.applyingPeriod.end)}</>
        ) : (
          <>~ {formatDateToYYMMDDHHMM(contestInfo.testPeriod.start)}</>
        )}
      </td>
      <td className="px-2 text-[#4e5968]">
        ~ {formatDateToYYMMDDHHMM(contestInfo.testPeriod.end)}
      </td>
      <td className="px-2">{formatDateToYYMMDD(contestInfo.createdAt)}</td>
    </tr>
  );
}
