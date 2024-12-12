import React from 'react';
import Image from 'next/image';
import NotFound from '@/app/components/NotFound';

export default function EmptyUserScoreInfoListItem() {
  return <NotFound message={'제출된 내역이 없어요'} />;
}
