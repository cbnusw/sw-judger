'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import logoImg from '@/public/images/cube-logo.png';
import axiosInstance from '@/utils/axiosInstance';
import { userInfoStore } from '@/store/UserInfo';
import { AxiosError } from 'axios';
import Link from 'next/link';
import ChannelService from '@/third-party/ChannelTalk';
import SmallLoading from '../components/SmallLoading';
import { ToastInfoStore } from '@/store/ToastInfo';

interface UserLoginInfoType {
  id: string;
  pwd: string;
}

// 로그인 API
const login = (userAccountInfo: UserLoginInfoType) => {
  const { id, pwd } = userAccountInfo;
  const reqBody = {
    no: id,
    password: pwd,
  };
  return axiosInstance.post('/auth/login', reqBody);
};

// (로그인 한) 사용자 정보 조회 API
const fetchCurrentUserInfo = () => {
  return axiosInstance.get('/auth/me');
};

export default function Login() {
  const STR_RIGHT_CASE_INPUT_ELEMENT_STYLE_CLASSNAME =
    'border-none outline outline-1 outline-[#e6e8ea] hover:outline-2 hover:outline-[#a3c6fa] hover:outline-offset-[-1px] focus:outline-[#487fee] focus:outline-offset-[-1px] focus:ring-0';
  const STR_WRONG_CASE_INPUT_ELEMENT_STYLE_CLASSNAME =
    'border-none outline outline-2 outline-[#e85257] outline-offset-[-1px] focus:outline-[#e85257] focus:outline-offset-[-1px] focus:ring-0';

  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);
  const addToast = ToastInfoStore((state) => state.addToast);

  const [userAccountInfo, setUserAccountInfo] = useState({
    id: '',
    pwd: '',
  });
  const [isIdInputValidFail, setIsIdInputValidFail] = useState(false);
  const [isPwdInputValidFail, setIsPwdInputValidFail] = useState(false);
  const [idValidFailMsg, setIdValidFailMsg] = useState('');
  const [pwdValidFailMsg, setPwdValidFailMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const idInputRef = useRef<HTMLInputElement>(null);
  const pwdInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  useEffect(() => {
    const CT = new ChannelService();
    CT.loadScript();
    CT.boot({ pluginKey: process.env.NEXT_PUBLIC_CHANNEL_TALK_PLUGIN_KEY! });

    //for unmount
    return () => {
      CT.shutdown();
    };
  }, []);

  useEffect(() => {
    if (userAccountInfo.id === '') {
    }
  }, [userAccountInfo.id]);

  useEffect(() => {
    idInputRef.current?.focus();
  }, []);

  const verifyIdInputValueValidFail = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const idInputValue = e.target.value;
    if (idInputValue === '') {
      setIdValidFailMsg('학번/교번을 입력해 주세요.');
      setIsIdInputValidFail(true);
    } else {
      setIsIdInputValidFail(false);
    }
  };

  const verifyPwdInputValueValidFail = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const pwdInputValue = e.target.value;
    if (pwdInputValue === '') {
      setPwdValidFailMsg('비밀번호를 입력해 주세요.');
      setIsPwdInputValidFail(true);
    } else {
      setIsPwdInputValidFail(false);
    }
  };

  const handleSignIn = (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!userAccountInfo.id) {
      idInputRef.current?.focus();
      setIdValidFailMsg('학번/교번을 입력해 주세요.');
      setIsIdInputValidFail(true);
      return;
    }

    if (!userAccountInfo.pwd) {
      pwdInputRef.current?.focus();
      setPwdValidFailMsg('비밀번호를 입력해 주세요.');
      setIsPwdInputValidFail(true);
      return;
    }

    loginMutation.mutate(userAccountInfo);
  };

  const loginMutation = useMutation({
    mutationFn: login,
    onMutate: () => {
      if (isSubmitting) return;
      setIsSubmitting(true);
    },
    onError: (error: AxiosError) => {
      const resData: any = error.response?.data;
      switch (resData.status) {
        case 400:
          switch (resData.code) {
            case 'REG_NUMBER_REQUIRED':
              addToast('error', '로그인 중에 에러가 발생했어요.');
              break;
            case 'INVALID_PASSWORD':
              addToast('warning', '정확한 로그인 정보를 입력해 주세요.');
              break;
            default:
              addToast('error', '로그인 중에 에러가 발생했어요.');
          }
          break;
        case 404:
          addToast('warning', '정확한 로그인 정보를 입력해 주세요.');
          break;
        default:
          addToast('error', '로그인 중에 에러가 발생했어요.');
      }
    },
    onSuccess: (data) => {
      const resData = data.data.data;
      const { accessToken, refreshToken } = resData;

      localStorage.setItem('access-token', accessToken);
      localStorage.setItem('refresh-token', refreshToken);
      localStorage.setItem('activeAuthorization', 'true');

      // 로그인 후 사용자 정보 조회
      getCurrentUserInfoMutation.mutate();

      router.push('/');
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const getCurrentUserInfoMutation = useMutation({
    mutationFn: fetchCurrentUserInfo,
    onSuccess: (data) => {
      const resData = data.data.data;
      const { _id, no, name, email, university, department, phone, role } =
        resData;
      updateUserInfo({
        _id,
        no,
        name,
        email,
        university,
        department,
        phone,
        role,
        isAuth: true,
      });
    },
  });

  return (
    <div className="h-[22rem]">
      <div className="w-fit 2md:w-[27rem] p-4 mx-auto">
        <Link href="/" className="w-fit flex items-center gap-x-[0.175rem]">
          <Image src={logoImg} alt="list" width={29} quality={100} />

          <span className="hidden 2lg:block tracking-tighter text-[1rem] leading-[1.25] font-semibold text-[#212631]">
            SW Online Judge
          </span>
        </Link>

        <p className="mt-11 text-[#47515f] text-[1.275rem] font-semibold">
          로그인
        </p>

        <form
          onSubmit={(e) => handleSignIn(e)} // Enter 키로 제출 가능
        >
          <div className="mt-12 flex flex-col gap-y-9">
            <div className="flex flex-col gap-y-[0.4rem]">
              <label htmlFor="" className="text-[#4e5968] text-[15px]">
                학번/교번
              </label>
              <input
                type="text"
                ref={idInputRef}
                onChange={(e) => {
                  setUserAccountInfo({
                    ...userAccountInfo,
                    id: e.target.value,
                  });
                }}
                onBlur={verifyIdInputValueValidFail}
                className={`h-[2.5rem] text-[0.8rem] text-[rgba(0,12,30,0.75)] font-light flex items-center rounded-[7px] duration-100 px-[0.825rem] ${
                  isIdInputValidFail
                    ? STR_WRONG_CASE_INPUT_ELEMENT_STYLE_CLASSNAME
                    : STR_RIGHT_CASE_INPUT_ELEMENT_STYLE_CLASSNAME
                }`}
              />
              {isIdInputValidFail && (
                <span className="text-[0.825rem] text-[#e85257] font-light">
                  {idValidFailMsg}
                </span>
              )}
            </div>

            <div className="flex h-[6rem] flex-col gap-y-[0.4rem]">
              <label htmlFor="" className="text-[#4e5968] text-[15px]">
                비밀번호
              </label>
              <input
                type="password"
                ref={pwdInputRef}
                onChange={(e) => {
                  setUserAccountInfo({
                    ...userAccountInfo,
                    pwd: e.target.value,
                  });
                }}
                onBlur={verifyPwdInputValueValidFail}
                className={`h-[2.5rem] text-lg tracking-[0.01em] text-[rgba(0,12,30,0.75)] font-light flex items-center rounded-[7px] duration-100 px-[0.825rem] ${
                  isPwdInputValidFail
                    ? STR_WRONG_CASE_INPUT_ELEMENT_STYLE_CLASSNAME
                    : STR_RIGHT_CASE_INPUT_ELEMENT_STYLE_CLASSNAME
                }`}
              />
              {isPwdInputValidFail && (
                <span className="text-[0.825rem] text-[#e85257] font-light">
                  {pwdValidFailMsg}
                </span>
              )}
            </div>
          </div>

          <div className="mt-1 flex justify-between items-center">
            <div className="flex items-center gap-x-1 text-[0.825rem] text-[#6b7684] font-light">
              <a
                target="_blank"
                href="https://sw7up.cbnu.ac.kr/account/join"
                className="px-1 py-[0.1rem] hover:bg-[#f3f4f5] rounded-[7px] hover:text-[#4e5968]"
              >
                회원가입
              </a>
              <span className='hidden relative bottom-[0.055rem] font-normal text-[#6b7684] before:content-["|"] 3md:block' />
              <a
                target="_blank"
                href="https://sw7up.cbnu.ac.kr/account/password"
                className="px-1 py-[0.1rem] hover:bg-[#f3f4f5] rounded-[7px] hover:text-[#4e5968]"
              >
                비밀번호 찾기
              </a>
            </div>

            <button
              type="submit"
              onClick={handleSignIn}
              disabled={isSubmitting}
              className={`${
                isSubmitting
                  ? 'opacity-70 px-2'
                  : ' hover:bg-[#1c6cdb] px-[0.775rem]'
              } flex justify-center items-center text-[0.8rem] py-[0.6em] rounded-[6px] font-medium bg-[#3183f6]`}
            >
              {isSubmitting && <SmallLoading />}
              <span className={`${isSubmitting && 'ml-[0.3rem]'} text-white`}>
                로그인
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
