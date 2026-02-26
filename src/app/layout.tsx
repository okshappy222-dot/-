import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '3-SEC ROUTINE PRO | 초보자 맞춤 헬스 루틴',
  description: '3초 만에 나만의 맞춤 헬스 루틴을 생성하고, 매일 기록하며 성장하세요.',
  keywords: ['헬스', '운동 루틴', '초보자', '헬스 루틴', '운동 기록'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
