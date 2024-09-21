import React from 'react';
import DummyContestListemItem from './DummyContestListemItem';

export default function EmptyContestListItem() {
  return (
    <>
      <div className="relative flex flex-col gap-4 bg-[#f7f7f7] text-gray-500 px-3 py-[1.9rem] group">
        신청 가능한 대회 정보가 없습니다
        <div className="absolute right-0 bottom-0 border-l-[0.6rem] border-l-[#eee] border-t-[0.6rem] border-t-[#eee] border-b-[0.6rem] border-b-white border-r-[0.6rem] border-r-white group-hover:border-l-[#3274ba] group-hover:border-t-[#3274ba] ease-in duration-100"></div>
      </div>
      {Array.from({ length: 3 }, (_, index) => (
        <DummyContestListemItem key={index} />
      ))}
    </>
  );
}
