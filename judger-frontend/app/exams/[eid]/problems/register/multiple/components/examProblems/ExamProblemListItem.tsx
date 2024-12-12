'use client';

import { ProblemInfo, IoSetItem, ExampleFile } from '@/types/problem';

interface ExamProblemListItemProps {
  problemInfo: ProblemInfo;
  total: number;
  index: number;
}

export default function ExamProblemListItem(props: ExamProblemListItemProps) {
  const { problemInfo, total, index } = props;

  return (
    <tr className="h-[3rem] border-b-[1.25px] border-[#d1d6db] text-[15px] text-center">
      <th
        scope="row"
        className="px-4 py-2 font-normal text-[#4e5968] whitespace-nowrap dark:text-white"
      >
        {index + 1}
      </th>
      <td scope="row" className="text-[#4e5968]">
        {problemInfo.title}
      </td>
      <td className="text-[#4e5968]">{problemInfo.options.maxRealTime}</td>
      <td className="text-[#4e5968]">{problemInfo.options.maxMemory}</td>
      <td className="text-[#4e5968]">{problemInfo.score}</td>
      <td>
        <a
          target="_blank"
          href={problemInfo.content}
          className="inline-block text-[0.8rem] text-[#487fee] bg-[#e8f3ff] px-3 py-[0.4rem] rounded-[6px] font-medium cursor-pointer hover:bg-[#cee1fc]"
        >
          보기
        </a>
      </td>
    </tr>
  );
}
