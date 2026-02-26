# 3-SEC ROUTINE PRO

> 초보자를 위한 맞춤형 헬스 루틴 생성 및 캘린더 기반 운동 관리 플랫폼

---

## 📋 요구사항 명세서 (Requirements Specification)

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | 3-SEC ROUTINE PRO |
| **서비스 컨셉** | 초보자를 위한 맞춤형 루틴 생성 및 캘린더 기반 운동 관리 플랫폼 |
| **핵심 목표** | 운동 수준별 맞춤 루틴 제공, 지속적인 기록 관리, 지역 기반 헬스장 정보 연결 |

---

## 2. 기능 요구사항 (Functional Requirements)

### ✅ 2.1 사용자 수준 진단 (Onboarding)
- 사용자의 운동 숙련도 (초급자 / 중급자 / 상급자) 선택 기능
- 개인 신체 데이터 (키, 몸무게, 나이, 성별) 및 운동 목적 입력 폼 제공
- BMI 자동 계산 및 상태 레이블 (저체중 / 정상 / 과체중 / 비만) 표시
- 입력된 데이터를 바탕으로 전체 서비스의 난이도 자동 동기화

### ✅ 2.2 하이브리드 루틴 빌더 (Routine Builder)
- **운동 시간 선택**: 30분 / 60분 / 90분 3단계
- **난이도 선택**: 초급자 / 중급자 / 상급자
- **부위 선택**: 상체 / 하체 / 전신
- 3가지 조합(시간 × 난이도 × 부위) 총 27가지 맞춤 루틴 자동 생성
- 각 운동 카드에 세트 수, 휴식 시간, 체대생 꿀팁 포함

### ✅ 2.3 스마트 캘린더 시스템 (Calendar & Tracker)
- **자동 저장**: 생성된 루틴을 클릭 한 번으로 특정 날짜 캘린더에 즉시 등록
- **히스토리 관리**: 날짜별 운동 기록 확인 및 수행 여부 체크 기능
- **완료 시각화**: 완전 완료(노란 배경 + 체크 배지) / 부분 완료(반투명 노란 배경) / 미완료 구분 표시
- **운동 일지**: 날짜별 자유 텍스트 일지 작성 + 기분 이모지 선택
- **데이터 영속성**: localStorage를 통한 브라우저 종료 후에도 기록 유지

### ✅ 2.4 지역 기반 헬스장 추천 (Location-based Service)
- 사용자가 입력한 지역 또는 현재 위치 기반의 주변 헬스장 탐색
- Kakao Map API를 활용한 위치 시각화
- 헬스장 상세 정보 (거리, 전화번호) 리스트 제공
- API 키 미설정 시 목업 데이터로 폴백 처리

### ✅ 2.5 운동 방법 가이드 (Exercise Guide)
- 각 운동 카드에 "방법 보기" 버튼 제공
- YouTube 썸네일 클릭 시 해당 운동 영상 연결
- 필요 기구, 주요 자극 근육, 단계별 수행 방법, 주의사항 상세 안내
- 약 30가지 운동 가이드 데이터 내장

### ✅ 2.6 친구 경쟁 / 완수율 공유 (Social Challenge)
- 운동 완수율 기반 랭킹 보드 (나 + 추가한 라이벌)
- URL 인코딩 방식의 공유 링크 생성 및 라이벌 통계 불러오기
- 연속 운동 일수(Streak) 및 총 완료 운동 수 기준 순위 표시

### ✅ 2.7 월별 통계 (Monthly Statistics)
- 월 / 연도 선택 드롭다운
- 총 운동 일수, 일관성 비율, 완료 운동 수, 완료율 4가지 핵심 지표
- 상체 / 하체 / 전신 비율 도넛 차트
- 주차별 운동 빈도 바 차트
- 난이도별 / 운동 시간별 분포 차트

### ✅ 2.8 세트 사이 스마트 휴식 타이머 (Rest Timer)
- 운동 카드 번호 버튼 클릭 시 즉시 60초 카운트다운 타이머 활성화
- 형광 노란색(`#DFFF00`) 프로그레스 바가 실시간으로 줄어드는 시각 피드백
- 진행 중: "💨 다음 세트 준비! 호흡하세요." 안내 문구
- 0초 도달 시: 진동 애니메이션 + "🚀 다음 세트 시작!" 문구 전환
- 건너뛰기 버튼으로 즉시 종료 가능
- Zustand 전역 상태(`isTimerRunning`, `remainingTime`)로 관리

### ✅ 2.9 오늘의 미션 & 성취 스탬프 (Daily Mission)
- 7가지 보너스 미션 중 오늘 날짜 기반으로 매일 다른 미션 자동 선택
  - 계단으로 귀가하기 / 단백질 쉐이크 마시기 / 스트레칭 5분 더 하기
  - 물 2리터 마시기 / 11시 전에 취침하기 / 퇴근 후 10분 걷기 / 오늘 하루 단 음식 참기
- 미션 완료 버튼 클릭 시 화면 전체 Confetti(형광 파티클) 효과
- 완료 스탬프 애니메이션 (도장 찍히는 느낌)
- 캘린더 해당 날짜에 🔥 아이콘 자동 저장
- 완료 상태 localStorage 영속 저장 (새로고침 유지)

---

## 3. 기술 요구사항 (Technical Requirements)

### 🛠 Tech Stack

| 분류 | 기술 |
|------|------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | JavaScript (Standard.js) |
| **Styling** | Tailwind CSS + CSS Modules |
| **State Management** | Zustand (persist 미들웨어로 localStorage 연동) |
| **Animation** | Framer Motion |
| **Icons** | Lucide React |
| **Map API** | Kakao Map API |

### 📁 폴더 구조

```
src/
├── app/
│   ├── globals.css        # 전역 CSS 변수 (테마 토큰)
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── hero/              # HeroSection
│   ├── selection/         # SelectionSection (루틴 선택 3단계)
│   ├── result/            # ResultSection (루틴 결과 + 운동 카드)
│   ├── timer/             # RestTimer + RestTimer.module.css
│   ├── mission/           # DailyMission + DailyMission.module.css
│   └── ui/
│       ├── CalendarWidget.jsx
│       ├── DashboardSection.jsx
│       ├── DiaryModal.jsx
│       ├── ExerciseGuideModal.jsx
│       ├── GymFinder.jsx
│       ├── ChallengeBoard.jsx
│       ├── MonthlyStats.jsx
│       ├── ProfileModal.jsx
│       └── StatsBar.jsx
├── constants/
│   ├── workoutData.js     # 27가지 루틴 데이터
│   └── exerciseGuide.js   # ~30가지 운동 가이드 데이터
├── hooks/
│   └── useRoutine.js      # 루틴 스토어 커스텀 훅
└── store/
    ├── useRoutineStore.js  # 루틴 선택 상태
    ├── useCalendarStore.js # 캘린더 로그 + 일지 + 미션 (persist)
    ├── useProfileStore.js  # 사용자 프로필 (persist)
    └── useTimerStore.js    # 휴식 타이머 상태
```

### 📐 코드 스타일
- **Standard.js**: 세미콜론 없음, 2칸 들여쓰기, 작은따옴표
- **컴포넌트**: 함수형 컴포넌트 + Named Export
- **상태 관리**: Zustand (전역) + useState (로컬)
- **서버/클라이언트**: `'use client'` 최소화, 필요한 컴포넌트에만 적용

---

## 4. UI/UX 요구사항 (Design System)

### 🎨 4.1 디자인 테마 — High-Tech Dark Mode

| 토큰 | 값 | 용도 |
|------|----|------|
| `--volt` | `#DFFF00` | 주요 포인트 컬러 (버튼, 강조) |
| `--blue-elec` | `#00D4FF` | 보조 포인트 컬러 |
| `--bg` | `#000000` | 메인 배경 |
| `--bg-1` | `#0a0a0a` | 섹션 배경 |
| `--bg-card` | `#141414` | 카드 배경 |
| `--text-primary` | `#ffffff` | 본문 텍스트 |
| `--text-secondary` | `rgba(255,255,255,0.55)` | 보조 텍스트 |

### 🚀 4.2 시각적 동기부여
- **High-Contrast Dark Mode**: 깊은 블랙 배경 + 보트 옐로우(`#DFFF00`) + 일렉트릭 블루 포인트
- **Dynamic Typography**: Montserrat Black + Inter 조합으로 스포츠 브랜드 감성 구현
- **Hero Section**: 타이핑 헤드라인 애니메이션 + 패럴랙스 그리드 배경 + 네온 글로우 CTA 버튼

### 👁️ 4.3 한눈에 들어오는 대시보드
- **2컬럼 레이아웃**: 캘린더(좌) + TODAY 카드 & 주간 히트맵(우)
- **Visual Feedback**: 완료 운동 카드에 체크 배지 + 컬러 변화로 성취감 즉각 시각화
- **Progress Ring**: 오늘의 운동 진행률 원형 게이징 애니메이션

### ✨ 4.4 UX 인터랙션 디테일
- **Smooth Step Navigation**: 한 화면에 하나씩 슬라이딩 방식으로 루틴 선택 (초보자 피로도 최소화)
- **Haptic-like Animation**: 버튼 클릭 시 scale + 진동 효과 (Framer Motion)
- **Glassmorphism**: 네비게이션 바 반투명 유리 효과
- **Scroll Indicator**: 화면 하단 바운스 화살표로 다음 섹션 유도

---

## 5. 화면 구성 (Screen Architecture)

| 화면 | 설명 |
|------|------|
| **Hero** | "READY TO BREAK YOUR LIMIT?" 타이핑 애니메이션 + 퀵 스탯 카운터 |
| **Selection** | 시간 → 난이도 → 부위 3단계 슬라이드 선택 (좌: 선택 카드 / 우: 요약 패널) |
| **Result** | 운동 카드 목록 + 이미지 (좌) / 진행률 링 + 액션 버튼 고정 패널 (우) |
| **Dashboard** | 대시보드 / 통계 / 헬스장 / 경쟁 4탭 구조 |
| **Calendar** | 월간 캘린더 + 날짜별 완료 시각화 + 일지 작성 |
| **Stats** | 월별 통계 (도넛 차트 + 바 차트 + 핵심 지표 4종) |
| **Gym** | 지역 기반 헬스장 검색 (Kakao Map API) |
| **Challenge** | 친구 경쟁 랭킹 보드 + 공유 링크 생성 |

---

## 6. 환경 변수 설정

```bash
# .env.local
NEXT_PUBLIC_KAKAO_MAP_KEY=your_kakao_map_api_key
```

> Kakao Map API 키가 없으면 목업 데이터로 자동 폴백됩니다.

---

## 7. 시작하기 (Getting Started)

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
npm start
```

개발 서버 실행 후 [http://localhost:3000](http://localhost:3000) 에서 확인하세요.

---

## 8. 향후 개선 계획 (Roadmap)

- [ ] 실제 Kakao Map API 연동 (현재 목업 데이터)
- [ ] 소셜 로그인 (Google / Kakao)
- [ ] 주간 루틴 스케줄러 (2분할 / 3분할)
- [ ] 푸시 알림 (운동 시간 리마인더)
- [ ] AI 기반 루틴 개인화 추천
- [ ] 운동 영상 인앱 재생
