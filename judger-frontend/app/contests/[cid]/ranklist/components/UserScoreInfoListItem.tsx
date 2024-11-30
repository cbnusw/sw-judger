'use client';

import { ContestRankInfo } from '@/types/contest';
import { useRouter } from 'next/navigation';

interface UserScoreInfoListItemProps {
  cid: string;
  ranking: number;
  contestRankInfo: ContestRankInfo;
  totalScore: number;
  totalPenalty: number;
}

export default function UserScoreInfoListItem({
  cid,
  ranking,
  contestRankInfo,
  totalScore,
  totalPenalty,
}: UserScoreInfoListItemProps) {
  const router = useRouter();

  return (
    <div className="flex justify-between min-h-[9rem] border border-gray-300 shadow-md">
      <div className="flex flex-col p-3">
        <div className="flex items-center h-fit">
          <div className="flex justify-center items-center w-[1.625rem] h-[1.625rem] bg-[#3870e0] rounded-sm">
            <span className="text-white font-semibold text-base">
              {ranking}
            </span>
          </div>
          <div className="ml-2">
            <span className="text-base">{contestRankInfo.user.name}</span>
            <span className="text-xs text-gray-600">
              ({contestRankInfo.user.department})
            </span>
          </div>
        </div>
        <div className="flex flex-wrap mt-5 gap-3">
          {contestRankInfo.scores.map((score, index) => (
            <div
              key={index}
              className={`relative flex flex-col justify-center items-center w-[5.5rem] h-[4.5rem] ${
                score.right ? 'bg-[#3870e0]' : 'bg-[#e0e0e0]'
              } border ${
                score.right ? 'border-[#3565c4]' : 'border-[#d3d3d3]'
              }`}
            >
              <div className="absolute top-[0.175rem] left-[0.175rem]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="5"
                  viewBox="0 -960 960 960"
                  width="5"
                  fill="white"
                >
                  <path d="M480.238-137q-71.145 0-133.868-27.023t-109.12-73.348q-46.398-46.325-73.324-108.826Q137-408.699 137-479.762q0-71.145 27.023-133.868t73.348-109.12q46.325-46.398 108.826-73.324Q408.699-823 479.762-823q71.145 0 133.868 27.023t109.12 73.348q46.398 46.325 73.324 108.826Q823-551.301 823-480.238q0 71.145-27.023 133.868t-73.348 109.12q-46.325 46.398-108.826 73.324Q551.301-137 480.238-137Z" />
                </svg>
              </div>
              <div
                className={`${
                  score.right ? 'text-white' : 'text-[#3f3f3f]'
                } text-[0.825rem] font-medium`}
              >
                문제 {index + 1}번
              </div>
              <div className="mt-1 flex flex-col text-center">
                <span
                  className={`${
                    score.right ? 'text-white' : 'text-[#3f3f3f]'
                  } text-[0.7rem]`}
                >
                  시도: {score.tries}회
                </span>
                <span
                  className={`${
                    score.right ? 'mt-[-0.2rem] text-white' : 'text-[#3f3f3f]'
                  } text-[0.7rem]`}
                >
                  시간: {score.time}분
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-around border-l border-gray-300">
        <div className="flex flex-col w-full text-center bg-[#f7f7f7]">
          <div className="w-12 3md:w-[4.5rem] flex justify-center items-center text-[0.825rem] font-semibold bg-[#f7f7f7] h-8 border-b border-gray-300">
            점수
          </div>
          <div className="flex justify-center items-center bg-white h-full">
            {totalScore}
          </div>
        </div>
        <div className="flex flex-col w-full text-center bg-[#f7f7f7]">
          <div className="w-12 3md:w-[4.5rem] flex justify-center items-center text-[0.825rem] font-semibold bg-[#f7f7f7] h-8 border-b border-l border-gray-300">
            패널티
          </div>
          <div className="flex justify-center items-center bg-white h-full border-l text-red-600">
            {totalPenalty}
          </div>
        </div>
      </div>
    </div>
  );
}
