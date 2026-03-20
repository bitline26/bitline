# 비트라인 (Bitline) — CLAUDE.md

## 프로젝트 개요

암호화폐 시세 정보 및 전문가 투자 시그널 제공 **랜딩페이지 + 리드젠 플랫폼**
- 도메인: https://bitline.co.kr/
- GitHub: https://github.com/bitline26/bitline.git (branch: main)
- 배포: Vercel (GitHub push → 자동 배포)

---

## 기술 스택

| 항목 | 기술 |
|------|------|
| Framework | React 19 |
| Build | Vite 8 |
| Charts | Recharts (AreaChart, BarChart) |
| Icons | lucide-react |
| CSS 방식 | 인라인 CSS 객체 (JS 오브젝트) |
| 배포 | Vercel (자동 배포) |
| 스토리지 | LocalStorage (백엔드 없음) |
| 라우팅 | pathname 기반 수동 라우팅 |

---

## 폴더 구조

```
bitline/
├── src/
│   ├── App.jsx          # 메인 홈페이지 (908줄)
│   ├── Admin.jsx        # 관리자 대시보드 (225줄)
│   ├── Promo.jsx        # 프로모션 페이지 (258줄)
│   ├── main.jsx         # 라우팅 진입점
│   ├── index.css        # 전역 스타일
│   └── assets/
│       ├── logo.svg
│       ├── pnl_chart.jpg
│       ├── quant_chart.jpg
│       ├── withdrawal_history.jpg
│       └── trade1~3.jpg
├── public/
│   ├── favicon.svg
│   ├── robots.txt       # /admin 차단
│   ├── sitemap.xml
│   ├── google6bc86f88ea96452a.html  # 구글 인증
│   └── naver6870d78aea364f5902bd7fc73cb2b444.html  # 네이버 인증
├── index.html           # SEO 최적화 (OG, Schema.org, 메타태그)
├── vercel.json          # SPA 리라이트 설정
└── package.json
```

---

## 라우팅 구조

```
/        → App.jsx    (메인 홈페이지)
/promo   → Promo.jsx  (프로모션 랜딩)
/admin   → Admin.jsx  (관리자 대시보드)
```

`main.jsx`에서 `window.location.pathname`으로 수동 분기.

---

## 주요 컴포넌트 (App.jsx)

| 컴포넌트 | 역할 |
|---------|------|
| `CoinChart` | 코인 차트 (탭: 1일/1주/1달/3달/1년, Recharts AreaChart) |
| `PNLChart` | PNL 이미지 표시 카드 |
| `DBForm` | 신청 폼 (이름, 연락처, 동의) → LocalStorage 저장 |
| `ConfirmPopup` | 신청자 확인 팝업 |
| `PromoBanner` | 1000% 수익률 목표방 배너 |
| `Pill` | 수익률 뱃지 컴포넌트 |

---

## 데이터 구조

### 코인 데이터 (COINS — 6개)
```js
{ sym, name, icon, base(KRW 기준가), vol, accent, chart, d1, d7, d30, cap }
```

### 전체 코인 티커 (TICKER_ALL — 12개)
COINS + ADA, AVAX, DOT, MATIC

### 신청 데이터 (LocalStorage: `bitline_submissions`)
```js
{ id, name, phone, agreePrivacy, agreeMarketing, createdAt }
```

---

## 관리자 페이지 (Admin.jsx)

- 접근: `/admin`
- ID: `bitline` / PW: `bitline2026!` (클라이언트 하드코딩 — 보안 취약)
- 세션: `sessionStorage.bl_admin`
- 기능: 신청자 목록, 검색, 삭제, CSV 내보내기, 통계 (전체/오늘/마케팅동의/전환율)

---

## SEO 현황 (index.html)

- 타이틀: 비트코인 시세 · 코인 시세 · 암호화폐 수익률 분석 키워드 포함
- OG 태그: SNS/카카오톡 공유 최적화
- Twitter Card: summary_large_image
- Schema.org: WebSite + Organization + FinancialService + FAQPage
- Google Search Console: 인증 완료
- Naver 사이트 인증: 완료
- sitemap.xml: `/` (daily, 1.0), `/promo` (weekly, 0.9)
- robots.txt: /admin 차단

---

## 색상 팔레트

```
배경:    #060d1f (메인), #0a1628 (카드), #0f172a (보더)
텍스트:  #e2e8f0 (기본), #94a3b8 (보조), #475569 (회색)
강조:    #dc2626 (빨강 CTA), #22c55e (녹색 상승), #ef4444 (빨강)
비트코인: #f7931a (주황)
차트:    #3b82f6 (파랑)
```

---

## 반응형 브레이크포인트

```css
@media (max-width: 1100px)  /* 태블릿: 2컬럼 → 1컬럼 */
@media (max-width: 600px)   /* 모바일: 1컬럼 */
```

---

## 미완성 / 개선 필요 항목

1. **백엔드 없음** — 신청 데이터가 LocalStorage에만 저장됨 (새 기기에서 접근 불가)
2. **실시간 가격 시뮬레이션** — 실제 Upbit/Binance API 미연동
3. **관리자 보안 취약** — ID/PW 소스코드 노출
4. **차트 정적 이미지** — pnl_chart.jpg, quant_chart.jpg 교체 가능
5. **뉴스 하드코딩** — 실제 뉴스 API 미연동
6. **태블릿 반응형 미흡**
7. **테스트 코드 없음**

---

## 개발 명령어

```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
```

## 배포

GitHub `main` 브랜치 push → Vercel 자동 배포
```bash
git add .
git commit -m "..."
git push origin main
```

---

## 주의사항

- 스타일은 **인라인 CSS 객체**로 작성 (Tailwind 미사용, styled-components 미사용)
- 컴포넌트 추가 시 해당 페이지 파일 하단 스타일 객체 (`S`, `FS`, `A`)에 추가
- LocalStorage 키: `bitline_submissions` (신청 데이터), `bl_admin` (관리자 세션은 sessionStorage)
- 라우터 추가 시 `main.jsx`의 pathname 분기 수정 필요
