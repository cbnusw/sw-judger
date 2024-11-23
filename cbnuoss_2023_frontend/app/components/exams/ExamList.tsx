'use client';

import React from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import EmptyExamListItem from './EmptyExamListItem';
import ExamListItem from './ExamListItem';
import DummyExamListItem from './DummyExamListItem'; // DummyExamListItem 컴포넌트를 import 해야 합니다.
import { ExamInfo } from '@/types/exam';

// 시험 목록 반환 API (최근 데이터 3개까지)
const fetchExams = () => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/assignment/?page=1&limit=3&sort=-createdAt`,
  );
};

export default function ExamList() {
  const { isPending, data } = useQuery({
    queryKey: ['examList'],
    queryFn: fetchExams,
  });

  const resData = data?.data.data;
  const examCnt = resData?.documents.length || 0;

  // DummyExamListItem 컴포넌트를 필요한 만큼 렌더링하기 위한 배열을 생성합니다.
  const dummyItemsCount = 3 - examCnt;
  const dummyItems = Array.from({ length: dummyItemsCount }, (_, index) => (
    <DummyExamListItem key={`dummy-${index}`} />
  ));

  if (isPending) {
    const loadingItems = Array.from({ length: 3 }, (_, index) => (
      <DummyExamListItem key={`loading-${index}`} />
    ));
    return <>{loadingItems}</>;
  }

  if (examCnt === 0) {
    return <EmptyExamListItem />;
  }

  return (
    <>
      {resData?.documents.map((examInfo: ExamInfo) => (
        <ExamListItem examInfo={examInfo} key={examInfo._id} />
      ))}
      {dummyItems}
    </>
  );
}
