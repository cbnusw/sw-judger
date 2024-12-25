'use client';

import { OPERATOR_ROLES } from '@/constants/role';
import Loading from '@/app/components/Loading';
import { userInfoStore } from '@/store/UserInfo';
import { ExamInfo, RegisterExamParams } from '@/types/exam';
import { UserInfo } from '@/types/user';
import axiosInstance from '@/utils/axiosInstance';
import { fetchCurrentUserInfo } from '@/utils/fetchCurrentUserInfo';
import { convertUTCToLocalDateTime, toUTCString } from '@/utils/formatDate';
import { useMutation, useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ToastInfoStore } from '@/store/ToastInfo';

// 시험 게시글 정보 조회 API
const fetchExamDetailInfo = ({ queryKey }: any) => {
  const eid = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/assignment/${eid}`,
  );
};

// 시험 수정 API
const editExam = ({
  eid,
  params,
}: {
  eid: string;
  params: RegisterExamParams;
}) => {
  const { title, course, content, testPeriod, password } = params;
  const reqBody = {
    title,
    course,
    content,
    testPeriod,
    password,
  };

  return axiosInstance.put(
    `${process.env.NEXT_PUBLIC_API_VERSION}/assignment/${eid}`,
    reqBody,
  );
};

interface DefaultProps {
  params: {
    eid: string;
  };
}

const CustomCKEditor = dynamic(() => import('@/components/CustomCKEditor'), {
  ssr: false,
});

export default function EditExam(props: DefaultProps) {
  const eid = props.params.eid;

  const addToast = ToastInfoStore((state) => state.addToast);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['examDetailInfo', eid],
    queryFn: fetchExamDetailInfo,
  });

  const editExamMutation = useMutation({
    mutationFn: editExam,
    onSuccess: (data) => {
      const resData = data?.data;
      const httpStatusCode = resData.status;

      switch (httpStatusCode) {
        case 200:
          addToast('success', '시험 정보가 수정되었어요.');
          router.push(`/exams/${eid}`);
          break;
        default:
          addToast('error', '수정 중에 에러가 발생했어요.');
      }
    },
  });

  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);

  const resData = data?.data.data;
  const examInfo: ExamInfo = resData;

  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [courseName, setCourseName] = useState('');
  const [content, setContent] = useState('');
  const [examStartDateTime, setExamStartDateTime] = useState('');
  const [examEndDateTime, setExamEndDateTime] = useState('');
  const [examPwd, setExamPwd] = useState('');

  const [isExamNameValidFail, setIsExamNameValidFail] = useState(false);
  const [isCourseNameValidFail, setIsCourseNameValidFail] = useState(false);
  const [isExamPwdValidFail, setIsExamPwdValidFail] = useState(false);

  useEffect(() => {
    if (examInfo) {
      setTitle(examInfo.title);
      setCourseName(examInfo.course);
      setContent(examInfo.content);
      setExamStartDateTime(
        convertUTCToLocalDateTime(examInfo.testPeriod.start),
      );
      setExamEndDateTime(convertUTCToLocalDateTime(examInfo.testPeriod.end));
      setExamPwd(examInfo.password);
    }
  }, [examInfo]);

  const examNameRef = useRef<HTMLInputElement>(null);
  const courseNameRef = useRef<HTMLInputElement>(null);
  const examPwdRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const currentDate = new Date().toISOString().slice(0, 16);
  // currentDate.setDate(currentDate.getDate() + 1);

  const handleExamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsExamNameValidFail(false);
  };

  const handleCourseNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCourseName(e.target.value);
    setIsCourseNameValidFail(false);
  };

  const handleExamPwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExamPwd(e.target.value);
    setIsExamPwdValidFail(false);
  };

  const handleCancelExamEdit = () => {
    const userResponse = confirm('시험 수정을 취소하시겠습니까?');
    if (!userResponse) return;

    router.push(`/exams/${eid}`);
  };

  const handleEditExam = () => {
    if (!title) {
      addToast('warning', '시험명을 입력해 주세요.');
      window.scrollTo(0, 0);
      examNameRef.current?.focus();
      setIsExamNameValidFail(true);
      return;
    }

    if (!courseName) {
      addToast('warning', '수업명을 입력해 주세요.');
      window.scrollTo(0, 0);
      courseNameRef.current?.focus();
      setIsCourseNameValidFail(true);
      return;
    }

    if (!content) {
      addToast('warning', '본문을 입력해 주세요.');
      window.scrollTo(0, 0);
      return;
    }

    if (!examStartDateTime || !examEndDateTime) {
      addToast('warning', '시험 시간을 설정해 주세요.');
      return;
    }

    // 시험 시작 시간과 종료 시간의 유효성 검사
    if (examStartDateTime >= examEndDateTime) {
      addToast('warning', '시험 종료 시간은 시작 시간 이후로 설정해 주세요.');
      return;
    }

    if (!examPwd) {
      addToast('warning', '시험 비밀번호를 입력해 주세요.');
      examPwdRef.current?.focus();
      setIsExamPwdValidFail(true);
      return;
    }

    const examData: RegisterExamParams = {
      title,
      course: courseName,
      content,
      testPeriod: {
        start: toUTCString(examStartDateTime),
        end: toUTCString(examEndDateTime),
      },
      password: examPwd,
    };

    editExamMutation.mutate({ eid, params: examData });
  };

  // (로그인 한) 사용자 정보 조회 및 관리자 권한 확인
  useEffect(() => {
    fetchCurrentUserInfo(updateUserInfo).then((userInfo: UserInfo) => {
      if (examInfo) {
        const isWriter = examInfo.writer._id === userInfo._id;

        if (isWriter) {
          setIsLoading(false);
          return;
        }

        addToast('warning', '접근 권한이 없어요.');
        router.push('/');
      }
    });
  }, [updateUserInfo, examInfo, router, addToast]);

  if (isLoading || isPending) return <Loading />;

  return (
    <div className="mt-2 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[21rem] xs:w-[90%] xl:w-[60rem] mx-auto">
        <p className="text-2xl font-semibold">시험 등록</p>
        <div className="flex gap-5 mt-5 mb-8">
          <div className="flex flex-col relative z-0 w-2/5 group">
            <input
              type="text"
              name="floating_first_name"
              className={`block pt-3 pb-[0.175rem] pl-0 pr-0 w-full font-normal text-gray-900 bg-transparent border-0 border-b border-gray-400 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-${
                isExamNameValidFail ? 'pink' : 'blue'
              }-500 focus:border-${
                isExamNameValidFail ? 'red' : 'blue'
              }-500 focus:outline-none focus:ring-0 peer`}
              placeholder=" "
              required
              value={title}
              ref={examNameRef}
              onChange={handleExamNameChange}
            />
            <label
              htmlFor="floating_first_name"
              className={`peer-focus:font-light absolute text-base left-[0.1rem] font-light text-${
                isExamNameValidFail ? 'red' : 'gray'
              }-500  duration-300 transform -translate-y-5 scale-75 top-3 origin-[0] peer-focus:left-[0.1rem] peer-focus:text-${
                isExamNameValidFail ? 'red' : 'blue'
              }-600 peer-focus:dark:text-${
                isExamNameValidFail ? 'red' : 'blue'
              }-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-[1.25rem] z-10`}
            >
              시험명
            </label>
            <p
              className={`text-${
                isExamNameValidFail ? 'red' : 'gray'
              }-500 text-xs font-light mt-1`}
            >
              시험명을 입력해 주세요
            </p>
          </div>

          <div className="flex flex-col relative z-0 w-2/5 group">
            <input
              type="text"
              name="floating_first_name"
              className={`block pt-3 pb-[0.175rem] pl-0 pr-0 w-full font-normal text-gray-900 bg-transparent border-0 border-b border-gray-400 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-${
                isCourseNameValidFail ? 'pink' : 'blue'
              }-500 focus:border-${
                isCourseNameValidFail ? 'red' : 'blue'
              }-500 focus:outline-none focus:ring-0 peer`}
              placeholder=" "
              required
              value={courseName}
              ref={courseNameRef}
              onChange={handleCourseNameChange}
            />
            <label
              htmlFor="floating_first_name"
              className={`peer-focus:font-light absolute text-base left-[0.1rem] font-light text-${
                isCourseNameValidFail ? 'red' : 'gray'
              }-500  duration-300 transform -translate-y-5 scale-75 top-3 origin-[0] peer-focus:left-[0.1rem] peer-focus:text-${
                isCourseNameValidFail ? 'red' : 'blue'
              }-600 peer-focus:dark:text-${
                isCourseNameValidFail ? 'red' : 'blue'
              }-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-[1.25rem] z-10`}
            >
              수업명
            </label>
            <p
              className={`text-${
                isCourseNameValidFail ? 'red' : 'gray'
              }-500 text-xs font-light mt-1`}
            >
              수업명을 입력해 주세요
            </p>
          </div>
        </div>
        <div className="w-full mx-auto overflow-auto">
          <CustomCKEditor
            initEditorContent={content}
            onEditorChange={setContent}
          />
        </div>
        <div className="mt-8">
          <p>시험 시간</p>
          <div className="flex gap-5 items-center mt-2">
            <input
              type="datetime-local"
              id="start-date"
              name="start-date"
              value={examStartDateTime.slice(0, 16)}
              min={currentDate}
              className="text-sm appearance-none border rounded shadow py-[0.375rem] px-2 text-gray-500"
              onChange={(e) => setExamStartDateTime(e.target.value)}
            />
            <span>~</span>
            <input
              type="datetime-local"
              id="end-date"
              name="end-date"
              value={examEndDateTime.slice(0, 16)}
              min={currentDate}
              className="text-sm appearance-none border rounded shadow py-[0.375rem] px-2 text-gray-500"
              onChange={(e) => setExamEndDateTime(e.target.value)}
            />
          </div>

          <div className="flex flex-col mt-10">
            <div className="flex flex-col">
              <div className="flex flex-col">
                <p>비밀번호 설정</p>
                <div className="flex mt-1 ml-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="15"
                    viewBox="0 -960 960 960"
                    width="15"
                    fill="#5762b3"
                    className="relative left-[-1.375rem] top-[0.1rem]"
                  >
                    <path d="M440.667-269.333h83.999V-520h-83.999v250.667Zm39.204-337.333q17.796 0 29.962-11.833Q522-630.332 522-647.824q0-18.809-12.021-30.825-12.021-12.017-29.792-12.017-18.52 0-30.354 11.841Q438-666.984 438-648.508q0 17.908 12.038 29.875 12.038 11.967 29.833 11.967Zm.001 547.999q-87.157 0-163.841-33.353-76.684-33.354-133.671-90.34-56.986-56.987-90.34-133.808-33.353-76.821-33.353-164.165 0-87.359 33.412-164.193 33.413-76.834 90.624-134.057 57.211-57.224 133.757-89.987t163.578-32.763q87.394 0 164.429 32.763 77.034 32.763 134.117 90 57.082 57.237 89.916 134.292 32.833 77.056 32.833 164.49 0 87.433-32.763 163.67-32.763 76.236-89.987 133.308-57.223 57.073-134.261 90.608-77.037 33.535-164.45 33.535Zm.461-83.999q140.18 0 238.59-98.744 98.411-98.744 98.411-238.923 0-140.18-98.286-238.59Q620.763-817.334 480-817.334q-139.846 0-238.59 98.286Q142.666-620.763 142.666-480q0 139.846 98.744 238.59t238.923 98.744ZM480-480Z" />
                  </svg>
                  <p
                    id="helper-checkbox-text"
                    className="relative left-[-0.8rem] text-xs font-normal text-[#5762b3] dark:text-gray-300"
                  >
                    게시글 확인 시 비밀번호 입력이 필요합니다.
                  </p>
                </div>
              </div>

              <div className="flex flex-col relative z-0 w-1/2 group mt-4">
                <input
                  type="text"
                  name="floating_first_name"
                  className={`block pt-3 pb-[0.175rem] pl-0 pr-0 w-full font-normal text-gray-900 bg-transparent border-0 border-b border-gray-400 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-${
                    isExamPwdValidFail ? 'pink' : 'blue'
                  }-500 focus:border-${
                    isExamPwdValidFail ? 'red' : 'blue'
                  }-500 focus:outline-none focus:ring-0 peer`}
                  placeholder=" "
                  required
                  value={examPwd}
                  ref={examPwdRef}
                  onChange={handleExamPwdChange}
                />
                <label
                  htmlFor="floating_first_name"
                  className={`peer-focus:font-light absolute text-base left-[0.1rem] font-light text-${
                    isExamPwdValidFail ? 'red' : 'gray'
                  }-500  duration-300 transform -translate-y-5 scale-75 top-3 origin-[0] peer-focus:left-[0.1rem] peer-focus:text-${
                    isExamPwdValidFail ? 'red' : 'blue'
                  }-600 peer-focus:dark:text-${
                    isExamPwdValidFail ? 'red' : 'blue'
                  }-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-[1.25rem] z-10`}
                >
                  비밀번호
                </label>
              </div>
            </div>
          </div>

          <div className="mt-14 pb-2 flex justify-end gap-2">
            <button
              onClick={handleCancelExamEdit}
              className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-5 py-[0.5rem] rounded-[7px] font-medium  hover:bg-[#d3d6da]"
            >
              취소
            </button>
            <button
              onClick={handleEditExam}
              className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-white bg-[#3a8af9] px-5 py-[0.5rem] rounded-[7px] font-medium  hover:bg-[#1c6cdb]"
            >
              수정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
