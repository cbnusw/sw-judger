'use client';

import Loading from '@/app/components/Loading';
import UserScoreInfoList from './components/UserScoreInfoList';
import EmptyUserScoreInfoListItem from './components/EmptyUserScoreInfoListItem';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import trophyImg from '@/public/images/trophy.png';
import axiosInstance from '@/utils/axiosInstance';
import { useQueries } from '@tanstack/react-query';
import { ContestInfo, ContestRankInfo } from '@/types/contest';
import { formatDateToYYMMDDHHMM } from '@/utils/formatDate';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';
import { useCallback, useEffect, useState } from 'react';
import { userInfoStore } from '@/store/UserInfo';

// 대회 게시글 정보 조회 API
const fetchContestDetailInfo = ({ queryKey }: any) => {
  const cid = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/contest/${cid}`,
  );
};

// 대회 순위 조회 API
const fetchContestRankListInfo = ({ queryKey }: any) => {
  const cid = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/score/contest/${cid}`,
  );
};

interface DefaultProps {
  params: {
    cid: string;
  };
}

export default function ContestRankList(props: DefaultProps) {
  const cid = props.params.cid;

  const results = useQueries({
    queries: [
      { queryKey: ['contestDetailInfo', cid], queryFn: fetchContestDetailInfo },
      {
        queryKey: ['contestRankListInfo', cid],
        queryFn: fetchContestRankListInfo,
      },
    ],
  });

  const userInfo = userInfoStore((state: any) => state.userInfo);

  const contestInfo: ContestInfo = results[0].data?.data.data;
  const contestRankListInfo: ContestRankInfo[] = results[1].data?.data.data;

  const timeUntilStart = useCountdownTimer(contestInfo?.testPeriod.start);
  const timeUntilEnd = useCountdownTimer(contestInfo?.testPeriod.end);
  const currentTime = new Date();
  const contestStartTime = new Date(contestInfo?.testPeriod.start);
  const contestEndTime = new Date(contestInfo?.testPeriod.end);

  const [isEnrollContest, setIsEnrollContest] = useState(false);

  const router = useRouter();

  // 대회 신청 여부 확인
  const isUserContestant = useCallback(() => {
    return contestInfo.contestants.some(
      (contestant) => contestant._id === userInfo._id,
    );
  }, [contestInfo, userInfo]);

  useEffect(() => {
    if (contestInfo && contestInfo.contestants && userInfo)
      setIsEnrollContest(isUserContestant());
  }, [contestInfo, userInfo, isUserContestant]);

  // "문제 목록" 버튼의 렌더링 조건을 설정
  const shouldShowProblemsButton = () => {
    // 대회 게시글 작성자인 경우, 언제든지 버튼 보임
    if (userInfo._id === contestInfo.writer._id) {
      return true;
    }

    // 대회 신청자인 경우, 대회 시간 중에만 버튼 보임
    if (
      isEnrollContest &&
      currentTime >= contestStartTime &&
      currentTime < contestEndTime
    ) {
      return true;
    }

    return false;
  };

  // 대회 시간 표시에 사용할 클래스를 결정하는 함수
  const getTimeDisplayClass = () => {
    if (currentTime < contestStartTime) {
      // 대회 시작 전
      return 'text-blue-500';
    } else if (
      currentTime >= contestStartTime &&
      currentTime < contestEndTime
    ) {
      // 대회 진행 중
      return 'text-red-500';
    }
  };

  // 대회 시작까지 남은 시간 또는 대회 종료까지 남은 시간을 표시하는 함수
  const renderRemainingTime = () => {
    if (currentTime < contestStartTime) {
      // 대회 시작 전: 대회 시작까지 남은 시간 표시
      return (
        <span className={`font-semibold ${getTimeDisplayClass()}`}>
          {timeUntilStart.days > 0 &&
            `(${timeUntilStart.days}일 ${timeUntilStart.hours}시간 남음)`}
          {timeUntilStart.days === 0 &&
            timeUntilStart.hours > 0 &&
            `(${timeUntilStart.hours}시간 ${timeUntilStart.minutes}분 남음)`}
          {timeUntilStart.days === 0 &&
            timeUntilStart.hours === 0 &&
            timeUntilStart.minutes > 0 &&
            `(${timeUntilStart.minutes}분 ${timeUntilStart.seconds}초 남음)`}
          {timeUntilStart.days === 0 &&
            timeUntilStart.hours === 0 &&
            timeUntilStart.minutes === 0 &&
            `(${timeUntilStart.seconds}초 남음)`}
        </span>
      );
    } else if (
      currentTime >= contestStartTime &&
      currentTime < contestEndTime
    ) {
      // 대회 진행 중: 대회 종료까지 남은 시간 표시
      return (
        <span className={`font-semibold ${getTimeDisplayClass()}`}>
          {timeUntilEnd.days > 0 &&
            `(${timeUntilEnd.days}일 ${timeUntilEnd.hours}시간 남음)`}
          {timeUntilEnd.days === 0 &&
            timeUntilEnd.hours > 0 &&
            `(${timeUntilEnd.hours}시간 ${timeUntilEnd.minutes}분 남음)`}
          {timeUntilEnd.days === 0 &&
            timeUntilEnd.hours === 0 &&
            timeUntilEnd.minutes > 0 &&
            `(${timeUntilEnd.minutes}분 ${timeUntilEnd.seconds}초 남음)`}
          {timeUntilEnd.days === 0 &&
            timeUntilEnd.hours === 0 &&
            timeUntilEnd.minutes === 0 &&
            `(${timeUntilEnd.seconds}초 남음)`}
        </span>
      );
    }
  };

  const handleGoToContestProblems = () => {
    router.push(`/contests/${cid}/problems`);
  };

  const isAnyQueryPending = results.some((result) => result.isFetching);
  if (isAnyQueryPending) return <Loading />;

  return (
    <div className="mt-2 mb-24 px-1 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[21rem] xs:w-[90%] xl:w-[72.5%] mx-auto">
        <div className="flex flex-col gap-8">
          <p className="flex items-center text-2xl font-bold tracking-tight">
            <Image
              src={trophyImg}
              alt="trophy"
              width={80}
              height={0}
              quality={100}
              className="ml-[-1rem] fade-in-fast drop-shadow-lg"
            />
            <div className="lift-up flex flex-col 3md:flex-row 3md:items-end">
              <span className="ml-2 text-3xl font-semibold tracking-wide">
                대회 순위
              </span>
              <Link
                href={`/contests/${cid}`}
                className="mt-1 ml-2 3md:ml-1 text-xl font-medium cursor-pointer hover:underline hover:text-[#0038a8] focus:underline focus:text-[#0038a8] text-[#1048b8]"
              >
                ({contestInfo.title})
              </Link>
            </div>
          </p>

          <div className="flex flex-col 3md:flex-row justify-between pb-3 border-b border-gray-300">
            <div className="flex flex-col 3md:flex-row gap-2">
              {shouldShowProblemsButton() && (
                <button
                  onClick={handleGoToContestProblems}
                  className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-4 py-[0.5rem] rounded-[7px] font-medium focus:bg-[#d3d6da] hover:bg-[#d3d6da]"
                >
                  문제 목록
                </button>
              )}
            </div>
            <div className="mt-3">
              <span className="font-semibold 3md:ml-auto">
                대회 시간:{' '}
                <span className="font-light">
                  {formatDateToYYMMDDHHMM(contestInfo.testPeriod.start)} ~{' '}
                  {formatDateToYYMMDDHHMM(contestInfo.testPeriod.end)}{' '}
                  {timeUntilEnd?.isPast ? (
                    <span className="text-red-500 font-bold">(종료)</span>
                  ) : (
                    renderRemainingTime()
                  )}
                </span>
              </span>
            </div>
          </div>
        </div>

        {contestRankListInfo.length === 0 ? (
          <EmptyUserScoreInfoListItem />
        ) : (
          <>
            <div className="flex mt-4 justify-between items-center">
              <span>
                총:{' '}
                <span>
                  <span className="text-red-500">
                    {contestRankListInfo.length}
                  </span>
                  명
                </span>
              </span>
            </div>

            <div className="my-4 pb-5">
              <UserScoreInfoList
                cid={cid}
                contestRankListInfo={contestRankListInfo}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
