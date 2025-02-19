'use client';

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
import ExamProblemListPageLoadingSkeleton from './components/ExamProblemListPageLoadingSkeleton';
import { ToastInfoStore } from '@/store/ToastInfo';
import normalBellImg from '@/public/images/normal-bell.png';
import alarmImg from '@/public/images/alarm.png';

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

  const addToast = ToastInfoStore((state) => state.addToast);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['examProblemsDetailInfo', eid],
    queryFn: fetchExamProblemsDetailInfo,
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
          addToast('success', '문제 순서가 변경되었어요');
          break;
        default:
          addToast('error', '문제 순서 변경 중에 에러가 발생했어요');
      }
    },
  });

  const userInfo = userInfoStore((state: any) => state.userInfo);
  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);

  const [isLoading, setIsLoading] = useState(true);
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

        addToast('warning', '접근 권한이 없어요');
        router.push('/');
      }
    });
  }, [updateUserInfo, examProblemsInfo, router, addToast]);

  // 시험 시작까지 남은 시간 또는 시험 종료까지 남은 시간을 표시하는 함수
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

    if (currentTime < examStartTime) {
      const formattedTime = formatTime(
        timeUntilStart.days,
        timeUntilStart.hours,
        timeUntilStart.minutes,
        timeUntilStart.seconds,
      );

      if (!formattedTime) return null;

      return (
        <span
          className={`mt-2 3md:mt-0 w-fit flex justify-center items-center gap-2 text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-3 py-1 rounded-full font-semibold`}
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
    } else if (currentTime >= examStartTime && currentTime < examEndTime) {
      const formattedTime = formatTime(
        timeUntilEnd.days,
        timeUntilEnd.hours,
        timeUntilEnd.minutes,
        timeUntilEnd.seconds,
      );

      if (!formattedTime) return null;

      return (
        <span
          className={`mt-2 3md:mt-0 flex justify-center items-center gap-2 text-[0.8rem] text-[#de5257] bg-[#fcefee] px-3 py-1 rounded-full font-semibold`}
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

  const handleChangeProblemOrder = () => {
    changingProblemOrderBtnRef.current?.blur();

    if (examProblemsInfo.problems.length < 2) {
      addToast('warning', '문제를 2개 이상 등록해 주세요');
      return;
    }

    setIsChangingExamProblemOrderActivate((prev) => !prev);
    if (isChagingExamProblemOrderActivate) {
      examProblemReorderMutation.mutate({ eid, params: problemsInfo });
    }
  };

  const handleRegisterMultipleExamProblem = () => {
    router.push(`/exams/${eid}/problems/register/multiple`);
  };

  const handleRegisterExamProblem = () => {
    router.push(`/exams/${eid}/problems/register`);
  };

  if (isLoading) return <ExamProblemListPageLoadingSkeleton />;

  return (
    <div className="mt-4 mb-24 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[21rem] xs:w-[90%] xl:w-[60rem] mx-auto">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col 3md:flex-row items-start 3md:items-center gap-x-2">
            <div className="flex items-center text-2xl font-bold tracking-tight">
              <Image
                src={listImg}
                alt="list"
                width={42.5}
                height={0}
                quality={100}
                className="fade-in-fast"
              />

              <div className="lift-up flex flex-col 3md:flex-row 3md:items-end">
                <span className="ml-4 text-2xl font-bold tracking-wide">
                  문제 목록
                </span>
              </div>
            </div>
            <Link
              href={`/exams/${eid}`}
              className="mt-4 3md:mt-0 lift-up w-fit flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#487fee] bg-[#e8f3ff] px-3 py-1 rounded-full font-bold hover:bg-[#cee1fc]"
            >
              {examProblemsInfo.title}
            </Link>

            <div className="lift-up">
              {timeUntilEnd?.isPast ? (
                <span
                  className={`mt-2 3md:mt-0 w-fit flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#de5257] bg-[#fcefee] px-3 py-1 rounded-full font-semibold`}
                >
                  종료
                </span>
              ) : (
                <>{renderRemainingTime()}</>
              )}
            </div>
          </div>

          <div className="flex flex-col 3md:flex-row justify-between pb-3 border-b border-[#e5e8eb]">
            <div className="flex flex-col 3md:flex-row gap-2">
              {OPERATOR_ROLES.includes(userInfo.role) &&
                userInfo._id === examProblemsInfo.writer._id &&
                currentTime < examStartTime && (
                  <button
                    onClick={handleChangeProblemOrder}
                    ref={changingProblemOrderBtnRef}
                    className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-3 py-[0.5rem] rounded-[7px] font-semibold hover:bg-[#d3d6da]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="23"
                      viewBox="0 -960 960 960"
                      width="23"
                      fill="#4e5968"
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

              {OPERATOR_ROLES.includes(userInfo.role) &&
                userInfo._id === examProblemsInfo.writer._id &&
                currentTime < examStartTime && (
                  <button
                    onClick={handleRegisterMultipleExamProblem}
                    className="flex justify-center items-center gap-x-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-3 py-[0.5rem] rounded-[7px] font-semibold hover:bg-[#d3d6da]"
                  >
                    <svg
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                      <mask id="a" fill="#fff">
                        <path
                          d="m0 0h20v19.9996h-20z"
                          fill="#fff"
                          fillRule="evenodd"
                        ></path>
                      </mask>
                      <g
                        fill="#26a06b"
                        fillRule="evenodd"
                        transform="translate(2 2)"
                      >
                        <path d="m13 14.1719v5.828l7-7h-5.828c-.649 0-1.162.523-1.162 1.162"></path>
                        <path
                          d="m5.918 5.6036 1.971 2.893c.061.381-.228.489-.559.489h-.746c-.321-.016-.379-.033-.585-.4l-1.016-1.865-.013-.015-.013.015-1.016 1.865c-.206.367-.264.384-.585.4h-.746c-.331 0-.62-.108-.559-.489l1.971-2.893.001-.001-.038-.044-1.9-2.82c-.15-.217.122-.517.502-.517h.746c.331 0 .372.043.538.315l1.084 1.926.015.018.015-.018 1.084-1.926c.166-.272.207-.315.538-.315h.746c.38 0 .652.3.503.517l-1.901 2.82-.038.044zm12.9-5.604h-17.636c-.654 0-1.182.528-1.182 1.182v17.647c0 .654.528 1.171 1.172 1.171h10.005v-5.878c0-1.626 1.319-2.945 2.944-2.945h5.879v-9.995c0-.654-.528-1.182-1.182-1.182z"
                          mask="url(#a)"
                        ></path>
                      </g>
                    </svg>
                    한 번에 등록
                  </button>
                )}

              {!isChagingExamProblemOrderActivate && (
                <>
                  {OPERATOR_ROLES.includes(userInfo.role) &&
                    userInfo._id === examProblemsInfo.writer._id &&
                    currentTime < examStartTime && (
                      <button
                        onClick={handleRegisterExamProblem}
                        className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-white bg-[#3a8af9] px-4 py-[0.5rem] rounded-[7px] font-semibold  hover:bg-[#1c6cdb]"
                      >
                        문제 등록
                      </button>
                    )}
                </>
              )}
            </div>
          </div>

          <section className="dark:bg-gray-900">
            <div className="mx-auto w-full">
              <div className="relative overflow-hidden rounded-sm">
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
