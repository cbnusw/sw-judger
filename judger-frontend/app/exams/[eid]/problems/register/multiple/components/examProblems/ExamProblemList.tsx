'use client';

import { ProblemInfo } from '@/types/problem';
import ExamProblemListItem from './ExamProblemListItem';

interface ExamProblemListProps {
  eid: string;
  problemsInfo: ProblemInfo[];
  setProblemsInfo: (problemsInfo: ProblemInfo[]) => void;
}

export default function ExamProblemList({
  eid,
  problemsInfo,
  setProblemsInfo,
}: ExamProblemListProps) {
  return (
    <div className="mt-3 relative overflow-hidden rounded-sm">
      <div className="overflow-x-auto">
        <table className="w-[60rem] 3xs:w-full text-sm text-left text-gray-500">
          <thead className="border-y-[1.25px] border-[#d1d6db] text-[15px] uppercase bg-[#f2f4f6] text-center">
            <tr className="h-[2.75rem]">
              <th
                scope="col"
                className="font-normal text-[#333d4b] w-16 px-4 py-2 hover:bg-[#e6e8eb]"
              >
                번호
              </th>
              <th
                scope="col"
                className="font-normal text-[#333d4b] px-4 py-2 hover:bg-[#e6e8eb]"
              >
                문제명
              </th>
              <th
                scope="col"
                className="font-normal text-[#333d4b] px-4 py-2 hover:bg-[#e6e8eb]"
              >
                최대 실행 시간
              </th>
              <th
                scope="col"
                className="font-normal text-[#333d4b] px-4 py-2 hover:bg-[#e6e8eb]"
              >
                최대 메모리 사용량
              </th>
              <th
                scope="col"
                className="font-normal text-[#333d4b] px-4 py-2 hover:bg-[#e6e8eb]"
              >
                점수
              </th>
              <th
                scope="col"
                className="font-normal text-[#333d4b] px-4 py-2 hover:bg-[#e6e8eb]"
              >
                문제 파일
              </th>
            </tr>
          </thead>
          <tbody>
            {problemsInfo.length !== 0 && (
              <>
                {problemsInfo.map((problemInfo, index) => (
                  <ExamProblemListItem
                    problemInfo={problemInfo}
                    total={problemsInfo.length}
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
