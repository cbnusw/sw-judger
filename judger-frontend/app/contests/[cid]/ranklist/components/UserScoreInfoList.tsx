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
  function calculateScoresAndPenalties(contestRankInfo: ContestRankInfo): {
    totalScore: number;
    totalPenalty: number;
    problemPenalties: number[];
  } {
    let totalScore = 0;
    let totalPenalty = 0;
    const problemPenalties: number[] = [];

    contestRankInfo.scores.forEach((score) => {
      let problemPenalty = 0;
      if (score.right) {
        totalScore += score.score;
        problemPenalty = (score.tries - 1) * 20 + score.time;
        totalPenalty += problemPenalty;
      }
      problemPenalties.push(problemPenalty);
    });

    return { totalScore, totalPenalty, problemPenalties };
  }

  // 각 문제별 최소 패널티 계산
  const minPenaltiesPerProblem: number[] = [];

  if (contestRankListInfo.length > 0) {
    const problemCount = contestRankListInfo[0].scores.length;
    for (let problemIndex = 0; problemIndex < problemCount; problemIndex++) {
      let minPenalty = Infinity;
      contestRankListInfo.forEach((contestRankInfo) => {
        const score = contestRankInfo.scores[problemIndex];
        if (score.right) {
          const penalty = (score.tries - 1) * 20 + score.time;
          minPenalty = Math.min(minPenalty, penalty);
        }
      });
      minPenaltiesPerProblem.push(minPenalty === Infinity ? 0 : minPenalty);
    }
  }

  const rankedContestRankListInfo = contestRankListInfo
    .map((contestRankInfo) => {
      const { totalScore, totalPenalty, problemPenalties } =
        calculateScoresAndPenalties(contestRankInfo);
      return {
        ...contestRankInfo,
        totalScore,
        totalPenalty,
        problemPenalties,
      };
    })
    .sort((a, b) => {
      if (a.totalScore === b.totalScore) {
        return a.totalPenalty - b.totalPenalty;
      }
      return b.totalScore - a.totalScore;
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
          problemPenalties={contestRankInfo.problemPenalties}
          minPenaltiesPerProblem={minPenaltiesPerProblem}
        />
      ))}
    </div>
  );
}
