'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TestWithReactQuery() {
  const router = useRouter();

  return (
    <div className="h-[300rem] w-[50%] mx-auto">
      <div className="absolute bottom-0">
        <Link href="/contests/6704896c03f613001e4c9218" prefetch={true}>
          미리보기
        </Link>
      </div>
    </div>
  );
}
