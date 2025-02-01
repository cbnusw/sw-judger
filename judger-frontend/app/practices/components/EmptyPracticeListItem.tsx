import NotFound from '@/app/components/NotFound';
import React from 'react';

export default function EmptyPracticeListItem() {
  return <NotFound message={'조회 가능한 문제 정보가 없어요'} />;
}
