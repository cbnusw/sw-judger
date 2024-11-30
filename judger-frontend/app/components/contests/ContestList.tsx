'use client';

import React from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import ContestListItem from './ContestListItem';
import EmptyContestListItem from './EmptyContestListItem';
import DummyContestListemItem from './DummyContestListemItem';
import { ContestInfo } from '@/types/contest';

const fetchProgressingContests = () => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/contest/available`,
  );
};

export default function ContestList() {
  const { isPending, data } = useQuery({
    queryKey: ['progressingContests'],
    queryFn: fetchProgressingContests,
  });

  const resData = data?.data.data;
  const contestCnt = resData?.length || 0;

  if (contestCnt === 0) return <EmptyContestListItem />;

  return (
    <>
      {isPending ? (
        <>
          {Array.from({ length: 4 }, (_, index) => (
            <DummyContestListemItem key={index} />
          ))}
        </>
      ) : (
        <>
          {resData.map((contestInfo: ContestInfo) => (
            <ContestListItem contestInfo={contestInfo} key={contestInfo._id} />
          ))}

          {Array.from({ length: 4 - resData?.length }, (_, index) => (
            <DummyContestListemItem key={index} />
          ))}
        </>
      )}
    </>
  );
}
