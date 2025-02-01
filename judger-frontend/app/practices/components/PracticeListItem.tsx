import { ProblemInfo } from '@/types/problem';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

interface PracticeListItemProps {
  practiceInfo: ProblemInfo;
  total: number;
  page: number;
  index: number;
}

export default function PracticeListItem(props: PracticeListItemProps) {
  const { practiceInfo, total, page, index } = props;

  const router = useRouter();

  return (
    <Link
      href={`practices/${practiceInfo._id}`}
      className="flex items-center gap-2 w-full px-3 py-[0.6rem] cursor-pointer bg-[#f2f4f6] hover:bg-[#d3d6da] rounded-[7px]"
    >
      <span className="flex justify-center items-center font-medium bg-[#8c95a0] text-[14px] text-white w-5 h-5 rounded-[7px]">
        {String.fromCharCode('A'.charCodeAt(0) + index)}
      </span>
      <span className="px-2 font-semibold text-[#4e5968]">
        {practiceInfo.title}
      </span>
    </Link>
  );
}
