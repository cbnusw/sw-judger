'use client';

import Link from 'next/link';
import ContestList from './components/contests/ContestList';
import ExamList from './components/exams/ExamList';
import { useEffect, useRef } from 'react';
import ChannelService from '@/third-party/ChannelTalk';

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const CT = new ChannelService();
    CT.loadScript();
    CT.boot({ pluginKey: process.env.NEXT_PUBLIC_CHANNEL_TALK_PLUGIN_KEY! });

    //for unmount
    return () => {
      CT.shutdown();
    };
  }, []);

  const handleScrollDown: () => void = (): void => {
    if (scrollRef.current) {
      const elementTop = scrollRef.current.offsetTop;
      const offset = -20;
      const targetPosition = elementTop + offset;
      const startPosition = window.scrollY; // pageYOffset 대신 scrollY 사용
      const distance = targetPosition - startPosition;
      const duration = 350;

      let previousTimestamp: number | null = null;
      let progress = 0;

      const animation = (currentTime: number) => {
        if (previousTimestamp === null) {
          previousTimestamp = currentTime;
          requestAnimationFrame(animation);
          return;
        }

        // 실제 경과 시간을 기반으로 진행률 계산
        progress += currentTime - previousTimestamp;
        previousTimestamp = currentTime;

        // 진행률이 duration을 넘지 않도록 보장
        progress = Math.min(progress, duration);

        // 현재 스크롤 위치 계산
        const currentProgress = progress / duration;
        const currentPosition =
          easeInOutQuad(currentProgress) * distance + startPosition;

        window.scrollTo(0, currentPosition);

        // duration에 도달하지 않았다면 계속 애니메이션 실행
        if (progress < duration) {
          requestAnimationFrame(animation);
        }
      };

      // 단순화된 이징 함수 (0~1 범위의 진행률 사용)
      const easeInOutQuad = (t: number): number => {
        t *= 2;
        if (t < 1) return 0.5 * t * t;
        t--;
        return -0.5 * (t * (t - 2) - 1);
      };

      requestAnimationFrame(animation);
    }
  };

  return (
    <div className="mt-[-6rem]">
      <div className="relative h-screen flex flex-col gap-6 justify-center items-center bg-[url('/images/main.jpg')] bg-cover bg-center bright-in">
        <span className="mb-[7.5rem] sm:mb-0 text-4xl sm:text-5xl text-center text-white tracking-[0.05em] leading-normal sm:leading-normal font-semibold fade-in px-5 uppercase">
          생각의 전환
          <br /> 새로운 가치가 <br className="block sm:hidden" /> 되도록
        </span>

        <button
          className="absolute bottom-3 focus:outline-none"
          onClick={handleScrollDown}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="70"
            viewBox="0 -960 960 960"
            width="70"
            fill="#b8b9bd"
            className="animate-[bounce_1.5s_infinite]"
          >
            <path d="M480-385.077q-6.462 0-11.923-2.115-5.462-2.116-10.692-7.346L281.846-570.077q-5.615-5.615-6-13.769-.385-8.154 6-14.539 6.385-6.384 14.154-6.384t14.154 6.384L480-428.539l169.846-169.846q5.615-5.615 13.769-6 8.154-.384 14.539 6 6.385 6.385 6.385 14.154 0 7.77-6.385 14.154L502.615-394.538q-5.23 5.23-10.692 7.346-5.461 2.115-11.923 2.115Z" />
          </svg>
        </button>
      </div>

      {/* <div className="mb-[10rem]" ref={scrollRef} /> */}
    </div>
  );
}
