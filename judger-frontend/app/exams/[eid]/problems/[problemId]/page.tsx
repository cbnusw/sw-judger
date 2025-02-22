'use client';

import { OPERATOR_ROLES } from '@/constants/role';
import { userInfoStore } from '@/store/UserInfo';
import { ExampleFile, ProblemInfo } from '@/types/problem';
import { UserInfo } from '@/types/user';
import axiosInstance from '@/utils/axiosInstance';
import { fetchCurrentUserInfo } from '@/utils/fetchCurrentUserInfo';
import { useMutation, useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import ExamProblemDetailPageLoadingSkeleton from './components/skeleton/ExamProblemDetailPageLoadingSkeleton';
import ExamProblemDetailPdfLoadingSkeleton from './components/skeleton/ExamProblemDetailPdfLoadingSkeleton';
import { ToastInfoStore } from '@/store/ToastInfo';

// 문제 정보 조회 API
const fetchExamProblemDetailInfo = ({ queryKey }: any) => {
  const problemId = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/problem/${problemId}`,
  );
};

// 시험 문제 삭제 API
const deleteExamProblem = (problemId: string) => {
  return axiosInstance.delete(
    `${process.env.NEXT_PUBLIC_API_VERSION}/problem/${problemId}`,
  );
};

interface DefaultProps {
  params: {
    eid: string;
    problemId: string;
  };
}

const PDFViewer = dynamic(() => import('@/app/components/PDFViewer'), {
  ssr: false,
  loading: () => <ExamProblemDetailPdfLoadingSkeleton />,
});

export default function ExamProblemDetail(props: DefaultProps) {
  const eid = props.params.eid;
  const problemId = props.params.problemId;

  const addToast = ToastInfoStore((state) => state.addToast);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['examProblemDetailInfo', problemId],
    queryFn: fetchExamProblemDetailInfo,
  });

  const deleteExamMutation = useMutation({
    mutationFn: deleteExamProblem,
    onSuccess: (data) => {
      const resData = data.data;
      const httpStatusCode = resData.status;

      switch (httpStatusCode) {
        case 200:
          addToast('success', '문제가 삭제되었어요');
          router.push(`/exams/${eid}/problems`);
          break;
        default:
          addToast('error', '삭제 중에 에러가 발생했어요');
      }
    },
  });

  const resData = data?.data.data;
  const examProblemInfo: ProblemInfo = resData;

  const userInfo = userInfoStore((state: any) => state.userInfo);
  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);

  const [isLoading, setIsLoading] = useState(true);
  const [isEnrollExam, setIsEnrollExam] = useState(false);
  const [pdfScale, setPdfScale] = useState(0);

  const currentTime = new Date();
  const examStartTime = new Date(examProblemInfo?.parentId.testPeriod.start);
  const examEndTime = new Date(examProblemInfo?.parentId.testPeriod.end);

  const router = useRouter();

  const downloadExampleFile = (problemId: string, fileId: string) => {
    // 정확한 다운로드 URL 형식 생성
    const downloadUrl = `https://swjudgeapi.cbnu.ac.kr/v1/problem/${problemId}/example-files/${fileId}`;

    // 브라우저에서 URL로 이동하여 파일 다운로드
    window.location.href = downloadUrl;
  };

  const handleGoToExamProblems = () => {
    router.push(`/exams/${eid}/problems`);
  };

  const handleGoToUserExamSubmits = () => {
    router.push(`/exams/${eid}/problems/${problemId}/submits`);
  };

  const handleGoToSubmitExamProblemCode = () => {
    router.push(`/exams/${eid}/problems/${problemId}/submit`);
  };

  const handleEditProblem = () => {
    router.push(`/exams/${eid}/problems/${problemId}/edit`);
  };

  const handleDeleteProblem = () => {
    const userResponse = confirm('문제를 삭제하시겠습니까?');
    if (!userResponse) return;

    deleteExamMutation.mutate(problemId);
  };

  // 시험 신청 여부 확인
  const isUserContestant = useCallback(() => {
    return examProblemInfo.parentId.students.some(
      (student_id) => student_id === userInfo._id,
    );
  }, [examProblemInfo, userInfo]);

  useEffect(() => {
    if (examProblemInfo && examProblemInfo.parentId.students && userInfo)
      setIsEnrollExam(isUserContestant());
  }, [examProblemInfo, userInfo, isUserContestant]);

  useEffect(() => {
    // (로그인 한) 사용자 정보 조회 및 관리자 권한 확인, 그리고 게시글 작성자인지 확인
    fetchCurrentUserInfo(updateUserInfo).then((userInfo: UserInfo) => {
      if (examProblemInfo) {
        const isWriter = examProblemInfo.writer._id === userInfo._id;
        const isOperator = OPERATOR_ROLES.includes(userInfo.role);
        const isContestant = examProblemInfo.parentId.students.some(
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
  }, [updateUserInfo, examProblemInfo, eid, router, addToast]);

  if (isLoading) return <ExamProblemDetailPageLoadingSkeleton />;

  return (
    <div className="mt-6 mb-24 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[21rem] xs:w-[90%] xl:w-[60rem] mx-auto">
        <div className="flex flex-col gap-8">
          <p className="text-2xl font-extrabold tracking-tight">
            {examProblemInfo.title}
          </p>

          <div className="mt-1 p-3 flex flex-col 3md:items-center 3md:flex-row gap-2 text-[14px] border-y-[1.25px] border-[#d1d6db] bg-[#f6f7f9]">
            <div className="flex flex-col 3md:flex-row gap-2 3md:gap-2">
              <span className="font-semibold">
                <span className="rounded-full bg-[#eaecef] px-2 py-1">
                  시간 제한
                </span>
                <span className="ml-2 font-mono font-normal">
                  <span>{examProblemInfo.options.maxRealTime / 1000}</span>초
                </span>
              </span>

              <span className='hidden relative bottom-[0.055rem] font-semibold before:content-["・"] 3md:block text-[#8b95a1]' />

              <span className="font-semibold">
                <span className="rounded-full bg-[#eaecef] px-2 py-1">
                  메모리 제한
                </span>
                <span className="font-mono font-light">
                  <span className="ml-2 mr-1 font-mono font-normal">
                    {examProblemInfo.options.maxMemory}
                  </span>
                  MB
                </span>
              </span>
            </div>

            <div className="mt-2 3md:mt-0 flex flex-col 3md:flex-row gap-2 ml-0 3md:ml-auto">
              <span className="ml-0 3md:ml-auto font-medium text-[#8b95a1]">
                {examProblemInfo.parentId.title}
              </span>

              <span className='hidden relative bottom-[0.055rem] font-semibold before:content-["・"] 3md:block text-[#8b95a1]' />

              <span className="ml-0 3md:ml-auto font-medium text-[#8b95a1]">
                {examProblemInfo.parentId.course}
              </span>
            </div>
          </div>
        </div>

        <div className="3md:flex justify-between">
          <div className="flex flex-col 3md:flex-row gap-2 justify-end mt-4 h-fit 3md:order-last">
            <button
              onClick={handleGoToExamProblems}
              className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-4 py-[0.5rem] rounded-[7px] font-semibold  hover:bg-[#d3d6da]"
            >
              문제 목록
            </button>
            {isEnrollExam && userInfo.role !== 'staff' && (
              <>
                <button
                  onClick={handleGoToUserExamSubmits}
                  className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#487fee] bg-[#e8f3ff] px-4 py-[0.5rem] rounded-[7px] font-semibold  hover:bg-[#cee1fc]"
                >
                  내 제출 현황
                </button>
                <button
                  onClick={handleGoToSubmitExamProblemCode}
                  className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-white bg-[#3a8af9] px-4 py-[0.5rem] rounded-[7px] font-semibold  hover:bg-[#1c6cdb]"
                >
                  제출하기
                </button>
              </>
            )}

            {currentTime < examEndTime &&
              userInfo._id === examProblemInfo.writer._id && (
                <>
                  <button
                    onClick={handleEditProblem}
                    className="3md:ml-4 3md:mt-0 ml-0 mt-4 flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-4 py-[0.5rem] rounded-[7px] font-semibold  hover:bg-[#d3d6da]"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDeleteProblem}
                    className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#de5257] bg-[#fcefee] px-4 py-[0.5rem] rounded-[7px] font-semibold hover:bg-[#f8d6d7]"
                  >
                    삭제
                  </button>
                </>
              )}
          </div>

          <div className="mt-7 3md:order-first">
            {examProblemInfo.exampleFiles.length > 0 && (
              <>
                <h4 className="text-base font-semibold">예제 파일 다운로드</h4>
                <div className="mt-3 grid grid-cols-1 3xs:grid-cols-2 lg:grid-cols-3 gap-3">
                  {examProblemInfo.exampleFiles.map(
                    (exampleFile: ExampleFile, index: number) => (
                      <button
                        key={index}
                        onClick={() =>
                          downloadExampleFile(exampleFile.ref, exampleFile._id)
                        }
                        className="flex gap-[0.375rem] download-exmaple-file-btn rounded-[0.375rem] py-[0.6rem] px-[1rem] group"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="22.5px"
                          viewBox="0 -960 960 960"
                          width="22.5px"
                          fill="#5f6368"
                          className="group-hover:fill-[#0056b3]"
                        >
                          <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                        </svg>
                        <span className="text-[#4e5968] group-hover:text-[#0056b3] font-bold">
                          {exampleFile.filename}
                        </span>
                      </button>
                    ),
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="gap-5 border-b my-4 pb-5">
          <PDFViewer pdfFileURL={examProblemInfo.content} pdfScale={pdfScale} />
        </div>
      </div>

      <div className="fixed right-7 bottom-7 z-10 flex flex-col gap-y-2">
        <button
          onClick={() => {
            setPdfScale((prev) => prev + 0.1);
          }}
          className="zoom-btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="30px"
            viewBox="0 -960 960 960"
            width="30px"
            fill="#434343"
          >
            <path d="M450-450H250q-12.75 0-21.37-8.63-8.63-8.63-8.63-21.38 0-12.76 8.63-21.37Q237.25-510 250-510h200v-200q0-12.75 8.63-21.37 8.63-8.63 21.38-8.63 12.76 0 21.37 8.63Q510-722.75 510-710v200h200q12.75 0 21.37 8.63 8.63 8.63 8.63 21.38 0 12.76-8.63 21.37Q722.75-450 710-450H510v200q0 12.75-8.63 21.37-8.63 8.63-21.38 8.63-12.76 0-21.37-8.63Q450-237.25 450-250v-200Z" />
          </svg>
        </button>
        <button
          onClick={() => {
            setPdfScale((prev) => prev - 0.1);
          }}
          className="zoom-btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="30px"
            viewBox="0 -960 960 960"
            width="30px"
            fill="#434343"
          >
            <path d="M250-450q-12.75 0-21.37-8.63-8.63-8.63-8.63-21.38 0-12.76 8.63-21.37Q237.25-510 250-510h460q12.75 0 21.37 8.63 8.63 8.63 8.63 21.38 0 12.76-8.63 21.37Q722.75-450 710-450H250Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
