'use client';

import { ContestRankInfo } from '@/types/contest';
import { useRouter } from 'next/navigation';

interface UserScoreInfoListItemProps {
  cid: string;
  ranking: number;
  contestRankInfo: ContestRankInfo;
  totalScore: number;
  totalPenalty: number;
  problemPenalties: number[];
  minPenaltiesPerProblem: number[];
}

export default function UserScoreInfoListItem({
  cid,
  ranking,
  contestRankInfo,
  totalScore,
  totalPenalty,
  problemPenalties,
  minPenaltiesPerProblem,
}: UserScoreInfoListItemProps) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center gap-6 w-full p-4 pr-8 bg-[#f2f4f6] rounded-xl">
      <div className="flex flex-col">
        <div className="flex items-center h-fit">
          <span className="flex justify-center items-center font-medium bg-[#8c95a0] text-[17px] text-white w-6 h-6 rounded-[7px]">
            {ranking}
          </span>
          <div className="ml-2">
            <span className="text-[17px]">{contestRankInfo.user.name}</span>
            <span className="text-xs text-gray-600">
              ({contestRankInfo.user.department},{' '}
              {contestRankInfo.user.no.slice(0, 4) +
                '***' +
                contestRankInfo.user.no.slice(7)}
              )
            </span>
          </div>
        </div>
        <div className="flex flex-wrap mt-4 gap-2">
          {contestRankInfo.scores.map((score, index) => (
            <div
              key={index}
              className={`relative flex flex-col justify-center items-center w-[5rem] h-[4.5rem] rounded-lg ${
                score.right
                  ? score.right &&
                    problemPenalties[index] === minPenaltiesPerProblem[index]
                    ? 'bg-[#1ab394]' // 최소 패널티로 해결한 경우
                    : 'bg-[#3a8af9]' // 정답이지만 최소 패널티는 아닌 경우
                  : score.tries > 0
                  ? 'bg-[#ed5564]'
                  : 'bg-[#e1e3e7]'
              }`}
            >
              <div
                className={`absolute top-[-1px] text-center ${
                  score.right
                    ? score.right &&
                      problemPenalties[index] === minPenaltiesPerProblem[index]
                      ? 'bg-[#009576] text-white' // 최소 패널티로 해결한 경우
                      : 'bg-[#1c6cdb] text-white' // 정답이지만 최소 패널티는 아닌 경우
                    : score.tries > 0
                    ? 'bg-[#cf3746] text-white'
                    : 'bg-[#d7d9dd] text-[#3f3f3f]'
                } text-[17px] w-full rounded-t-lg font-medium`}
              >
                {String.fromCharCode('A'.charCodeAt(0) + index)}
              </div>
              <div className="mt-4 flex flex-col text-center">
                <span
                  className={`${
                    score.right
                      ? 'text-white'
                      : score.tries > 0
                      ? 'text-white'
                      : 'text-[#3f3f3f]'
                  } mt-[-0.15rem] text-2xl ${
                    score.tries === 0 ? 'font-light' : 'font-semibold'
                  }`}
                >
                  {score.tries === 0 ? '-' : score.tries}
                </span>

                {score.right && (
                  <span
                    className={`${
                      score.right
                        ? 'text-white'
                        : score.tries > 0
                        ? 'text-white'
                        : 'text-[#3f3f3f]'
                    } mt-[-0.3rem] text-[0.7rem]`}
                  >
                    {problemPenalties[index]}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col text-center">
        <span
          className={`text-3xl ${
            totalScore > 0 ? 'text-[#3a8af9]' : 'text-[#676a6c]'
          } font-medium`}
        >
          {totalScore}
        </span>
        <span className="text-xs text-[#676a6c]">{totalPenalty}</span>
      </div>
    </div>
  );
}
