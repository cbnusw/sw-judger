import Link from 'next/link';
import React from 'react';
import { formatDateToYYMMDDHHMM } from '@/utils/formatDate';
import { ContestInfo } from '@/types/contest';

interface ContestProps {
  contestInfo: ContestInfo;
  key: string;
}

export default function ContestListItem(props: ContestProps) {
  const { contestInfo } = props;

  return (
    <div className="relative flex flex-col gap-4 bg-[#f7f7f7] p-3 group">
      <p className="font-bold">
        <Link href={`/contests/${contestInfo._id}`} className="hover:underline">
          {contestInfo.title}
        </Link>
      </p>
      <div className="flex flex-col 3xs:inline-block">
        <span className="text-xs">
          <span className="font-semibold">신청 기간 : </span>
          <span className="font-light">
            {contestInfo.applyingPeriod ? (
              <>~ {formatDateToYYMMDDHHMM(contestInfo.applyingPeriod.end)}</>
            ) : (
              <>~ {formatDateToYYMMDDHHMM(contestInfo.testPeriod.start)}</>
            )}
          </span>
        </span>
        <span className="hidden 3xs:inline-block before:content-['|'] mx-3 font-thin text-[#aaa]"></span>
        <span className="text-xs">
          <span className="font-semibold">대회 시작 : </span>
          <span className="">
            {formatDateToYYMMDDHHMM(contestInfo.testPeriod.start)}
          </span>
        </span>
      </div>
      <div className="absolute right-0 bottom-0 border-l-[0.6rem] border-l-[#eee] border-t-[0.6rem] border-t-[#eee] border-b-[0.6rem] border-b-white border-r-[0.6rem] border-r-white group-hover:border-l-[#3274ba] group-hover:border-t-[#3274ba] ease-in duration-100"></div>
    </div>
  );
}
