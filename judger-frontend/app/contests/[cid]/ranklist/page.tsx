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
import { useCountdownTimer } from '@/hooks/useCountdownTimer';
import { useCallback, useEffect, useState } from 'react';
import { userInfoStore } from '@/store/UserInfo';
import normalBellImg from '@/public/images/normal-bell.png';
import alarmImg from '@/public/images/alarm.png';

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

  // 대회 시작까지 남은 시간 또는 대회 종료까지 남은 시간을 표시하는 함수
  const renderRemainingTime = () => {
    const formatTime = (
      days: number,
      hours: number,
      minutes: number,
      seconds: number,
    ): string => {
      if (isNaN(days) || isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
        return '';
      }

      const pad = (num: number) => String(num).padStart(2, '0');
      if (days > 0) {
        return `${days}일 ${pad(hours)}시 ${pad(minutes)}분 ${pad(seconds)}초`;
      }
      if (hours > 0) {
        return `${hours}시 ${pad(minutes)}분 ${pad(seconds)}초`;
      }
      if (minutes > 0) {
        return `${minutes}분 ${pad(seconds)}초`;
      }
      return `${seconds}초`;
    };

    if (currentTime < contestStartTime) {
      const formattedTime = formatTime(
        timeUntilStart.days,
        timeUntilStart.hours,
        timeUntilStart.minutes,
        timeUntilStart.seconds,
      );

      if (!formattedTime) return null;

      return (
        <span
          className={`w-fit flex justify-center items-center gap-2 text-[0.8rem] text-[#487fee] bg-[#e8f3ff] px-3 py-1 rounded-full font-semibold`}
        >
          <Image
            src={normalBellImg}
            alt="normalBell"
            width={17.5}
            height={0}
            quality={100}
            className="bell-shake"
          />
          {formattedTime}
        </span>
      );
    } else if (
      currentTime >= contestStartTime &&
      currentTime < contestEndTime
    ) {
      const formattedTime = formatTime(
        timeUntilEnd.days,
        timeUntilEnd.hours,
        timeUntilEnd.minutes,
        timeUntilEnd.seconds,
      );

      if (!formattedTime) return null;

      return (
        <span
          className={`flex justify-center items-center gap-2 text-[0.8rem] text-[#de5257] bg-[#fcefee] px-3 py-1 rounded-full font-semibold`}
        >
          <Image
            src={alarmImg}
            alt="timer"
            width={17.5}
            height={0}
            quality={100}
            className="alarm-shake"
          />
          {formattedTime}
        </span>
      );
    }

    return null;
  };

  const handleGoToContestProblems = () => {
    router.push(`/contests/${cid}/problems`);
  };

  const isAnyQueryPending = results.some((result) => result.isFetching);
  if (isAnyQueryPending) return <Loading />;

  return (
    <div className="mt-4 mb-24 px-1 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[21rem] xs:w-[90%] xl:w-[72.5%] mx-auto">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center text-2xl font-bold tracking-tight">
              <Image
                src={trophyImg}
                alt="trophy"
                width={55}
                height={0}
                quality={100}
                className="fade-in-fast"
              />

              <div className="lift-up flex flex-col 3md:flex-row 3md:items-end">
                <span className="ml-4 text-[28px] font-semibold tracking-wide">
                  대회 순위
                </span>
              </div>
            </div>

            <Link
              href={`/contests/${cid}`}
              className="lift-up w-fit flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#487fee] bg-[#e8f3ff] px-3 py-1 rounded-full font-semibold hover:bg-[#cee1fc]"
            >
              {contestInfo.title}
            </Link>
          </div>

          <div className="flex flex-col 3md:flex-row justify-between pb-3 border-b border-gray-300">
            <div className="flex flex-col 3md:flex-row gap-2">
              {shouldShowProblemsButton() && (
                <button
                  onClick={handleGoToContestProblems}
                  className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-4 py-[0.5rem] rounded-[7px] font-medium  hover:bg-[#d3d6da]"
                >
                  문제 목록
                </button>
              )}
            </div>
            <div className="mt-3">
              {timeUntilEnd?.isPast ? (
                <span
                  className={`w-fit flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#de5257] bg-[#fcefee] px-3 py-1 rounded-full font-semibold`}
                >
                  종료
                </span>
              ) : (
                <>{renderRemainingTime()}</>
              )}
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
