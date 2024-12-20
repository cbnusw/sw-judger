import Link from 'next/link';
import React from 'react';
import { ExamInfo } from '@/types/exam';
import { formatDateToYYMMDDHHMM } from '@/utils/formatDate';

interface ExamProps {
  examInfo: ExamInfo;
  key: string;
}

export default function ExamListItem(props: ExamProps) {
  const { examInfo } = props;

  return (
    <Link
      href={`/exams/${examInfo._id}`}
      className="relative flex flex-col gap-4 bg-[#f7f7f7] p-3 group"
    >
      <p className="font-bold">
        <span className="hover:underline">{examInfo.title}</span>
      </p>
      <div>
        <span className="text-xs">
          <span className="font-semibold">시험 시간</span> :&nbsp;
          <span className="font-light">
            {formatDateToYYMMDDHHMM(examInfo.testPeriod.start)} ~&nbsp;
            {formatDateToYYMMDDHHMM(examInfo.testPeriod.end)}
          </span>
        </span>
      </div>
      <div className="mt-[-0.9rem]">
        <span className="text-xs font-semibold text-blue-600">
          #{examInfo.writer.name}
        </span>
        <span className="before:content-['|'] mx-3 font-thin text-[#aaa]"></span>
        <span className="text-xs font-semibold">{examInfo.course}</span>
      </div>
      <div className="absolute right-0 bottom-0 border-l-[0.6rem] border-l-[#eee] border-t-[0.6rem] border-t-[#eee] border-b-[0.6rem] border-b-white border-r-[0.6rem] border-r-white group-hover:border-l-[#3274ba] group-hover:border-t-[#3274ba] ease-in duration-100"></div>
    </Link>
  );
}
