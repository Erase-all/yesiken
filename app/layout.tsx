import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "여행 일정 자동 생성기 | Travel Planner",
  description: "네이버 클라우드 API를 활용한 스마트 여행 일정 생성 서비스. 원하는 도시의 주요 명소를 자동으로 찾아 최적의 여행 루트를 생성합니다.",
  keywords: "여행, 일정, 계획, 네이버맵, 자동생성, 관광지, 명소",
  authors: [{ name: "Travel Planner Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;

  return (
    <html lang="ko">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.initNaverMap = function() {
                console.log('네이버 지도 API 로드 완료 - 콜백 함수 호출됨');
                console.log('window.naver:', !!window.naver);
                console.log('window.naver.maps:', !!(window.naver && window.naver.maps));
                
                // 지도 초기화 준비 완료 이벤트 발생
                window.dispatchEvent(new CustomEvent('naverMapReady'));
              };

              // 스크립트 로드 에러 처리
              window.addEventListener('error', function(e) {
                if (e.target && e.target.src && e.target.src.includes('oapi.map.naver.com')) {
                  console.error('네이버 지도 스크립트 로드 실패:', e);
                  window.dispatchEvent(new CustomEvent('naverMapError', { detail: e }));
                }
              }, true);
            `,
          }}
        />
        <Script
          strategy="beforeInteractive"
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&callback=initNaverMap`}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
