# 🎯 여행 일정 자동 생성기 (Travel Planner)

Next.js와 TypeScript를 기반으로 한 스마트 여행 일정 생성 웹 애플리케이션입니다.  
네이버 클라우드 플랫폼의 검색 API와 지도 API를 활용하여 사용자가 입력한 여행지와 일정 정보를 바탕으로 여행 루트를 자동 생성하고 지도에 시각화합니다.

## 📋 주요 기능

- ✈️ **자동 일정 생성**: 도시명과 일수를 입력하면 주요 명소들을 자동으로 검색하여 일정 생성
- 🗺️ **지도 시각화**: 네이버 지도를 통해 여행 루트를 시각적으로 확인
- 📱 **반응형 디자인**: 모바일과 데스크톱에서 모두 최적화된 사용자 경험
- 🎨 **일차별 색상 구분**: 각 일차별로 다른 색상으로 구분하여 직관적인 일정 관리
- 📍 **상세 정보 제공**: 각 장소의 주소, 전화번호, 설명 등 상세 정보 표시

## 🛠️ 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **상태관리**: Zustand
- **지도**: NAVER Maps JavaScript API v3
- **API**: 네이버 클라우드 플랫폼 지역 검색 API

## 🚀 시작하기

### 1. 프로젝트 클론 및 의존성 설치

```bash
# 의존성 설치
npm install

# 또는 yarn 사용시
yarn install
```

### 2. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```env
# 네이버 지도 API 키 (네이버 클라우드 플랫폼 > Dynamic Map)
NEXT_PUBLIC_NAVER_CLIENT_ID=your_naver_map_client_id_here

# 네이버 검색 API 키 (네이버 개발자센터 > 지역검색 API)
NEXT_PUBLIC_NAVER_SEARCH_CLIENT_ID=your_naver_search_client_id_here
NEXT_PUBLIC_NAVER_SEARCH_SECRET=your_naver_search_secret_here
```

### 3. API 키 발급 방법

#### 네이버 지도 API (NAVER Maps)
1. [네이버 클라우드 플랫폼](https://ncloud.com/) 가입 및 로그인
2. 콘솔 > Services > AI·Application Service > Maps
3. Dynamic Map 서비스 신청
4. 도메인 등록: `http://localhost:3000` (개발용)
5. Client ID 복사하여 `NEXT_PUBLIC_NAVER_CLIENT_ID`에 입력

#### 네이버 검색 API (지역검색)
1. [네이버 개발자센터](https://developers.naver.com/) 가입 및 로그인
2. Application > 애플리케이션 등록
3. 지역 검색 API 선택
4. 서비스 URL 등록: `http://localhost:3000` (개발용)
5. Client ID와 Client Secret을 각각 복사하여 환경변수에 입력

### 4. 개발 서버 실행

```bash
npm run dev

# 또는 yarn 사용시
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## 📁 프로젝트 구조

```
travel-planner/
├── app/
│   ├── api/
│   │   └── search-spots/
│   │       └── route.ts          # 네이버 검색 API 라우트
│   ├── globals.css               # 전역 스타일
│   ├── layout.tsx                # 루트 레이아웃
│   └── page.tsx                  # 메인 페이지
├── components/
│   ├── InputForm.tsx             # 사용자 입력 폼
│   ├── Map.tsx                   # 네이버 지도 컴포넌트
│   └── ScheduleCard.tsx          # 일정 카드 컴포넌트
├── store/
│   └── useScheduleStore.ts       # Zustand 상태 관리
├── types/
│   └── index.ts                  # TypeScript 타입 정의
└── .env.local                    # 환경변수 (직접 생성 필요)
```

## 🎮 사용법

1. **도시 입력**: 여행하고 싶은 도시명 입력 (예: 제주도, 부산, 강릉)
2. **일수 선택**: 1일부터 10일까지 여행 일수 선택
3. **일정 생성**: "일정 생성하기" 버튼 클릭
4. **일정 확인**: 자동 생성된 일차별 여행 일정 확인
5. **지도 보기**: 지도 탭에서 여행 루트를 시각적으로 확인

## 🔧 주요 기능 설명

### 자동 일정 생성 알고리즘
- 네이버 지역 검색 API로 입력된 도시의 주요 명소 검색
- 검색된 장소들을 입력된 일수에 따라 균등 분배
- 각 일차별로 3-5개의 장소 배정
- 일차별로 다른 색상 코드 부여

### 지도 시각화
- 각 장소에 일차별 색상의 번호 마커 표시
- 같은 일차 내 장소들을 선으로 연결하여 루트 표시
- 마커 클릭 시 장소 정보가 담긴 정보창 표시
- 모든 마커가 보이도록 지도 범위 자동 조정

## 🚨 주의사항

1. **API 키 보안**: `.env.local` 파일은 절대 Git에 커밋하지 마세요
2. **도메인 등록**: 네이버 API 콘솔에서 사용할 도메인을 반드시 등록해야 합니다
3. **API 할당량**: 네이버 API는 일일 호출 한도가 있으므로 주의하세요
4. **브라우저 호환성**: 최신 브라우저에서 최적의 성능을 보장합니다

## 👥 팀 프로젝트 시 API 키 관리

### 옵션 1: 개별 API 키 사용 (권장)
- 각 팀원이 네이버 클라우드 플랫폼과 네이버 개발자센터에서 개별 계정으로 API 키 발급
- 각자의 로컬 환경에서 자신의 `.env.local` 파일 생성
- 장점: 보안성 높음, 개별 사용량 관리 가능

### 옵션 2: API 키 공유
- 프로젝트 리더가 팀원들에게 API 키 직접 공유
- 모든 팀원이 동일한 API 키를 `.env.local`에 설정
- 주의: API 사용량 제한을 팀 전체가 공유하게 됨

### 배포 시 주의사항
- Vercel, Netlify 등에 배포할 때는 환경변수를 플랫폼의 환경변수 설정에서 입력
- 도메인 변경 시 네이버 API 콘솔에서 새 도메인 등록 필요

## 🐛 문제 해결

### 지도가 로딩되지 않는 경우
- 네이버 클라우드 플랫폼에서 Dynamic Map 서비스가 활성화되었는지 확인
- `NEXT_PUBLIC_NAVER_CLIENT_ID` 환경변수가 올바르게 설정되었는지 확인
- 브라우저 콘솔에서 오류 메시지 확인

### 검색 결과가 나오지 않는 경우
- 네이버 개발자센터에서 지역 검색 API가 활성화되었는지 확인
- `NEXT_PUBLIC_NAVER_SEARCH_CLIENT_ID`와 `NEXT_PUBLIC_NAVER_SEARCH_SECRET` 확인
- 검색어를 다른 형태로 입력해보기 (예: "제주" → "제주도")

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

이슈 제보나 개선 사항은 GitHub Issues를 통해 제안해 주세요.

---

Made with ❤️ by Travel Planner Team
