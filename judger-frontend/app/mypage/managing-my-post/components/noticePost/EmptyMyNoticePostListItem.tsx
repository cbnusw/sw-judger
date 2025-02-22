import React from 'react';

export default function EmptyMyNoticePostListItem() {
  return (
    <tr className="h-[2.5rem] border-b-[1.25px] border-[#d1d6db] text-xs text-center">
      <th
        scope="row"
        className="px-2 py-2 font-normal text-[#4e5968] whitespace-nowrap dark:text-white"
      >
        1
      </th>
      <td className="text-[#4e5968]">조회된 정보가 없어요</td>
    </tr>
  );
}
