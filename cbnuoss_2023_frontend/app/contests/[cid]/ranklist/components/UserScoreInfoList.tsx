import React from 'react';
import UserScoreInfoListItem from './UserScoreInfoListItem';
import { ContestRankInfo } from '@/types/contest';

interface UserScoreInfoListProps {
  cid: string;
  contestRankListInfo: ContestRankInfo[];
}

export default function UserScoreInfoList({
  cid,
  contestRankListInfo,
}: UserScoreInfoListProps) {
  // 함수: ContestRankInfo 객체를 받아 totalScore와 totalPenalty를 계산
  function calculateTotalScoreAndPenalty(contestRankInfo: ContestRankInfo): {
    totalScore: number;
    totalPenalty: number;
  } {
    let totalScore = 0;
    let totalPenalty = 0;

    contestRankInfo.scores.forEach((score) => {
      if (score.right) {
        totalScore += score.score;
        // 정답을 맞힌 경우에만 시도 횟수에 따른 패널티를 추가합니다.
        totalPenalty += (score.tries - 1) * 20 + score.time;
      }
    });

    return { totalScore, totalPenalty };
  }

  const rankedContestRankListInfo = contestRankListInfo
    .map((contestRankInfo) => {
      const { totalScore, totalPenalty } =
        calculateTotalScoreAndPenalty(contestRankInfo);
      return { ...contestRankInfo, totalScore, totalPenalty };
    })
    // 그 다음, 총 점수가 높은 순으로 정렬하고, 점수가 같다면 패널티가 낮은 순으로 정렬합니다.
    .sort((a, b) => {
      if (a.totalScore === b.totalScore) {
        return a.totalPenalty - b.totalPenalty; // 패널티가 낮은 순
      }
      return b.totalScore - a.totalScore; // 점수가 높은 순
    });

  return (
    <div className="flex flex-col gap-5">
      {rankedContestRankListInfo.map((contestRankInfo, index) => (
        <UserScoreInfoListItem
          key={index}
          cid={cid}
          ranking={index + 1}
          contestRankInfo={contestRankInfo}
          totalScore={contestRankInfo.totalScore}
          totalPenalty={contestRankInfo.totalPenalty}
        />
      ))}
    </div>
  );
}
