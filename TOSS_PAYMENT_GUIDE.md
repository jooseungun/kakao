# 토스페이먼츠 결제 연동 가이드

이 문서는 SellEdu 프로젝트에 토스페이먼츠 결제 모듈을 연동하는 방법을 설명합니다.

## 목차

1. [사전 준비](#사전-준비)
2. [환경 변수 설정](#환경-변수-설정)
3. [데이터베이스 마이그레이션](#데이터베이스-마이그레이션)
4. [SDK 설치](#sdk-설치)
5. [테스트 방법](#테스트-방법)
6. [프로덕션 배포](#프로덕션-배포)

## 사전 준비

### 1. 토스페이먼츠 계정 생성 및 앱 등록

1. [토스페이먼츠 개발자 센터](https://developers.tosspayments.com/)에 접속
2. 회원가입 및 로그인
3. "내 앱" 메뉴에서 새 앱 생성
4. 테스트 키 또는 프로덕션 키 발급
   - **클라이언트 키 (Client Key)**: 프론트엔드에서 사용
   - **시크릿 키 (Secret Key)**: 백엔드에서 사용 (절대 노출 금지)

### 2. 필요한 키 정보

- `REACT_APP_TOSS_CLIENT_KEY`: 클라이언트 키 (프론트엔드)
- `TOSS_SECRET_KEY`: 시크릿 키 (백엔드, Cloudflare Pages Functions 환경 변수)

## 환경 변수 설정

### 클라이언트 (React)

`.env.local` 파일을 생성하고 다음을 추가:

```env
REACT_APP_TOSS_CLIENT_KEY=test_ck_DpexMgkW36w8qJ4KzL8gLzN97Eoq
```

**주의**: 테스트 키는 예시입니다. 실제 토스페이먼츠 개발자 센터에서 발급받은 키를 사용하세요.

### 백엔드 (Cloudflare Pages Functions)

Cloudflare 대시보드에서 환경 변수 설정:

1. Cloudflare 대시보드 접속
2. Pages > 프로젝트 선택 > Settings > Environment variables
3. 다음 환경 변수 추가:
   - **변수명**: `TOSS_SECRET_KEY`
   - **값**: 토스페이먼츠 시크릿 키
   - **환경**: Production, Preview 모두 설정

## 데이터베이스 마이그레이션

결제 관련 테이블을 생성하기 위해 데이터베이스 초기화를 실행합니다.

### 로컬 개발 환경

```bash
# 데이터베이스 초기화 API 호출
curl -X POST http://localhost:8788/api/v1/admin/init-db
```

또는 브라우저에서 직접 접속:
```
http://localhost:8788/api/v1/admin/init-db
```

### 프로덕션 환경

Cloudflare 대시보드에서 Functions를 통해 실행하거나, 관리자 페이지에서 실행합니다.

### 생성되는 테이블

- `orders`: 주문 정보
- `payments`: 결제 정보
- 기존 테이블과의 관계:
  - `orders.user_id` → `users.id`
  - `orders.content_id` → `contents.id`
  - `payments.order_id` → `orders.id`

## SDK 설치

### 클라이언트 SDK

```bash
cd client
npm install @tosspayments/payment-sdk
```

## 테스트 방법

### 1. 로컬 개발 환경 실행

```bash
# 클라이언트 빌드
npm run client:build

# Wrangler로 로컬 서버 실행
npm run dev:pages
```

또는

```bash
# React 개발 서버 (터미널 1)
npm run client:dev

# Functions 서버 (터미널 2)
npm run functions:dev
```

### 2. 결제 테스트

1. 브라우저에서 `http://localhost:8788` (또는 `http://localhost:3000`) 접속
2. 로그인 후 콘텐츠 상세 페이지로 이동
3. "구매" 버튼 클릭
4. 결제 다이얼로그에서 결제 정보 입력
5. 테스트 카드 정보 사용:
   - 카드번호: `4242 4242 4242 4242`
   - 유효기간: 미래 날짜 (예: `12/34`)
   - CVC: `123`
   - 비밀번호: `123456` (간편결제 비밀번호)

### 3. 결제 플로우

1. **결제 요청**: 사용자가 "구매" 버튼 클릭
   - API: `POST /api/v1/payments/request`
   - 주문 생성 및 결제 정보 반환

2. **결제 위젯 표시**: 토스페이먼츠 결제 위젯 렌더링
   - 사용자가 결제 정보 입력
   - "결제하기" 버튼 클릭

3. **결제 승인**: 토스페이먼츠에서 결제 완료 후 콜백
   - URL: `/payment/success?paymentKey=...&orderId=...&amount=...`
   - API: `POST /api/v1/payments/approve`
   - 주문 상태 업데이트 및 구매 완료

4. **결제 실패**: 결제 실패 시
   - URL: `/payment/fail?code=...&message=...`
   - 에러 메시지 표시

## 프로덕션 배포

### 1. 프로덕션 키 발급

토스페이먼츠 개발자 센터에서 프로덕션 키를 발급받습니다.

### 2. 환경 변수 설정

#### 클라이언트

프로덕션 빌드 시 환경 변수 설정:
- Cloudflare Pages: Environment variables에서 `REACT_APP_TOSS_CLIENT_KEY` 설정
- 또는 빌드 시점에 환경 변수 주입

#### 백엔드

Cloudflare Pages Functions 환경 변수:
- `TOSS_SECRET_KEY`: 프로덕션 시크릿 키

### 3. 결제 승인 API 구현

현재 구현은 시뮬레이션입니다. 프로덕션에서는 실제 토스페이먼츠 API를 호출해야 합니다.

`functions/api/v1/payments/approve.ts` 파일을 수정하여 실제 API 호출을 구현하세요:

```typescript
// 토스페이먼츠 결제 승인 API 호출
const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${btoa(env.TOSS_SECRET_KEY + ':')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    paymentKey: paymentKey,
    orderId: orderNumber,
    amount: amount
  })
});

const paymentData = await response.json();
```

### 4. 보안 고려사항

- ✅ 시크릿 키는 절대 클라이언트에 노출하지 않음
- ✅ 결제 금액은 서버에서 검증
- ✅ 주문 소유자 확인
- ✅ 중복 결제 방지
- ✅ HTTPS 사용 (프로덕션)

## API 엔드포인트

### 결제 요청

```
POST /api/v1/payments/request
Authorization: Bearer {token}
Content-Type: application/json

{
  "content_id": 1,
  "amount": 10000
}
```

### 결제 승인

```
POST /api/v1/payments/approve
Authorization: Bearer {token}
Content-Type: application/json

{
  "orderId": 1,
  "paymentKey": "tgen_...",
  "amount": 10000
}
```

### 결제 취소

```
POST /api/v1/payments/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "orderId": 1,
  "cancelReason": "고객 요청"
}
```

## 문제 해결

### 결제 위젯이 표시되지 않음

1. 브라우저 콘솔에서 에러 확인
2. `REACT_APP_TOSS_CLIENT_KEY` 환경 변수 확인
3. 네트워크 탭에서 SDK 로드 확인

### 결제 승인 실패

1. 서버 로그 확인
2. `TOSS_SECRET_KEY` 환경 변수 확인
3. 주문 상태 확인 (이미 결제 완료된 주문인지)
4. 결제 금액 일치 여부 확인

### 데이터베이스 오류

1. 데이터베이스 초기화 실행 확인
2. 테이블 생성 여부 확인:
   ```sql
   SELECT name FROM sqlite_master WHERE type='table' AND name IN ('orders', 'payments');
   ```

## 참고 자료

- [토스페이먼츠 개발자 문서](https://docs.tosspayments.com/)
- [토스페이먼츠 SDK 가이드](https://docs.tosspayments.com/guides/payment-widget/integration)
- [토스페이먼츠 API 레퍼런스](https://docs.tosspayments.com/reference)

## 지원

문제가 발생하면 다음을 확인하세요:

1. 환경 변수 설정 확인
2. 데이터베이스 마이그레이션 실행 여부
3. 브라우저 콘솔 및 서버 로그 확인
4. 토스페이먼츠 개발자 센터에서 앱 상태 확인

