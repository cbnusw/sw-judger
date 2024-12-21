'use client';

import { OPERATOR_ROLES } from '@/constants/role';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';
import { userInfoStore } from '@/store/UserInfo';
import { ExamInfo } from '@/types/exam';
import { UserInfo } from '@/types/user';
import axiosInstance from '@/utils/axiosInstance';
import { fetchCurrentUserInfo } from '@/utils/fetchCurrentUserInfo';
import { formatDateToYYMMDDHHMM } from '@/utils/formatDate';
import { useMutation, useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import ExamDetailPageLoadingSkeleton from './components/skeleton/ExamDetailPageLoadingSkeleton';
import ExamDetailContentLoadingSkeleton from './components/skeleton/ExamDetailContentLoadingSkeleton';
import { ToastInfoStore } from '@/store/ToastInfo';
import Image from 'next/image';
import normalBellImg from '@/public/images/normal-bell.png';
import alarmImg from '@/public/images/alarm.png';

// 시험 게시글 정보 조회 API
const fetchExamDetailInfo = ({ queryKey }: any) => {
  const eid = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/assignment/${eid}`,
  );
};

// 시험 삭제 API
const deleteExam = (eid: string) => {
  return axiosInstance.delete(
    `${process.env.NEXT_PUBLIC_API_VERSION}/assignment/${eid}`,
  );
};

// 시험 참가 신청 API
const enrollExam = (eid: string) => {
  return axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_VERSION}/assignment/${eid}/enroll`,
  );
};

// 시험 참가 신청 취소 API
const unEnrollExam = (eid: string) => {
  return axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_VERSION}/assignment/${eid}/unenroll`,
  );
};

interface DefaultProps {
  params: {
    eid: string;
  };
}

const MarkdownPreview = dynamic(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false, loading: () => <ExamDetailContentLoadingSkeleton /> },
);

export default function ExamDetail(props: DefaultProps) {
  const eid = props.params.eid;

  const addToast = ToastInfoStore((state) => state.addToast);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['examDetailInfo', eid],
    queryFn: fetchExamDetailInfo,
    retry: 0,
  });

  const deleteExamMutation = useMutation({
    mutationFn: deleteExam,
    onSuccess: (data) => {
      const resData = data?.data;
      const httpStatusCode = resData.status;

      switch (httpStatusCode) {
        case 200:
          addToast('success', '시험이 삭제되었어요.');
          router.push('/exams');
          break;
        default:
          addToast('error', '삭제 중에 에러가 발생했어요.');
      }
    },
  });

  const enrollExamMutation = useMutation({
    mutationFn: enrollExam,
    onSuccess: (data) => {
      const resData = data?.data;
      const httpStatusCode = resData.status;

      switch (httpStatusCode) {
        case 200:
          setIsEnrollExam(true);
          addToast('success', '신청이 완료되었어요.');
          break;
        default:
          addToast('error', '신청 중 에러가 발생했어요.');
      }
    },
  });

  const unErollExamMutation = useMutation({
    mutationFn: unEnrollExam,
    onSuccess: (data) => {
      const resData = data?.data;
      const httpStatusCode = resData.status;

      switch (httpStatusCode) {
        case 200:
          setIsEnrollExam(false);
          addToast('success', '신청이 취소되었어요.');
          break;
        default:
          addToast('error', '취소 중에 에러가 발생했어요.');
      }
    },
  });

  const userInfo = userInfoStore((state: any) => state.userInfo);
  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);

  const resData = data?.data.data;
  const examInfo: ExamInfo = resData;

  const [isEnrollExam, setIsEnrollExam] = useState(false);
  const [loadingDots, setLoadingDots] = useState('');
  const [isConfirmPassword, setIsConfirmPassword] = useState(false);

  const timeUntilStart = useCountdownTimer(examInfo?.testPeriod.start);
  const timeUntilEnd = useCountdownTimer(examInfo?.testPeriod.end);
  const currentTime = new Date();
  const examStartTime = new Date(examInfo?.testPeriod.start);
  const examEndTime = new Date(examInfo?.testPeriod.end);

  const router = useRouter();

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
          className={`w-fit flex justify-center items-center gap-2 text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-3 py-1 rounded-full font-semibold`}
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

  // "코드 제출 목록" 버튼의 렌더링 조건을 설정
  const shouldShowSubmitsButton = () => {
    // 대회 게시글 작성자인 경우, 언제든지 버튼 보임
    if (userInfo._id === examInfo.writer._id) {
      return true;
    }

    // 관리자 사용자의 경우, 대회 종료 시간 이후에만 버튼 보임
    if (OPERATOR_ROLES.includes(userInfo.role) && currentTime > examEndTime) {
      return true;
    }
  };

  // "문제 목록" 버튼의 렌더링 조건을 설정
  const shouldShowProblemsButton = () => {
    // 대회 게시글 작성자인 경우, 언제든지 버튼 보임
    if (userInfo._id === examInfo.writer._id) {
      return true;
    }

    // 관리자 사용자의 경우, 대회 종료 시간 이후에만 버튼 보임
    if (OPERATOR_ROLES.includes(userInfo.role) && currentTime > examEndTime) {
      return true;
    }

    // 대회 신청자인 경우, 대회 시간 중에만 버튼 보임
    if (
      isEnrollExam &&
      currentTime >= examStartTime &&
      currentTime < examEndTime
    ) {
      return true;
    }

    return false;
  };

  const handleGoToExamSubmits = () => {
    router.push(`/exams/${eid}/submits`);
  };

  const handleGoToExamProblems = () => {
    router.push(`/exams/${eid}/problems`);
  };

  const handleEditExam = () => {
    router.push(`/exams/${eid}/edit`);
  };

  const handleDeleteExam = () => {
    const userResponse = confirm(
      '시험을 삭제하시겠습니까?\n삭제 후 내용을 되돌릴 수 없습니다.',
    );
    if (!userResponse) return;

    if (currentTime >= examStartTime) {
      addToast('warning', '시험 시작 후에는 삭제할 수 없어요.');
      return;
    }

    deleteExamMutation.mutate(eid);
  };

  const handleEnrollExam = () => {
    const userResponse = confirm('시험에 응시하시겠습니까?');
    if (!userResponse) return;

    enrollExamMutation.mutate(eid);
  };

  // 시험 신청 여부 확인
  const isUserContestant = useCallback(() => {
    return examInfo.students.some(
      (contestant) => contestant._id === userInfo._id,
    );
  }, [examInfo, userInfo]);

  useEffect(() => {
    if (examInfo && examInfo.students && userInfo)
      setIsEnrollExam(isUserContestant());
  }, [examInfo, userInfo, isUserContestant]);

  const handleUnEnrollExam = () => {
    const userResponse = confirm(
      '시험 응시를 취소하시겠습니까?\n시험 시작 이후에는 다시 신청할 수 없습니다.',
    );
    if (!userResponse) return;

    unErollExamMutation.mutate(eid);
  };

  // 시험 상태에 따른 버튼 렌더링
  const renderExamActionButton = () => {
    if (currentTime < examStartTime) {
      // 시험 시작 전
      if (isEnrollExam) {
        // 사용자가 시험에 이미 신청했다면 '시험 취소하기' 버튼을 보여줍니다.
        return (
          <button
            onClick={handleUnEnrollExam}
            className="flex gap-[0.6rem] items-center w-fit h-11 text-[#3870e0] text-lg font-medium border-[1.5px] border-[#3870e0] px-4 py-[0.5rem] rounded-[3rem] box-shadow transition duration-75"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="25"
              viewBox="0 -960 960 960"
              width="25"
              fill="#3870e0"
            >
              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
            </svg>
            시험 취소하기
          </button>
        );
      }

      // 사용자가 시험을 신청하지 않았다면 '시험 응시하기' 버튼을 보여줍니다.
      return (
        <button
          onClick={handleEnrollExam}
          className="flex gap-[0.6rem] items-center w-fit h-11 text-white text-lg font-medium bg-[#3870e0] px-4 py-[0.5rem] rounded-[3rem] focus:bg-[#3464c2] hover:bg-[#3464c2] transition duration-75"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="25"
            viewBox="0 -960 960 960"
            width="25"
            fill="white"
          >
            <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
          </svg>
          시험 응시하기
        </button>
      );
    } else if (currentTime >= examStartTime && currentTime < examEndTime) {
      // 시험 진행 중
      if (isEnrollExam) {
        return (
          <div className="flex gap-[0.6rem] justify-center items-center w-[9rem] h-11 text-[#3870e0] text-lg font-medium border-[1.5px] border-[#3870e0] py-[0.5rem] rounded-[3rem]">
            시험 진행 중
            <span className="w-1 ml-[-0.6rem] text-[#3870e0]">
              {loadingDots}
            </span>
          </div>
        );
      }

      // 사용자가 시험을 신청하지 않았다면 '시험 응시하기' 버튼을 보여줍니다.
      return (
        <button
          onClick={handleEnrollExam}
          className="flex gap-[0.6rem] items-center w-fit h-11 text-white text-lg font-medium bg-[#3870e0] px-4 py-[0.5rem] rounded-[3rem] focus:bg-[#3464c2] hover:bg-[#3464c2] transition duration-75"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="25"
            viewBox="0 -960 960 960"
            width="25"
            fill="white"
          >
            <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
          </svg>
          시험 응시하기
        </button>
      );
    } else {
      // 시험 종료
      return (
        <div className="flex gap-[0.6rem] items-center w-fit h-11 text-red-500 text-lg font-medium border-[1.5px] border-red-500 px-4 py-[0.5rem] rounded-[3rem]">
          시험 종료
        </div>
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        addToast('success', '링크가 복사됐어요');
      })
      .catch(() => {
        alert('복사에 실패했습니다.');
      });
  };

  useEffect(() => {
    fetchCurrentUserInfo(updateUserInfo).then((userInfo: UserInfo) => {
      if (examInfo) {
        // 현재 사용자가 시험 작성자이거나 이미 시험에 등록된 참가자인지 확인
        const isWriter = examInfo.writer._id === userInfo._id;
        const isOperator = OPERATOR_ROLES.includes(userInfo.role);
        const isContestant = examInfo.students.some(
          (student) => student._id === userInfo._id,
        );

        if (isWriter || isOperator || isContestant) {
          setIsConfirmPassword(true);
          return;
        }

        const inputPassword = prompt('비밀번호를 입력해 주세요');
        if (inputPassword !== null && examInfo.password === inputPassword) {
          setIsConfirmPassword(true);
          return;
        }

        addToast('warning', '비밀번호가 일치하지 않아요.');
        router.back();
      }
    });
  }, [updateUserInfo, router, examInfo]);

  if (!isConfirmPassword || isPending) return <ExamDetailPageLoadingSkeleton />;

  return (
    <div className="mt-6 mb-24 px-1 pb-1 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[21rem] xs:w-[90%] xl:w-[72.5%] mx-auto">
        <div className="flex flex-col gap-8">
          <div className="flex gap-x-2 items-center">
            <p className="text-2xl font-bold tracking-tight">
              {examInfo.title}
            </p>
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
          <div className="h-fit 3md:h-[2rem] flex flex-col 3md:items-center 3md:flex-row pb-3 gap-1 3md:gap-3 border-b border-gray-300">
            <span className="font-semibold">
              <span className="3md:hidden text-gray-500">•&nbsp;</span>
              시험 시간:&nbsp;
              <span className="font-light">
                {formatDateToYYMMDDHHMM(examInfo.testPeriod.start)} ~&nbsp;
                {formatDateToYYMMDDHHMM(examInfo.testPeriod.end)}&nbsp;
              </span>
            </span>
            <span className="ml-0 font-semibold 3md:ml-auto">
              <span className="3md:hidden text-gray-500">•&nbsp;</span>
              수업명: <span className="font-light">{examInfo.course}</span>
            </span>
            <span className='hidden relative bottom-[0.055rem] font-thin before:content-["|"] 3md:block' />
            <span className="font-semibold">
              <span className="3md:hidden text-gray-500">•&nbsp;</span>
              작성자: <span className="font-light">{examInfo.writer.name}</span>
            </span>
          </div>
        </div>
        <div className="border-b mt-8 mb-4 pb-5">
          <MarkdownPreview
            className="markdown-preview"
            source={examInfo.content}
          />
        </div>

        <div className="flex justify-between flex-col 3md:flex-row gap-2">
          <div className="flex gap-2 flex-col 3md:flex-row">
            <button
              onClick={() => {
                copyToClipboard(window.location.href);
              }}
              className="flex justify-center items-center gap-x-[0.375rem] bg-[#f2f4f6] 3md:bg-white hover:bg-[#dbe0e5] rounded-[7px] px-3 py-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
              >
                <g fill="#8d95a0" fillRule="evenodd">
                  <path d="M21.316 2.684a6.098 6.098 0 00-8.614 0l-2.053 2.052a1.101 1.101 0 001.556 1.556l2.053-2.052a3.895 3.895 0 015.502 0 3.865 3.865 0 011.14 2.751 3.864 3.864 0 01-1.14 2.751l-3.601 3.601c-1.469 1.47-4.032 1.47-5.502 0a3.894 3.894 0 01-.625-.814 1.1 1.1 0 00-1.908 1.096c.267.463.595.892.977 1.274a6.054 6.054 0 004.307 1.784 6.052 6.052 0 004.307-1.784l3.601-3.6A6.054 6.054 0 0023.1 6.99a6.052 6.052 0 00-1.784-4.307"></path>
                  <path d="M11.795 17.708l-2.053 2.053a3.897 3.897 0 01-5.502 0A3.87 3.87 0 013.1 17.01c0-1.039.405-2.016 1.14-2.75l3.601-3.602a3.895 3.895 0 016.127.814 1.1 1.1 0 101.908-1.096 6.099 6.099 0 00-9.591-1.274l-3.601 3.601A6.054 6.054 0 00.9 17.01c0 1.627.634 3.157 1.784 4.307a6.066 6.066 0 004.307 1.781c1.56 0 3.119-.594 4.307-1.78l2.053-2.053a1.101 1.101 0 00-1.556-1.556"></path>
                </g>
              </svg>
              <span className="text-[#4e5968] font-medium">공유</span>
            </button>
          </div>

          <div className="flex gap-2 flex-col 3md:flex-row">
            {shouldShowSubmitsButton() && (
              <button
                onClick={handleGoToExamSubmits}
                className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-4 py-[0.5rem] rounded-[7px] font-medium  hover:bg-[#d3d6da]"
              >
                코드 제출 목록
              </button>
            )}
            {shouldShowProblemsButton() && (
              <button
                onClick={handleGoToExamProblems}
                className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-4 py-[0.5rem] rounded-[7px] font-medium  hover:bg-[#d3d6da]"
              >
                문제 목록
              </button>
            )}

            {OPERATOR_ROLES.includes(userInfo.role) &&
              userInfo._id === examInfo.writer._id && (
                <>
                  <button
                    onClick={handleEditExam}
                    className="3md:ml-4 3md:mt-0 ml-0 mt-4 flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-4 py-[0.5rem] rounded-[7px] font-medium  hover:bg-[#d3d6da]"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDeleteExam}
                    className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#de5257] bg-[#fcefee] px-4 py-[0.5rem] rounded-[7px] font-medium hover:bg-[#f8d6d7]"
                  >
                    삭제
                  </button>
                </>
              )}
          </div>
        </div>

        {userInfo.role === 'student' && (
          <div className="mt-4">
            <p className="text-2xl font-semibold mt-10 ">참여 방법</p>
            <div className="flex flex-col items-center gap-4 mt-4 mx-auto bg-[#fafafa] w-full py-[1.75rem] border border-[#e4e4e4] border-t-2 border-t-gray-400">
              {renderExamActionButton()}
              {isEnrollExam ? (
                <>
                  <div className="flex flex-col gap-1 text-center">
                    <div className="text-[#777] text-xs">
                      시험 시작 전까지만&nbsp;
                      <span className="text-red-500">응시 취소가 가능</span>
                      합니다.
                    </div>
                    <div className="text-[#777] text-xs">
                      비정상적인 이력이 확인될 경우, 서비스 이용이 제한됩니다.
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-1 text-center">
                    <div className="text-[#777] text-xs">
                      시험 시작 후에도&nbsp;
                      <span className="text-blue-500">응시가 가능</span>
                      합니다.
                    </div>
                    <div className="text-[#777] text-xs">
                      시험 응시 전에 반드시 시험 내용을 자세히 읽어주시기
                      바랍니다.
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
