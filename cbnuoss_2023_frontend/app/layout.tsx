import Footer from './components/Footer';
import Navbar from './components/Navbar';
import './globals.css';
import Providers from '@/utils/Providers';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata = {
  title: 'SW Online Judge',
  description: 'Generated by create next app',
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
      </head>
      <body className="text-sm">
        <Providers>
          <Navbar />
          <SpeedInsights />
          <main className="w-full mx-auto pt-20 mb-[10rem]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}