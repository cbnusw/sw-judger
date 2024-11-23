'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import ContestProblemList from './components/ContestProblemList';
import Image from 'next/image';
import listImg from '@/public/images/list.png';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';
import { ProblemInfo, ProblemsInfo } from '@/types/problem';
import { formatDateToYYMMDDHHMM } from '@/utils/formatDate';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';
import { fetchCurrentUserInfo } from '@/utils/fetchCurrentUserInfo';
import { userInfoStore } from '@/store/UserInfo';
import { OPERATOR_ROLES } from '@/constants/role';
import { UserInfo } from '@/types/user';
import { AxiosError } from 'axios';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import ContestProblemListPageLoadingSkeleton from './components/ContestProblemListPageLoadingSkeleton';

// 대회 문제 열람 비밀번호 확인 API
const confirmContestPassword = ({
  cid,
  password,
}: {
  cid: string;
  password: string;
}) => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/contest/confirm/${cid}?password=${password}`,
  );
};

// 대회에 등록된 문제 목록 정보 조회 API
const fetchContestProblemsDetailInfo = ({ queryKey }: any) => {
  const cid = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/contest/${cid}/problems`,
  );
};

// 대회에 등록된 문제 순서 변경 API
const contestProblemReorder = ({
  cid,
  params,
}: {
  cid: string;
  params: ProblemInfo[];
}) => {
  const requestBody = {
    problems: params,
  };
  return axiosInstance.patch(
    `${process.env.NEXT_PUBLIC_API_VERSION}/contest/${cid}/problem/reorder`,
    requestBody,
  );
};

interface DefaultProps {
  params: {
    cid: string;
  };
}

export default function ContestProblems(props: DefaultProps) {
  const cid = props.params.cid;

  const confirmContestPasswordMutation = useMutation({
    mutationFn: confirmContestPassword,
    onError: (error: AxiosError) => {
      const resData: any = error.response?.data;
      switch (resData.status) {
        case 400:
          switch (resData.code) {
            case 'CONTEST_PASSWORD_NOT_MATCH':
              alert('비밀번호가 일치하지 않습니다.');
              deleteCookie(cid);
              router.back();
              break;
            default:
              alert('정의되지 않은 http code입니다.');
          }
          break;
        default:
          alert('정의되지 않은 http status code입니다');
      }
    },
    onSuccess: (data) => {
      const resData = data.data;
      const httpStatusCode = resData.status;

      switch (httpStatusCode) {
        case 200:
          setCookie(cid, password, { maxAge: 60 * 60 * 24 });
          setIsPasswordChecked(true);
          break;
        default:
          alert('정의되지 않은 http status code입니다');
      }
    },
  });

  const [password, setPassword] = useState('');
  const [isPasswordChecked, setIsPasswordChecked] = useState(false);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['contestProblemsDetailInfo', cid],
    queryFn: fetchContestProblemsDetailInfo,
    retry: 0,
  });

  const resData = data?.data.data;
  const contestProblemsInfo: ProblemsInfo = resData;

  const contestProblemReorderMutation = useMutation({
    mutationFn: contestProblemReorder,
    onSuccess: (data) => {
      const resData = data.data;
      const httpStatusCode = resData.status;

      switch (httpStatusCode) {
        case 200:
          alert('문제 순서가 변경되었습니다.');
          break;
        default:
          alert('정의되지 않은 http status code입니다');
      }
    },
  });

  const userInfo = userInfoStore((state: any) => state.userInfo);
  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);

  const [isLoading, setIsLoading] = useState(true);
  const [problemsInfo, setProblemsInfo] = useState<ProblemInfo[]>([]);

  const timeUntilStart = useCountdownTimer(
    contestProblemsInfo?.testPeriod.start,
  );
  const timeUntilEnd = useCountdownTimer(contestProblemsInfo?.testPeriod.end);
  const currentTime = new Date();
  const contestStartTime = new Date(contestProblemsInfo?.testPeriod.start);
  const contestEndTime = new Date(contestProblemsInfo?.testPeriod.end);

  const [
    isChagingContestProblemOrderActivate,
    setIsChangingContestProblemOrderActivate,
  ] = useState(false);

  const changingProblemOrderBtnRef = useRef<HTMLButtonElement>(null);

  const router = useRouter();

  useEffect(() => {
    if (contestProblemsInfo) {
      setProblemsInfo(contestProblemsInfo.problems);
    }
  }, [contestProblemsInfo]);

  useEffect(() => {
    // (로그인 한) 사용자 정보 조회 및 관리자 권한 확인, 그리고 게시글 작성자인지 확인
    fetchCurrentUserInfo(updateUserInfo).then((userInfo: UserInfo) => {
      if (contestProblemsInfo) {
        const isWriter = contestProblemsInfo.writer._id === userInfo._id;
        const isContestant = contestProblemsInfo.contestants.some(
          (contestant_id) => contestant_id === userInfo._id,
        );

        if (
          isContestant &&
          contestStartTime <= currentTime &&
          currentTime < contestEndTime
        ) {
          setIsLoading(false);
          const contestPasswordCookie = getCookie(cid);
          if (contestPasswordCookie) {
            setPassword(contestPasswordCookie);
            confirmContestPasswordMutation.mutate({
              cid,
              password: contestPasswordCookie,
            });
            return;
          }

          const inputPassword = prompt('비밀번호를 입력해 주세요');
          if (inputPassword !== null && inputPassword.trim() !== '') {
            setPassword(inputPassword);
            confirmContestPasswordMutation.mutate({
              cid,
              password: inputPassword,
            });
            return;
          }

          router.back();
          return;
        }

        if (isWriter) {
          setIsLoading(false);
          setIsPasswordChecked(true);
          return;
        }

        alert('접근 권한이 없습니다.');
        router.back();
      }
    });
  }, [updateUserInfo, contestProblemsInfo, cid, router]);

  const handleGoToContestRankList = () => {
    router.push(`/contests/${cid}/ranklist`);
  };

  const handleRegisterContestProblem = () => {
    router.push(`/contests/${cid}/problems/register`);
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

  const handleChangeProblemOrder = () => {
    changingProblemOrderBtnRef.current?.blur();

    if (contestProblemsInfo.problems.length < 2) {
      alert('문제가 2개 이상 등록된 경우에 문제의 순서를 변경할 수 있습니다.');
      return;
    }

    setIsChangingContestProblemOrderActivate((prev) => !prev);
    if (isChagingContestProblemOrderActivate) {
      contestProblemReorderMutation.mutate({ cid, params: problemsInfo });
    }
  };

  if (isLoading || !isPasswordChecked)
    return <ContestProblemListPageLoadingSkeleton />;

  return (
    <div className="mt-2 mb-24 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[21rem] xs:w-[90%] xl:w-[72.5%] mx-auto">
        <div className="flex flex-col gap-8">
          <p className="flex items-center text-2xl font-bold tracking-tight">
            <Image
              src={listImg}
              alt="list"
              width={70}
              height={0}
              quality={100}
              className="ml-[-1rem] fade-in-fast drop-shadow-lg"
            />
            <div className="lift-up flex flex-col 3md:flex-row 3md:items-end">
              <span className="ml-2 text-3xl font-semibold tracking-wide">
                문제 목록
              </span>
              <Link
                href={`/contests/${cid}`}
                className="mt-1 ml-2 3md:ml-1 text-xl font-medium cursor-pointer hover:underline hover:text-[#0038a8] focus:underline focus:text-[#0038a8] text-[#1048b8]"
              >
                (대회: {contestProblemsInfo.title})
              </Link>
            </div>
          </p>

          <div className="flex flex-col 3md:flex-row justify-between pb-3 border-b border-gray-300">
            <div className="flex flex-col 3md:flex-row gap-2">
              {!isChagingContestProblemOrderActivate && (
                <>
                  <button
                    onClick={handleGoToContestRankList}
                    className="flex justify-center items-center gap-[0.375rem] text-sm text-[#f9fafb] bg-[#0388ca] px-2 py-[0.45rem] rounded-[6px] font-medium focus:bg-[#007eb9] hover:bg-[#007eb9]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="23"
                      viewBox="0 -960 960 960"
                      width="23"
                      fill="white"
                    >
                      <path d="M298-120v-60h152v-148q-54-11-96-46.5T296-463q-74-8-125-60t-51-125v-44q0-25 17.5-42.5T180-752h104v-88h392v88h104q25 0 42.5 17.5T840-692v44q0 73-51 125t-125 60q-16 53-58 88.5T510-328v148h152v60H298Zm-14-406v-166H180v44q0 45 29.5 78.5T284-526Zm392 0q45-10 74.5-43.5T780-648v-44H676v166Z" />
                    </svg>
                    대회 순위
                  </button>
                  {OPERATOR_ROLES.includes(userInfo.role) &&
                    userInfo._id === contestProblemsInfo.writer._id &&
                    currentTime < contestEndTime && (
                      <button
                        onClick={handleRegisterContestProblem}
                        className="flex justify-center items-center gap-[0.375rem] text-[#f9fafb] bg-green-500 px-2 py-[0.45rem] rounded-[6px] focus:bg-[#3e9368] hover:bg-[#3e9368]"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="20"
                          viewBox="0 -960 960 960"
                          width="20"
                          fill="white"
                        >
                          <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520h200L520-800v200Z" />
                        </svg>
                        문제 등록
                      </button>
                    )}
                </>
              )}

              {OPERATOR_ROLES.includes(userInfo.role) &&
                userInfo._id === contestProblemsInfo.writer._id &&
                currentTime < contestEndTime && (
                  <button
                    onClick={handleChangeProblemOrder}
                    ref={changingProblemOrderBtnRef}
                    className="flex justify-center items-center gap-[0.375rem] text-[#f9fafb] bg-[#ff5fb1] px-2 py-[0.45rem] rounded-[6px] focus:bg-[#f555a8] hover:bg-[#f555a8]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="23"
                      viewBox="0 -960 960 960"
                      width="23"
                      fill="white"
                    >
                      <path d="M241.5-478.5q0 44.5 16.75 87T311-313l13 13v-61.5q0-15.5 11-26.5t26.5-11q15.5 0 26.5 11t11 26.5v157q0 15.5-11 26.5t-26.5 11h-157q-15.5 0-26.5-11t-11-26.5q0-15.5 11-26.5t26.5-11H277l-18-17q-49.5-46.5-71-103.75T166.5-478.5q0-91.5 47-167t126.5-115q13.5-7 27.5-.5t19 21.5q5 14.5-.25 28.25T367.5-690q-58 31.5-92 87.75t-34 123.75Zm477-3q0-44.5-16.75-87T649-647l-13-13v61.5q0 15.5-11 26.5t-26.5 11q-15.5 0-26.5-11t-11-26.5v-157q0-15.5 11-26.5t26.5-11h157q15.5 0 26.5 11t11 26.5q0 15.5-11 26.5t-26.5 11H683l18 17q48 48 70.25 104.5t22.25 115q0 91.5-47 166.5t-126 115q-13.5 7-27.75.75T573.5-220.5q-5-14.5.25-28.25T592.5-270q58-31.5 92-87.75t34-123.75Z" />
                    </svg>
                    {isChagingContestProblemOrderActivate ? (
                      <>저장하기</>
                    ) : (
                      <>순서 변경</>
                    )}
                  </button>
                )}
            </div>

            <div className="mt-3">
              <span className="font-semibold">
                대회 시간:{' '}
                <span className="font-light">
                  {formatDateToYYMMDDHHMM(contestProblemsInfo.testPeriod.start)}{' '}
                  ~ {formatDateToYYMMDDHHMM(contestProblemsInfo.testPeriod.end)}{' '}
                  {timeUntilEnd?.isPast ? (
                    <span className="text-red-500 font-bold">(종료)</span>
                  ) : (
                    renderRemainingTime()
                  )}
                </span>
              </span>
            </div>
          </div>

          <section className="dark:bg-gray-900">
            <div className="mx-auto w-full">
              <div className="dark:bg-gray-800 relative overflow-hidden rounded-sm">
                <div className="overflow-x-auto">
                  <ContestProblemList
                    cid={cid}
                    isChagingContestProblemOrderActivate={
                      isChagingContestProblemOrderActivate
                    }
                    problemsInfo={problemsInfo}
                    setProblemsInfo={setProblemsInfo}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
