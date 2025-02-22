'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import paperImg from '@/public/images/paper.png';
import axiosInstance from '@/utils/axiosInstance';
import { SubmitCode } from '@/types/submit';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ProblemInfo } from '@/types/problem';
import { userInfoStore } from '@/store/UserInfo';
import { fetchCurrentUserInfo } from '@/utils/fetchCurrentUserInfo';
import { UserInfo } from '@/types/user';
import { OPERATOR_ROLES } from '@/constants/role';
import SubmitExamProblemCodePageLoadingSkeleton from './components/SubmitExamProblemCodePageLoadingSkeleton';
import SmallLoading from '@/app/components/SmallLoading';
import { ToastInfoStore } from '@/store/ToastInfo';
import ReactCodeMirror from '@uiw/react-codemirror';
import { getCodeExtension } from '@/utils/getCodeSubmitResultTypeDescription';
import { createAndUploadFile } from '@/utils/createAndUploadFile';
import { UploadService } from '@/components/utils/uploadService';
import { submitCodeData } from '@/utils/submitCodeData';

// 문제 정보 조회 API
const fetchExamProblemDetailInfo = ({ queryKey }: any) => {
  const problemId = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/problem/${problemId}`,
  );
};

// 코드 제출 API
const submitCode = ({
  problemId,
  params,
}: {
  problemId: string;
  params: SubmitCode;
}) => {
  return axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_VERSION}/problem/${problemId}/submit`,
    params,
  );
};

interface DefaultProps {
  params: {
    eid: string;
    problemId: string;
  };
}

export default function SubmitExamProblemCode(props: DefaultProps) {
  const eid = props.params.eid;
  const problemId = props.params.problemId;

  const addToast = ToastInfoStore((state) => state.addToast);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['examProblemDetailInfoInSubmit', problemId],
    queryFn: fetchExamProblemDetailInfo,
  });

  const submitCodeMutation = useMutation({
    mutationFn: submitCode,
    onSuccess: (data) => {
      const resData = data?.data;
      const httpStatusCode = resData.status;

      switch (httpStatusCode) {
        case 200:
          router.push(`/exams/${eid}/problems/${problemId}/submits`);
          break;
        default:
          addToast('error', '코드 제출 중에 에러가 발생했어요');
      }
    },
    onError: (error) => {
      console.error('Error submitting code:', error);
      addToast('error', '코드 제출 중에 에러가 발생했어요');
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const resData = data?.data.data;
  const examProblemInfo: ProblemInfo = resData;

  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);

  const [uploadService] = useState(new UploadService()); // UploadService 인스턴스 생성
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmitLanguage, setSelectedSubmitLanguage] =
    useState('언어 선택');
  const [code, setCode] = useState('');
  const [isOpenSubmitLanguageList, setIsOpenSubmitLanguageList] =
    useState(false);

  const [
    isSelectedSubmitLanguageValidFail,
    setIsSelectedSubmitLanguageValidFail,
  ] = useState(false);
  const [isSubmitBtnEnable, setIsSubmitBtnEnable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const examStartTime = new Date(examProblemInfo?.parentId.testPeriod.start);
  const examEndTime = new Date(examProblemInfo?.parentId.testPeriod.end);

  const submitLanguageButtonRef = useRef<HTMLButtonElement>(null);

  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleGoToExamProblem = () => {
    router.push(`/exams/${eid}/problems/${problemId}`);
  };

  const handlSelectSubmitLanguage = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const value = e.currentTarget.getAttribute('value');
    if (value) {
      setSelectedSubmitLanguage(value);
      setIsOpenSubmitLanguageList(false);
      setIsSelectedSubmitLanguageValidFail(false);
    }
  };

  const handleSubmitExamProblemCode = async () => {
    if (isSubmitting) return;

    if (currentTime >= examEndTime) {
      addToast('warning', '종료된 시험이에요');
      router.push(`/exams/${eid}`);
      return;
    }

    setIsSubmitting(true); // 제출 시작

    if (selectedSubmitLanguage === '언어 선택') {
      addToast('warning', '제출 언어를 선택해 주세요');
      window.scrollTo(0, 0);
      setIsSelectedSubmitLanguageValidFail(true);
      return;
    }

    // 코드 입력 확인
    if (!code.trim()) {
      addToast('warning', '코드를 입력해 주세요');
      setIsSubmitting(false);
      return;
    }

    try {
      const uploadedFileUrl = await createAndUploadFile(
        code,
        selectedSubmitLanguage,
        uploadService,
      );

      // parentId 확인
      if (!eid) {
        throw new Error('parentId가 없습니다.');
      }

      await submitCodeData(
        eid, // 올바른 parentId 전달
        'Assignment',
        problemId,
        uploadedFileUrl,
        selectedSubmitLanguage,
        submitCodeMutation,
        addToast,
      );
    } catch (error) {
      addToast('error', '코드 제출 중에 에러가 발생했어요');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (selectedSubmitLanguage !== '언어 선택' && code !== '')
      setIsSubmitBtnEnable(true);
    else setIsSubmitBtnEnable(false);
  }, [selectedSubmitLanguage, code, setIsSubmitBtnEnable]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      submitLanguageButtonRef.current &&
      !submitLanguageButtonRef.current.contains(event.target as Node)
    ) {
      setIsOpenSubmitLanguageList(false);
    }
  }, []);

  const handleEscKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpenSubmitLanguageList(false);
    }
  }, []);

  useEffect(() => {
    if (selectedSubmitLanguage !== '언어 선택' && code !== '')
      setIsSubmitBtnEnable(true);
    else setIsSubmitBtnEnable(false);
  }, [selectedSubmitLanguage, code, setIsSubmitBtnEnable]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpenSubmitLanguageList) return;

      const activeElement = document.activeElement;
      const itemList = document.querySelectorAll('.language-item');
      let currentIndex = Array.prototype.indexOf.call(itemList, activeElement);

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % itemList.length;
        (itemList[nextIndex] as HTMLElement).focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const prevIndex =
          currentIndex === -1
            ? itemList.length - 1 // 처음에 ArrowUp 키를 누를 경우 가장 마지막 항목으로 이동
            : (currentIndex - 1 + itemList.length) % itemList.length;
        (itemList[prevIndex] as HTMLElement).focus();
      }
    },
    [isOpenSubmitLanguageList],
  );

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscKeyPress);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscKeyPress);
    };
  }, [handleClickOutside, handleEscKeyPress]);

  useEffect(() => {
    if (isOpenSubmitLanguageList) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpenSubmitLanguageList, handleKeyDown]);

  useEffect(() => {
    // (로그인 한) 사용자 정보 조회 및 관리자 권한 확인, 그리고 게시글 작성자인지 확인
    fetchCurrentUserInfo(updateUserInfo).then((userInfo: UserInfo) => {
      if (examProblemInfo) {
        const isContestant = examProblemInfo.parentId.students.some(
          (student_id) => student_id === userInfo._id,
        );
        const isNormalUser =
          !OPERATOR_ROLES.includes(userInfo.role) && userInfo.role !== 'staff';

        if (
          isContestant &&
          isNormalUser &&
          examStartTime <= currentTime &&
          currentTime < examEndTime
        ) {
          setIsLoading(false);
          return;
        }

        addToast('warning', '접근 권한이 없어요');
        router.push('/');
      }
    });
  }, [updateUserInfo, examProblemInfo, eid, router, addToast]);

  if (isLoading) return <SubmitExamProblemCodePageLoadingSkeleton />;

  return (
    <div className="mt-4 mb-24 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[21rem] xs:w-[90%] xl:w-[60rem] mx-auto">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col 3md:flex-row items-start 3md:items-center gap-x-2">
            <div className="flex items-center text-2xl font-bold tracking-tight">
              <Image
                src={paperImg}
                alt="paper"
                width={42.5}
                height={0}
                quality={100}
                className="fade-in-fast"
              />

              <div className="lift-up">
                <span className="ml-5 text-2xl font-semibold tracking-wide">
                  코드 제출
                </span>
              </div>
            </div>

            <Link
              href={`/exams/${eid}/problems/${problemId}`}
              className="mt-4 3md:mt-0 lift-up w-fit flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#487fee] bg-[#e8f3ff] px-3 py-1 rounded-full font-semibold hover:bg-[#cee1fc]"
            >
              {examProblemInfo.title}
            </Link>
          </div>

          <div className="flex flex-col 3md:items-center 3md:flex-row pb-3 gap-1 3md:gap-3 border-b border-[#e5e8eb]">
            <span className="font-semibold">
              시간 제한:
              <span className="font-mono font-light">
                &nbsp;
                <span>{examProblemInfo.options.maxRealTime / 1000}</span>초
              </span>
            </span>
            <span className='hidden relative bottom-[0.055rem] font-thin before:content-["|"] 3md:block' />
            <span className="font-semibold">
              메모리 제한:
              <span className="font-mono font-light">
                &nbsp;
                {examProblemInfo.options.maxMemory}
              </span>
              MB
            </span>

            <div className="mt-2 3md:mt-0 flex flex-col 3md:flex-row gap-2 ml-0 3md:ml-auto">
              <span className="w-fit flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-3 py-1 rounded-full font-semibold">
                {examProblemInfo.parentId.title}
              </span>

              <span className="w-fit flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-3 py-1 rounded-full font-semibold">
                {examProblemInfo.parentId.course}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 mt-8 pb-5">
          <div className="w-full relative">
            <button
              onClick={() => setIsOpenSubmitLanguageList(true)}
              ref={submitLanguageButtonRef}
              className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] pl-[0.825rem] pr-3 py-[0.5rem] rounded-[7px] font-medium focus:bg-[#d3d6da] hover:bg-[#d3d6da]"
            >
              {selectedSubmitLanguage}
              <svg
                width={23}
                height={23}
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m11.34 6.96c-.01 0-.02.01-.02.02l-2.95 2.95c-.11.11-.26.17-.42.17s-.31-.06-.42-.17l-2.95-2.95c-.23-.23-.24-.6-.02-.84.23-.23.6-.24.84-.02 0 .01.01.02.02.02l2.53 2.54 2.53-2.54c.23-.23.6-.24.84-.02.23.23.24.6.02.84z"
                  fill="#b0b8c1"
                  fillRule="evenodd"
                ></path>
              </svg>
            </button>

            {isOpenSubmitLanguageList && (
              <div className="absolute top-11 z-50 flex flex-col bg-white window px-[0.375rem] py-2 rounded-[7px]">
                <button
                  onClick={handlSelectSubmitLanguage}
                  className="language-item p-3 pr-7 text-start text-[#4e5968] focus:bg-[#f2f4f6] hover:bg-[#f2f4f6] rounded-[7px] focus:outline-none"
                  value="C"
                >
                  C
                </button>
                <button
                  onClick={handlSelectSubmitLanguage}
                  className="language-item p-3 pr-7 text-start text-[#4e5968] focus:bg-[#f2f4f6] hover:bg-[#f2f4f6] rounded-[7px] focus:outline-none"
                  value="C++"
                >
                  C++
                </button>
                <button
                  onClick={handlSelectSubmitLanguage}
                  className="language-item p-3 pr-7 text-start text-[#4e5968] focus:bg-[#f2f4f6] hover:bg-[#f2f4f6] rounded-[7px] focus:outline-none"
                  value="Java"
                >
                  Java
                </button>
                <button
                  onClick={handlSelectSubmitLanguage}
                  className="language-item p-3 pr-7 text-start text-[#4e5968] focus:bg-[#f2f4f6] hover:bg-[#f2f4f6] rounded-[7px] focus:outline-none"
                  value="JavaScript"
                >
                  JavaScript
                </button>
                <button
                  onClick={handlSelectSubmitLanguage}
                  className="language-item p-3 pr-7 text-start text-[#4e5968] focus:bg-[#f2f4f6] hover:bg-[#f2f4f6] rounded-[7px] focus:outline-none"
                  value="Python2"
                >
                  Python2
                </button>
                <button
                  onClick={handlSelectSubmitLanguage}
                  className="language-item p-3 pr-7 text-start text-[#4e5968] focus:bg-[#f2f4f6] hover:bg-[#f2f4f6] rounded-[7px] focus:outline-none"
                  value="Python3"
                >
                  Python3
                </button>
                <button
                  onClick={handlSelectSubmitLanguage}
                  className="language-item p-3 pr-7 text-start text-[#4e5968] focus:bg-[#f2f4f6] hover:bg-[#f2f4f6] rounded-[7px] focus:outline-none"
                  value="Kotlin"
                >
                  Kotlin
                </button>
                <button
                  onClick={handlSelectSubmitLanguage}
                  className="language-item p-3 pr-7 text-start text-[#4e5968] focus:bg-[#f2f4f6] hover:bg-[#f2f4f6] rounded-[7px] focus:outline-none"
                  value="Go"
                >
                  Go
                </button>
              </div>
            )}

            <p
              className={`${
                isSelectedSubmitLanguageValidFail
                  ? 'text-red-500'
                  : 'text-[#6b7684]'
              } text-[15px] font-light mt-2 flex gap-x-1`}
            >
              <span className="text-base text-[#6b7684] leading-5">*</span>{' '}
              제출할 언어를 선택해 주세요.
            </p>
          </div>

          <div className="flex flex-col gap-1 mt-5">
            <p className="text-lg">소스 코드 파일</p>
            <ReactCodeMirror
              value={code}
              extensions={[getCodeExtension(selectedSubmitLanguage)]}
              onChange={(code) => {
                setCode(code);
              }}
              className="cm border-y"
            />
          </div>
        </div>

        <div className="pb-2 flex justify-end gap-3">
          <button
            onClick={handleGoToExamProblem}
            className="px-4 py-[0.5rem] rounded-[7px] font-light"
          >
            취소
          </button>
          <button
            onClick={handleSubmitExamProblemCode}
            disabled={!isSubmitBtnEnable || isSubmitting}
            className={`${
              isSubmitBtnEnable && !isSubmitting
                ? ' hover:bg-[#1c6cdb]'
                : 'opacity-70'
            } flex justify-center items-center gap-[0.1rem] text-white ${
              isSubmitting ? 'px-[0.725rem]' : 'px-4'
            } py-[0.5rem] rounded-[7px] bg-[#3a8af9]`}
          >
            {isSubmitting && <SmallLoading />}
            제출
          </button>
        </div>
      </div>
    </div>
  );
}
