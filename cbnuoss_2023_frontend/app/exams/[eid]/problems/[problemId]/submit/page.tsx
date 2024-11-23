'use client';

import MyDropzone from '@/app/components/MyDropzone';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import codeImg from '@/public/images/code.png';
import axiosInstance from '@/utils/axiosInstance';
import { SubmitCode } from '@/types/submit';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ProblemInfo } from '@/types/problem';
import { userInfoStore } from '@/store/UserInfo';
import { fetchCurrentUserInfo } from '@/utils/fetchCurrentUserInfo';
import { UserInfo } from '@/types/user';
import { OPERATOR_ROLES } from '@/constants/role';
import SubmitExamProblemCodePageLoadingSkeleton from './components/SubmitExamProblemCodePageLoadingSkeleton';

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

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['examProblemDetailInfo', problemId],
    queryFn: fetchExamProblemDetailInfo,
    retry: 0,
  });

  const submitCodeMutation = useMutation({
    mutationFn: submitCode,
    onSuccess: (data) => {
      const resData = data?.data;
      const httpStatusCode = resData.status;

      switch (httpStatusCode) {
        case 200:
          alert('소스코드가 제출되었습니다.');
          router.push(`/exams/${eid}/problems/${problemId}/submits`);
          break;
        default:
          alert('정의되지 않은 http status code입니다');
      }
    },
  });

  const resData = data?.data.data;
  const examProblemInfo: ProblemInfo = resData;

  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmitLanguage, setSelectedSubmitLanguage] =
    useState('언어 선택 *');
  const [uploadedCodeFileUrl, setUploadedCodeFileUrl] = useState('');

  const [
    isSelectedSubmitLanguageValidFail,
    setIsSelectedSubmitLanguageValidFail,
  ] = useState(false);
  const [isCodeFileUploadingValidFail, setIsCodeFileUploadingValidFail] =
    useState(false);

  const currentTime = new Date();
  const examStartTime = new Date(examProblemInfo?.parentId.testPeriod.start);
  const examEndTime = new Date(examProblemInfo?.parentId.testPeriod.end);

  const router = useRouter();

  const handleGoToExamProblem = () => {
    router.push(`/exams/${eid}/problems/${problemId}`);
  };

  const handlSelectSubmitLanguage = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedSubmitLanguage(e.target.value);
    setIsSelectedSubmitLanguageValidFail(false);
  };

  const handleSubmitExamProblemCode = () => {
    if (selectedSubmitLanguage === '언어 선택 *') {
      alert('제출 언어를 선택해 주세요');
      window.scrollTo(0, 0);
      setIsSelectedSubmitLanguageValidFail(true);
      return;
    }

    if (!isCodeFileUploadingValidFail) {
      alert('소스 코드 파일을 업로드해 주세요');
      window.scrollTo(0, 0);
      return;
    }

    const submitCodeData = {
      parentId: eid,
      parentType: 'Assignment',
      problem: problemId,
      source: uploadedCodeFileUrl,
      language: selectedSubmitLanguage.toLowerCase(),
    };

    submitCodeMutation.mutate({ problemId, params: submitCodeData });
  };

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

        alert('접근 권한이 없습니다.');
        router.back();
      }
    });
  }, [updateUserInfo, examProblemInfo, eid, router]);

  if (isLoading) return <SubmitExamProblemCodePageLoadingSkeleton />;

  return (
    <div className="mt-2 mb-24 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[60rem] mx-auto">
        <div className="flex flex-col gap-8">
          <p className="flex items-center text-2xl font-bold tracking-tight">
            <Image
              src={codeImg}
              alt="trophy"
              width={70}
              height={0}
              quality={100}
              className="ml-[-1rem fade-in-fast drop-shadow-lg"
            />
            <div className="lift-up">
              <span className="ml-4 text-3xl font-semibold tracking-wide">
                코드 제출
              </span>
              <Link
                href={`/exams/${eid}/problems/${problemId}`}
                className="mt-1 ml-1 text-xl font-medium cursor-pointer hover:underline hover:text-[#0038a8] focus:underline focus:text-[#0038a8] text-[#1048b8]"
              >
                ({examProblemInfo.title})
              </Link>
            </div>
          </p>
          <div className="flex justify-between pb-3 border-b border-gray-300">
            <div className="flex gap-3">
              <span className="font-semibold">
                시간 제한:
                <span className="font-mono font-light">
                  {' '}
                  <span>{examProblemInfo.options.maxRealTime / 1000}</span>초
                </span>
              </span>
              <span className='relative bottom-[0.055rem] font-thin before:content-["|"]' />
              <span className="font-semibold">
                메모리 제한:
                <span className="font-mono font-light">
                  {' '}
                  {examProblemInfo.options.maxMemory}
                </span>
                MB
              </span>
            </div>
            <div className="flex gap-3">
              <span className="font-semibold">
                시험명:{' '}
                <span className="font-light">
                  {examProblemInfo.parentId.title}
                </span>
              </span>
              <span className='relative bottom-[0.055rem] font-thin before:content-["|"]' />
              <span className="font-semibold">
                수업명:{' '}
                <span className="font-light">
                  {examProblemInfo.parentId.course}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 mt-8 pb-5">
          <div className="w-1/2">
            <select
              name="languages"
              id="lang"
              className={`text-sm w-full pl-0 py-1 ${
                isSelectedSubmitLanguageValidFail
                  ? 'text-red-500'
                  : selectedSubmitLanguage === '언어 선택 *' && 'text-gray-500'
              }   bg-transparent border-0 border-b border-${
                isSelectedSubmitLanguageValidFail ? 'red-500' : 'gray-400'
              }  gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-${
                isSelectedSubmitLanguageValidFail ? 'red' : 'blue'
              }-500 peer`}
              value={selectedSubmitLanguage}
              onChange={handlSelectSubmitLanguage}
            >
              <option disabled selected>
                언어 선택 *
              </option>
              <option value="C">C</option>
              <option value="C++">C++</option>
              <option value="Java">Java</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python2">Python2</option>
              <option value="Python3">Python3</option>
              <option value="Kotlin">Kotlin</option>
              <option value="Go">Go</option>
            </select>
            <p
              className={`text-${
                isSelectedSubmitLanguageValidFail ? 'red' : 'gray'
              }-500 text-xs tracking-widest font-light mt-2`}
            >
              제출할 언어를 선택해 주세요
            </p>
          </div>

          <div className="flex flex-col gap-1 mt-5">
            <p className="text-lg">소스 코드 파일</p>
            <MyDropzone
              type="code"
              guideMsg="코드 파일을 이곳에 업로드해 주세요"
              setIsFileUploaded={setIsCodeFileUploadingValidFail}
              isFileUploaded={isCodeFileUploadingValidFail}
              initUrl={''}
              setUploadedFileUrl={setUploadedCodeFileUrl}
            />
          </div>
        </div>

        <div className="mt-5 pb-2 flex justify-end gap-3">
          <button
            onClick={handleGoToExamProblem}
            className="px-4 py-[0.5rem] rounded-[6px] font-light"
          >
            취소
          </button>
          <button
            onClick={handleSubmitExamProblemCode}
            className="text-[#f9fafb] bg-[#3a8af9] px-4 py-[0.5rem] rounded-[6px] focus:bg-[#1c6cdb] hover:bg-[#1c6cdb]"
          >
            제출
          </button>
        </div>
      </div>
    </div>
  );
}
