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
          alert('시험이 삭제되었습니다.');
          router.push('/exams');
          break;
        default:
          alert('정의되지 않은 http status code입니다');
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
          alert(
            '시험 응시가 완료되었습니다.\n시험 시간을 확인한 후, 해당 시간에 시작해 주세요',
          );
          break;
        default:
          alert('정의되지 않은 http status code입니다');
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
          alert('시험 응시가 취소되었습니다.');
          break;
        default:
          alert('정의되지 않은 http status code입니다');
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

        alert('비밀번호가 일치하지 않습니다.');
        router.back();
      }
    });
  }, [updateUserInfo, router, examInfo]);

  if (!isConfirmPassword || isPending) return <ExamDetailPageLoadingSkeleton />;

  return (
    <div className="mt-6 mb-24 px-1 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[21rem] xs:w-[90%] xl:w-[72.5%] mx-auto">
        <div className="flex flex-col gap-8">
          <p className="text-2xl font-bold tracking-tight">{examInfo.title}</p>
          <div className="flex flex-col 3md:flex-row pb-3 gap-1 3md:gap-3 border-b border-gray-300">
            <span className="font-semibold">
              <span className="3md:hidden text-gray-500">• </span>
              시험 시간:{' '}
              <span className="font-light">
                {formatDateToYYMMDDHHMM(examInfo.testPeriod.start)} ~{' '}
                {formatDateToYYMMDDHHMM(examInfo.testPeriod.end)}{' '}
                {timeUntilEnd?.isPast ? (
                  <span className="text-red-500 font-bold">(종료)</span>
                ) : (
                  renderRemainingTime()
                )}
              </span>
            </span>
            <span className="ml-0 font-semibold 3md:ml-auto">
              <span className="3md:hidden text-gray-500">• </span>
              수업명: <span className="font-light">{examInfo.course}</span>
            </span>
            <span className='hidden relative bottom-[0.055rem] font-thin before:content-["|"] 3md:block' />
            <span className="font-semibold">
              <span className="3md:hidden text-gray-500">• </span>
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
        <div>
          <div className="flex flex-col 3md:flex-row gap-2 justify-end">
            {shouldShowSubmitsButton() && (
              <button
                onClick={handleGoToExamSubmits}
                className="flex justify-center items-center gap-[0.375rem] text-sm text-[#f9fafb] bg-[#6860ff] px-2 py-[0.45rem] rounded-[6px] font-medium focus:bg-[#5951f0] hover:bg-[#5951f0]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20"
                  viewBox="0 -960 960 960"
                  width="20"
                  fill="white"
                >
                  <path d="M320-242 80-482l242-242 43 43-199 199 197 197-43 43Zm318 2-43-43 199-199-197-197 43-43 240 240-242 242Z" />
                </svg>
                코드 제출 목록
              </button>
            )}
            {shouldShowProblemsButton() && (
              <button
                onClick={handleGoToExamProblems}
                className="flex justify-center items-center gap-[0.375rem] text-sm text-[#f9fafb] bg-green-500 px-2 py-[0.45rem] rounded-[6px] font-medium focus:bg-[#3e9368] hover:bg-[#3e9368]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="18"
                  viewBox="0 -960 960 960"
                  width="18"
                  fill="white"
                >
                  <path d="M319-250h322v-60H319v60Zm0-170h322v-60H319v60ZM220-80q-24 0-42-18t-18-42v-680q0-24 18-42t42-18h361l219 219v521q0 24-18 42t-42 18H220Zm331-554h189L551-820v186Z" />
                </svg>
                문제 목록
              </button>
            )}

            {OPERATOR_ROLES.includes(userInfo.role) &&
              userInfo._id === examInfo.writer._id && (
                <>
                  <button
                    onClick={handleEditExam}
                    className="flex justify-center items-center gap-[0.375rem] text-sm text-[#f9fafb] bg-[#eba338] px-2 py-[0.45rem] rounded-[6px] font-medium focus:bg-[#dc9429] hover:bg-[#dc9429]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      viewBox="0 -960 960 960"
                      width="20"
                      fill="white"
                    >
                      <path d="M794-666 666-794l42-42q17-17 42.5-16.5T793-835l43 43q17 17 17 42t-17 42l-42 42Zm-42 42L248-120H120v-128l504-504 128 128Z" />
                    </svg>
                    게시글 수정
                  </button>
                  <button
                    onClick={handleDeleteExam}
                    className="flex justify-center items-center gap-[0.375rem] text-sm text-[#f9fafb] bg-red-500 px-2 py-[0.45rem] rounded-[6px] font-medium focus:bg-[#e14343] hover:bg-[#e14343]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      viewBox="0 -960 960 960"
                      width="20"
                      fill="white"
                    >
                      <path d="m361-299 119-121 120 121 47-48-119-121 119-121-47-48-120 121-119-121-48 48 120 121-120 121 48 48ZM261-120q-24 0-42-18t-18-42v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Z" />
                    </svg>
                    게시글 삭제
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
                      시험 시작 전까지만{' '}
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
                      시험 시작 후에도{' '}
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
