import NotFound from '@/app/components/NotFound';
import React from 'react';

export default function EmptyContestProblemListItem() {
  return <NotFound message={'등록된 문제가 없어요'} />;
}
