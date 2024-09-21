import React from 'react';

export default function EmptyExamProblemListItem() {
  return (
    <div className="flex items-center gap-2 w-full border p-2 rounded-sm shadow-sm">
      <span className="ml-1 text-[#555] hover:underline focus:underline">
        등록된 문제가 없습니다
      </span>
    </div>
  );
}
