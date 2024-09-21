'use client';

import Loading from '@/app/loading';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import ExamProblemList from './components/ExamProblemList';
import Image from 'next/image';
import listImg from '@/public/images/list.png';
import axiosInstance from '@/utils/axiosInstance';
import { ProblemInfo, ProblemsInfo } from '@/types/problem';
import { useMutation, useQuery } from '@tanstack/react-query';
import { userInfoStore } from '@/store/UserInfo';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';
import { fetchCurrentUserInfo } from '@/utils/fetchCurrentUserInfo';
import { UserInfo } from '@/types/user';
import { OPERATOR_ROLES } from '@/constants/role';
import { formatDateToYYMMDDHHMM } from '@/utils/formatDate';

// 시험에 등록된 문제 목록 정보 조회 API
const fetchExamProblemsDetailInfo = ({ queryKey }: any) => {
  const eid = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/assignment/${eid}/problems`,
  );
};

// 시험에 등록된 문제 순서 변경 API
const examProblemReorder = ({
  eid,
  params,
}: {
  eid: string;
  params: ProblemInfo[];
}) => {
  const requestBody = {
    problems: params,
  };
  return axiosInstance.patch(
    `${process.env.NEXT_PUBLIC_API_VERSION}/assignment/${eid}/problem/reorder`,
    requestBody,
  );
};

interface DefaultProps {
  params: {
    eid: string;
  };
}

export default function ExamProblems(props: DefaultProps) {
  const eid = props.params.eid;

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['examProblemsDetailInfo', eid],
    queryFn: fetchExamProblemsDetailInfo,
    retry: 0,
  });

  const resData = data?.data.data;
  const examProblemsInfo: ProblemsInfo = resData;

  const examProblemReorderMutation = useMutation({
    mutationFn: examProblemReorder,
    onSuccess: (data) => {
      const resData = data?.data;
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
  const [title, setTitle] = useState('');
  const [problemsInfo, setProblemsInfo] = useState<ProblemInfo[]>([]);

  const timeUntilStart = useCountdownTimer(examProblemsInfo?.testPeriod.start);
  const timeUntilEnd = useCountdownTimer(examProblemsInfo?.testPeriod.end);
  const currentTime = new Date();
  const examStartTime = new Date(examProblemsInfo?.testPeriod.start);
  const examEndTime = new Date(examProblemsInfo?.testPeriod.end);

  const [
    isChagingExamProblemOrderActivate,
    setIsChangingExamProblemOrderActivate,
  ] = useState(false);

  const changingProblemOrderBtnRef = useRef<HTMLButtonElement>(null);

  const router = useRouter();

  useEffect(() => {
    if (examProblemsInfo) {
      setTitle(examProblemsInfo.title);
      setProblemsInfo(examProblemsInfo.problems);
    }
  }, [examProblemsInfo]);

  useEffect(() => {
    // (로그인 한) 사용자 정보 조회 및 관리자 권한 확인, 그리고 게시글 작성자인지 확인
    fetchCurrentUserInfo(updateUserInfo).then((userInfo: UserInfo) => {
      if (examProblemsInfo) {
        const isWriter = examProblemsInfo.writer._id === userInfo._id;
        const isOperator = OPERATOR_ROLES.includes(userInfo.role);
        const isContestant = examProblemsInfo.students.some(
          (student_id) => student_id === userInfo._id,
        );

        if (isWriter) {
          setIsLoading(false);
          return;
        }

        if (
          isContestant &&
          examStartTime <= currentTime &&
          currentTime < examEndTime
        ) {
          setIsLoading(false);
          return;
        }

        if (isOperator && currentTime > examEndTime) {
          setIsLoading(false);
          return;
        }

        alert('접근 권한이 없습니다.');
        router.back();
      }
    });
  }, [updateUserInfo, examProblemsInfo, router]);

  // 시험 시간 표시에 사용할 클래스를 결정하는 함수
  const getTimeDisplayClass = () => {
    if (currentTime < examStartTime) {
      // 시험 시작 전
      return 'text-blue-500';
    } else if (currentTime >= examStartTime && currentTime < examEndTime) {
      // 시험 진행 중
      return 'text-red-500';
    }
  };

  // 시험 시작까지 남은 시간 또는 시험 종료까지 남은 시간을 표시하는 함수
  const renderRemainingTime = () => {
    if (currentTime < examStartTime) {
      // 시험 시작 전: 시험 시작까지 남은 시간 표시
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
    } else if (currentTime >= examStartTime && currentTime < examEndTime) {
      // 시험 진행 중: 시험 종료까지 남은 시간 표시
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

    if (examProblemsInfo.problems.length <= 2) {
      alert('문제가 2개 이상 등록된 경우에 문제의 순서를 변경할 수 있습니다.');
      return;
    }

    setIsChangingExamProblemOrderActivate((prev) => !prev);
    if (isChagingExamProblemOrderActivate) {
      examProblemReorderMutation.mutate({ eid, params: problemsInfo });
    }
  };

  const handleRegisterExamProblem = () => {
    router.push(`/exams/${eid}/problems/register`);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="mt-6 mb-24 px-5 2lg:px-0 overflow-x-auto">
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
                href={`/exams/${eid}`}
                className="mt-1 ml-2 3md:ml-1 text-xl font-medium cursor-pointer hover:underline hover:text-[#0038a8] focus:underline focus:text-[#0038a8] text-[#1048b8]"
              >
                (시험: {title})
              </Link>
            </div>
          </p>

          <div className="flex flex-col 3md:flex-row justify-between pb-3 border-b border-gray-300">
            <div className="flex flex-col 3md:flex-row gap-2">
              {!isChagingExamProblemOrderActivate && (
                <>
                  {OPERATOR_ROLES.includes(userInfo.role) &&
                    userInfo._id === examProblemsInfo.writer._id &&
                    currentTime < examEndTime && (
                      <button
                        onClick={handleRegisterExamProblem}
                        className="flex justify-center items-center gap-[0.375rem] text-sm text-[#f9fafb] bg-green-500 px-2 py-[0.45rem] rounded-[6px] font-medium focus:bg-[#3e9368] hover:bg-[#3e9368]"
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
                userInfo._id === examProblemsInfo.writer._id &&
                currentTime < examEndTime && (
                  <button
                    onClick={handleChangeProblemOrder}
                    ref={changingProblemOrderBtnRef}
                    className="flex justify-center items-center gap-[0.375rem] text-sm text-[#f9fafb] bg-[#ff5fb1] px-2 py-[0.45rem] rounded-[6px] font-medium focus:bg-[#f555a8] hover:bg-[#f555a8]"
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
                    {isChagingExamProblemOrderActivate ? (
                      <>저장하기</>
                    ) : (
                      <>순서 변경</>
                    )}
                  </button>
                )}
            </div>

            <div className="mt-3">
              <span className="font-semibold">
                시험 시간:{' '}
                <span className="font-light">
                  {formatDateToYYMMDDHHMM(examProblemsInfo.testPeriod.start)} ~{' '}
                  {formatDateToYYMMDDHHMM(examProblemsInfo.testPeriod.end)}{' '}
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
                  <ExamProblemList
                    eid={eid}
                    isChagingExamProblemOrderActivate={
                      isChagingExamProblemOrderActivate
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
