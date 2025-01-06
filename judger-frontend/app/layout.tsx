import ConditionalNavbar from './components/ConditionalNavbar';
import Footer from './components/Footer';
import Toast from './components/toast/Toast';
import './globals.css';
import Providers from '@/utils/Providers';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata = {
  title: 'Judge',
  description:
    '충북 도내 대학 재학생들의 소프트웨어 역량을 강화하고, 프로그래밍 학습과 대회 참여를 지원하는 OJ 플랫폼입니다. 코딩 테스트 대비 및 과제 채점을 위한 최적의 환경을 제공합니다.',
  keywords: [
    '충북대학교',
    'Online Judge',
    'SWJudge',
    '프로그래밍',
    '코딩테스트',
    '경진대회',
    '시험',
    '자동 채점',
    'OJ 플랫폼',
  ],
  authors: [
    { name: '충북대학교 Judge 개발팀', url: 'https://swjudge.cbnu.ac.kr' },
  ],
  openGraph: {
    title: 'Judge - 충북대학교',
    description:
      '충북 도내 대학 재학생들을 위한 Online Judge 플랫폼. 소프트웨어 역량 강화 및 경진대회 참여와 과제 채점을 지원합니다.',
    url: 'https://swjudge.cbnu.ac.kr',
    siteName: 'Judge',
    images: [
      {
        url: 'https://swjudge.cbnu.ac.kr/images/cube-logo.png',
        width: 800,
        height: 600,
        alt: 'Judge 로고',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/cube-logo.png" />
        <meta
          name="google-site-verification"
          content="isENqoS-vEJn7rno17EZWfhCbHez5XsiJAMitll0aE4"
        />
      </head>
      <body className="text-sm">
        <Providers>
          <ConditionalNavbar />
          <SpeedInsights />
          <Toast />
          <main className="w-full mx-auto pt-[6rem] mb-[10rem]">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
