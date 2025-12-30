# 카카오톡 사진 조회 웹사이트

카카오 로그인을 통해 프로필과 사진을 조회할 수 있는 웹사이트입니다.

## 기능

- 🔐 카카오 로그인 (OAuth 2.0)
- 👤 프로필 정보 표시
- 📷 앨범 형식 사진 갤러리
- 🔎 사진 클릭 시 큰 화면으로 보기
- ⌨️ 키보드 네비게이션 (← → 화살표, ESC)

## 시작하기

### 1. 카카오 개발자 센터 앱 등록

자세한 설정 방법은 [KAKAO_API_SETUP.md](./KAKAO_API_SETUP.md)를 참고하세요.

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
VITE_KAKAO_REST_API_KEY=your_kakao_rest_api_key_here
VITE_KAKAO_REDIRECT_URI=http://localhost:3000/auth/kakao/callback
VITE_API_BASE_URL=http://localhost:8000/api
```

### 3. 설치

```bash
npm install
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

### 5. 빌드

```bash
npm run build
```

## 기술 스택

- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구
- **Axios** - HTTP 클라이언트
- **카카오 REST API** - 카카오 로그인 및 사용자 정보 조회

## 주의사항

⚠️ **중요:**

1. **카카오톡 메시지/사진 API 없음**
   - 카카오는 공식적으로 카카오톡 메시지나 사진 조회 API를 제공하지 않습니다
   - 현재는 목업 데이터를 사용합니다

2. **백엔드 API 필요**
   - 실제 동작을 위해서는 백엔드 API 서버가 필요합니다
   - 카카오 인증 토큰 교환을 위해 백엔드에서 처리해야 합니다

3. **개인정보 보호**
   - 다른 사용자의 정보는 동의 없이 조회할 수 없습니다
   - 개인정보 보호법을 준수해야 합니다

## 백엔드 API 구현

백엔드 API 구현이 필요한 엔드포인트:

- `POST /api/auth/kakao/token` - 카카오 인증 코드를 액세스 토큰으로 교환
- `GET /api/profile` - 프로필 조회
- `GET /api/photos` - 사진 목록 조회

자세한 내용은 [KAKAO_API_SETUP.md](./KAKAO_API_SETUP.md)를 참고하세요.

## 라이선스

MIT
