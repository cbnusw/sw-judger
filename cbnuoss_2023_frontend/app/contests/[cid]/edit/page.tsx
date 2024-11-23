'use client';

import { OPERATOR_ROLES } from '@/constants/role';
import Loading from '@/app/components/Loading';
import { userInfoStore } from '@/store/UserInfo';
import { ContestInfo, RegisterContestParams } from '@/types/contest';
import { UserInfo } from '@/types/user';
import axiosInstance from '@/utils/axiosInstance';
import { fetchCurrentUserInfo } from '@/utils/fetchCurrentUserInfo';
import { convertUTCToLocalDateTime, toUTCString } from '@/utils/formatDate';
import { useMutation, useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

// 어드민 전용 대회 게시글 정보 조회 API
const fetchContestDetailInfo = ({ queryKey }: any) => {
  const cid = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/contest/admin/${cid}`,
  );
};

// 대회 수정 API
const editContest = ({
  cid,
  params,
}: {
  cid: string;
  params: RegisterContestParams;
}) => {
  return axiosInstance.put(
    `${process.env.NEXT_PUBLIC_API_VERSION}/contest/${cid}`,
    params,
  );
};

interface DefaultProps {
  params: {
    cid: string;
  };
}

const CustomCKEditor = dynamic(() => import('@/components/CustomCKEditor'), {
  ssr: false,
});

export default function EditContest(props: DefaultProps) {
  const cid = props.params.cid;

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['contestDetailInfo', cid],
    queryFn: fetchContestDetailInfo,
    retry: 0,
  });

  const editContestMutation = useMutation({
    mutationFn: editContest,
    onSuccess: (data) => {
      const resData = data.data;
      const httpStatusCode = resData.status;

      switch (httpStatusCode) {
        case 200:
          alert('대회 내용이 수정되었습니다.');
          router.push(`/contests/${cid}`);
          break;
        default:
          alert('정의되지 않은 http status code입니다');
      }
    },
  });

  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);

  const resData = data?.data.data;
  const contestInfo: ContestInfo = resData;

  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contestStartDateTime, setContestStartDateTime] = useState('');
  const [contestEndDateTime, setContestEndDateTime] = useState('');
  const [isCheckedAppliedPeriod, setIsCheckedAppliedPeriod] = useState(false);
  // const [isCheckedUsingContestPwd, setIsCheckedUsingContestPwd] = useState(
  //   contestInfo.isPassword,
  // );
  const [
    isCheckedUsingContestProblemsPwd,
    setIsCheckedUsingContestProblemsPwd,
  ] = useState(false);
  const [contestAppliedStartDateTime, setContestAppliedStartDateTime] =
    useState('');
  const [contestAppliedEndDateTime, setContestAppliedEndDateTime] =
    useState('');
  // const [contestPwd, setContestPwd] = useState(contestInfo.contestPwd);
  const [contestProblemsPwd, setContestProblemsPwd] = useState('');

  const [isContestNameValidFail, setIsContestNameValidFail] = useState(false);
  // const [isContestPwdValidFail, setIsContestPwdValidFail] = useState(false);
  const [isContestProblemsPwdValidFail, setIsContestProblemsPwdValidFail] =
    useState(false);

  useEffect(() => {
    if (contestInfo) {
      setTitle(contestInfo.title);
      setContent(contestInfo.content);
      setContestStartDateTime(
        convertUTCToLocalDateTime(contestInfo.testPeriod.start),
      );
      setContestEndDateTime(
        convertUTCToLocalDateTime(contestInfo.testPeriod.end),
      );
      setIsCheckedAppliedPeriod(!!contestInfo.applyingPeriod?.start);
      setContestAppliedStartDateTime(
        contestInfo.applyingPeriod?.start
          ? convertUTCToLocalDateTime(contestInfo.applyingPeriod.start)
          : '',
      );
      setContestAppliedEndDateTime(
        contestInfo.applyingPeriod?.end
          ? convertUTCToLocalDateTime(contestInfo.applyingPeriod.end)
          : '',
      );
      setIsCheckedUsingContestProblemsPwd(contestInfo.isPassword);
      setContestProblemsPwd(contestInfo.password || '');
    }
  }, [contestInfo]);

  const contestNameRef = useRef<HTMLInputElement>(null);
  // const contestPwdRef = useRef<HTMLInputElement>(null);
  const contestProblemsPwdRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const currentDate = new Date().toISOString().slice(0, 16);
  // currentDate.setDate(currentDate.getDate() + 1);

  const handleContestNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsContestNameValidFail(false);
  };

  // const handleContestPwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setContestPwd(e.target.value);
  //   setIsContestPwdValidFail(false);
  // };

  const handleContestProblemsPwdChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setContestProblemsPwd(e.target.value);
    setIsContestProblemsPwdValidFail(false);
  };

  const handleCancelContestEdit = () => {
    const userResponse = confirm('대회 수정을 취소하시겠습니까?');
    if (!userResponse) return;

    router.push(`/contests/${cid}`);
  };

  const handleEditContest = () => {
    if (!title) {
      alert('대회명을 입력해 주세요');
      window.scrollTo(0, 0);
      contestNameRef.current?.focus();
      setIsContestNameValidFail(true);
      return;
    }

    if (!content) {
      alert('본문을 입력해 주세요');
      window.scrollTo(0, 0);
      return;
    }

    if (!contestStartDateTime || !contestEndDateTime) {
      alert('대회 시간을 설정해 주세요');
      window.scrollTo(0, document.body.scrollHeight);
      return;
    }

    if (!contestProblemsPwd) {
      alert('문제 비밀번호를 입력해 주세요');
      window.scrollTo(0, document.body.scrollHeight);
      contestProblemsPwdRef.current?.focus();
      setIsContestProblemsPwdValidFail(true);
      return;
    }

    if (
      isCheckedAppliedPeriod &&
      (!contestAppliedStartDateTime || !contestAppliedEndDateTime)
    ) {
      alert('신청 기간을 설정해 주세요');
      window.scrollTo(0, document.body.scrollHeight);
      return;
    }

    // if (isCheckedUsingContestPwd && !contestPwd) {
    //   alert('대회 비밀번호를 입력해 주세요');
    //   window.scrollTo(0, document.body.scrollHeight);
    //   contestPwdRef.current?.focus();
    //   setIsContestPwdValidFail(true);
    //   return;
    // }

    // 대회 시작 시간과 종료 시간의 유효성 검사
    if (contestStartDateTime >= contestEndDateTime) {
      alert('대회 종료 시간은 시작 시간 이후로 설정해야 합니다.');
      window.scrollTo(0, document.body.scrollHeight);
      return;
    }

    // 대회 신청 기간 설정이 활성화되어 있고, 시작 시간과 종료 시간의 유효성 검사
    if (isCheckedAppliedPeriod) {
      if (contestAppliedStartDateTime >= contestAppliedEndDateTime) {
        alert('대회 신청 종료 시간은 시작 시간 이후로 설정해야 합니다.');
        window.scrollTo(0, document.body.scrollHeight);
        return;
      }

      // 대회 신청 종료 시간이 대회 시작 시간 이전인지 검사
      if (contestAppliedEndDateTime >= contestStartDateTime) {
        alert('대회 신청기간은 대회 시작 시간 이전으로 설정해야 합니다.');
        window.scrollTo(0, document.body.scrollHeight);
        return;
      }
    }

    const contestData: RegisterContestParams = {
      title,
      content,
      testPeriod: {
        start: toUTCString(contestStartDateTime),
        end: toUTCString(contestEndDateTime),
      },
      applyingPeriod: isCheckedAppliedPeriod
        ? {
            start: toUTCString(contestAppliedStartDateTime),
            end: toUTCString(contestAppliedEndDateTime),
          }
        : (null as any),
      isPassword: true,
      password: contestProblemsPwd,
    };

    editContestMutation.mutate({ cid, params: contestData });
  };

  // (로그인 한) 사용자 정보 조회 및 관리자 권한 확인
  useEffect(() => {
    fetchCurrentUserInfo(updateUserInfo).then((userInfo: UserInfo) => {
      if (contestInfo) {
        const isWriter = contestInfo.writer._id === userInfo._id;

        if (isWriter) {
          setIsLoading(false);
          return;
        }

        alert('접근 권한이 없습니다.');
        router.back();
      }
    });
  }, [updateUserInfo, contestInfo, router]);

  if (isLoading || isPending) return <Loading />;

  return (
    <div className="mt-2 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[60rem] mx-auto">
        <p className="text-2xl font-semibold">대회 등록</p>
        <div className="flex flex-col relative z-0 w-1/2 group mt-5 mb-8">
          <input
            type="text"
            name="floating_first_name"
            className={`block pt-3 pb-[0.175rem] pl-0 pr-0 w-full font-normal text-gray-900 bg-transparent border-0 border-b border-gray-400 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-${
              isContestNameValidFail ? 'pink' : 'blue'
            }-500 focus:border-${
              isContestNameValidFail ? 'red' : 'blue'
            }-500 focus:outline-none focus:ring-0 peer`}
            placeholder=" "
            required
            value={title}
            ref={contestNameRef}
            onChange={handleContestNameChange}
          />
          <label
            htmlFor="floating_first_name"
            className={`peer-focus:font-light absolute text-base left-[0.1rem] font-light text-${
              isContestNameValidFail ? 'red' : 'gray'
            }-500 dark:text-gray-400 duration-300 transform -translate-y-5 scale-75 top-3 -z-10 origin-[0] peer-focus:left-[0.1rem] peer-focus:text-${
              isContestNameValidFail ? 'red' : 'blue'
            }-600 peer-focus:dark:text-${
              isContestNameValidFail ? 'red' : 'blue'
            }-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-[1.25rem] z-10`}
          >
            대회명
          </label>
          <p
            className={`text-${
              isContestNameValidFail ? 'red' : 'gray'
            }-500 text-xs tracking-widest font-light mt-1`}
          >
            대회명을 입력해 주세요
          </p>
        </div>

        <div className="w-full mx-auto overflow-auto">
          <CustomCKEditor
            initEditorContent={content}
            onEditorChange={setContent}
          />
        </div>

        <div className="mt-8">
          <p>대회 시간</p>
          <div className="flex gap-5 items-center mt-2">
            <input
              type="datetime-local"
              id="start-date"
              name="start-date"
              value={contestStartDateTime.slice(0, 16)}
              min={currentDate}
              className="text-sm appearance-none border rounded shadow py-[0.375rem] px-2 text-gray-500"
              onChange={(e) => setContestStartDateTime(e.target.value)}
            />
            <span>~</span>
            <input
              type="datetime-local"
              id="end-date"
              name="end-date"
              value={contestEndDateTime.slice(0, 16)}
              min={currentDate}
              className="text-sm appearance-none border rounded shadow py-[0.375rem] px-2 text-gray-500"
              onChange={(e) => setContestEndDateTime(e.target.value)}
            />
          </div>

          <div className="flex flex-col mt-10 gap-10">
            <div className="flex flex-col">
              <div className="flex flex-col">
                <p>문제 비밀번호 설정</p>
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
                    문제 열람 시 비밀번호 입력이 필요합니다.
                  </p>
                </div>
              </div>

              <div className="flex flex-col relative z-0 w-1/2 group mt-4">
                <input
                  type="text"
                  name="floating_first_name"
                  className={`block pt-3 pb-[0.175rem] pl-0 pr-0 w-full font-normal text-gray-900 bg-transparent border-0 border-b border-gray-400 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-${
                    isContestProblemsPwdValidFail ? 'pink' : 'blue'
                  }-500 focus:border-${
                    isContestProblemsPwdValidFail ? 'red' : 'blue'
                  }-500 focus:outline-none focus:ring-0 peer`}
                  placeholder=" "
                  required
                  value={contestProblemsPwd}
                  ref={contestProblemsPwdRef}
                  onChange={handleContestProblemsPwdChange}
                />
                <label
                  htmlFor="floating_first_name"
                  className={`peer-focus:font-light absolute text-base left-[0.1rem] font-light text-${
                    isContestProblemsPwdValidFail ? 'red' : 'gray'
                  }-500 dark:text-gray-400 duration-300 transform -translate-y-5 scale-75 top-3 -z-10 origin-[0] peer-focus:left-[0.1rem] peer-focus:text-${
                    isContestProblemsPwdValidFail ? 'red' : 'blue'
                  }-600 peer-focus:dark:text-${
                    isContestProblemsPwdValidFail ? 'red' : 'blue'
                  }-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-[1.25rem] z-10`}
                >
                  비밀번호
                </label>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex">
                <div className="flex items-center h-5">
                  <input
                    id="helper-checkbox-applied-period"
                    aria-describedby="helper-checkbox-text"
                    type="checkbox"
                    checked={isCheckedAppliedPeriod}
                    onChange={() =>
                      setIsCheckedAppliedPeriod(!isCheckedAppliedPeriod)
                    }
                    className="w-4 h-4 text-blue-60 border-2 border-[#757575] rounded-[0.175rem] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div className="ml-2 text-sm">
                  <label
                    htmlFor="helper-checkbox-applied-period"
                    className="font-medium text-gray-900 dark:text-gray-300"
                  >
                    신청기간 설정
                  </label>

                  <div className="flex mt-1">
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
                      신청기간을 설정하지 않은 경우 대회가 시작하기 전까지
                      언제든 신청이 가능합니다.
                    </p>
                  </div>
                </div>
              </div>

              {isCheckedAppliedPeriod ? (
                <div className="flex gap-5 items-center mt-3">
                  <input
                    type="datetime-local"
                    id="meeting-time"
                    name="meeting-time"
                    value={contestAppliedStartDateTime.slice(0, 16)}
                    min={currentDate}
                    className="text-sm appearance-none border rounded shadow py-[0.375rem] px-2 text-gray-500"
                    onChange={(e) =>
                      setContestAppliedStartDateTime(e.target.value)
                    }
                  />
                  <span>~</span>
                  <input
                    type="datetime-local"
                    id="meeting-time"
                    name="meeting-time"
                    value={contestAppliedEndDateTime.slice(0, 16)}
                    min={currentDate}
                    className="text-sm appearance-none border rounded shadow py-[0.375rem] px-2 text-gray-500"
                    onChange={(e) =>
                      setContestAppliedEndDateTime(e.target.value)
                    }
                  />
                </div>
              ) : null}
            </div>

            {/* <div className="flex flex-col">
              <div className="flex">
                <div className="flex items-center h-5">
                  <input
                    id="helper-checkbox-using-contest-pwd"
                    aria-describedby="helper-checkbox-text"
                    type="checkbox"
                    checked={isCheckedUsingContestPwd}
                    onChange={() =>
                      setIsCheckedUsingContestPwd(!isCheckedUsingContestPwd)
                    }
                    className="w-4 h-4 text-blue-600 border-2 border-[#757575] rounded-[0.175rem] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div className="ml-2 text-sm">
                  <label
                    htmlFor="helper-checkbox-using-contest-pwd"
                    className="font-medium text-gray-900 dark:text-gray-300"
                  >
                    대회 비밀번호 설정
                  </label>

                  <div className="flex mt-1">
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
                      비밀번호를 설정할 경우 게시글 열람 시 비밀번호 입력이
                      필요합니다.
                    </p>
                  </div>
                </div>
              </div>
              {isCheckedUsingContestPwd ? (
                <div className="flex flex-col relative z-0 w-1/2 group mt-4">
                  <input
                    type="text"
                    name="floating_first_name"
                    className={`block pt-3 pb-[0.175rem] pl-0 pr-0 w-full font-normal text-gray-900 bg-transparent border-0 border-b border-gray-400 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-${
                      isContestPwdValidFail ? 'pink' : 'blue'
                    }-500 focus:border-${
                      isContestPwdValidFail ? 'red' : 'blue'
                    }-500 focus:outline-none focus:ring-0 peer`}
                    placeholder=" "
                    required
                    value={contestPwd}
                    ref={contestPwdRef}
                    onChange={handleContestPwdChange}
                  />
                  <label
                    htmlFor="floating_first_name"
                    className={`peer-focus:font-light absolute text-base left-[0.1rem] font-light text-${
                      isContestPwdValidFail ? 'red' : 'gray'
                    }-500 dark:text-gray-400 duration-300 transform -translate-y-5 scale-75 top-3 -z-10 origin-[0] peer-focus:left-[0.1rem] peer-focus:text-${
                      isContestPwdValidFail ? 'red' : 'blue'
                    }-600 peer-focus:dark:text-${
                      isContestPwdValidFail ? 'red' : 'blue'
                    }-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-[1.25rem] z-10`}
                  >
                    비밀번호
                  </label>
                </div>
              ) : null}
            </div> */}
          </div>

          <div className="mt-14 pb-2 flex justify-end gap-3">
            <button
              onClick={handleCancelContestEdit}
              className="px-4 py-[0.5rem] rounded-[6px] font-light"
            >
              취소
            </button>
            <button
              onClick={handleEditContest}
              className="text-[#f9fafb] bg-[#3a8af9] px-4 py-[0.5rem] rounded-[6px] focus:bg-[#1c6cdb] hover:bg-[#1c6cdb]"
            >
              수정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
