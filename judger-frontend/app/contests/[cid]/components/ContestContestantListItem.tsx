'use client';

import { OPERATOR_ROLES } from '@/constants/role';
import { userInfoStore } from '@/store/UserInfo';
import { ContestInfo } from '@/types/contest';
import { maskEmail, maskString } from '@/utils/maskString';

interface ContestContestantListItemProps {
  contestantInfo: ContestInfo['contestants'][number]; // This denotes a single contestant object
  total: number;
  index: number;
}

export default function ContestContestantListItem(
  props: ContestContestantListItemProps,
) {
  const { contestantInfo, total, index } = props;

  const userInfo = userInfoStore((state: any) => state.userInfo);

  return (
    <tr className="h-[2.5rem] border-b-[1.25px] border-[#d1d6db] text-xs text-center">
      <th
        scope="row"
        className="px-4 py-2 font-normal text-[#4e5968] whitespace-nowrap dark:text-white"
      >
        {total - index}
      </th>
      <td scope="row" className="text-[#4e5968]">
        {userInfo.no === contestantInfo.no ||
        OPERATOR_ROLES.includes(userInfo.role) ? (
          <>{contestantInfo.no}</>
        ) : (
          <>{maskString(contestantInfo.no, 4, contestantInfo.no.length)}</>
        )}
      </td>
      <td className="text-[#4e5968]">
        {userInfo.no === contestantInfo.no ||
        OPERATOR_ROLES.includes(userInfo.role) ? (
          <>{contestantInfo.name}</>
        ) : (
          <>{maskString(contestantInfo.name, 1, contestantInfo.name.length)}</>
        )}
      </td>
      <td className="text-[#4e5968]">{contestantInfo.university}</td>
      <td className="text-[#4e5968]">{contestantInfo.department}</td>
      <td className="text-[#4e5968]">
        {userInfo.no === contestantInfo.no ||
        OPERATOR_ROLES.includes(userInfo.role) ? (
          <>{contestantInfo.email}</>
        ) : (
          <>{maskEmail(contestantInfo.email)}</>
        )}
      </td>
    </tr>
  );
}
