import React from 'react';

export default function EmptyContestContestantListItem() {
  return (
    <tr className="border-b dark:border-gray-700 text-xs text-center">
      <th
        scope="row"
        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        참가자가 존재하지 않습니다
      </th>
    </tr>
  );
}
