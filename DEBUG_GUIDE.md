# 디버깅 가이드 - 로그인 문제 해결

## 로그 확인 방법

### 1. Cloudflare Pages 로그 확인 (제한적)

Cloudflare Pages는 Workers와 달리 대시보드에서 직접 로그를 확인하기 어렵습니다. 다음 방법들을 사용하세요:

**방법 1: Wrangler CLI 사용 (로컬 개발 시)**
```bash
# Wrangler 설치 (아직 설치하지 않은 경우)
npm install -g wrangler

# 로그인
wrangler login

# 실시간 로그 확인
wrangler pages deployment tail
```

**방법 2: Cloudflare Dashboard Analytics**
- Cloudflare 대시보드 → Workers & Pages → 프로젝트 선택
- Analytics 탭에서 요청 통계 확인 (로그 내용은 확인 불가)

**방법 3: 브라우저 콘솔 및 Network 탭 활용 (권장)**
- 아래 "브라우저 콘솔 로그 확인" 섹션 참조

### 2. 로그인 API 로그 확인 포인트

로그인 시 다음 로그들이 출력됩니다:

```
=== LOGIN API CALLED ===
Login - Request body received: { username: '...', hasPassword: true }
Login - Extracted credentials: { username: '...', hasPassword: true }
Login - Querying database for user: ...
Login - User found: { id: ..., username: ..., role: ... }
Login - Hashing password...
Login - Password hash generated, length: 64
Login - Comparing password hashes...
Login - Password verified
Login - Token data string length: ...
Login - Token generated, length: ...
Login - Token first 50 chars: ...
Login - SUCCESS for user: ...
```

### 3. 토큰 디코딩 로그 확인

판매자 페이지 접근 시 다음 로그들이 출력됩니다:

```
getTokenFromRequest - Checking headers
getTokenFromRequest - Authorization header: exists (length: ...)
getTokenFromRequest - Extracted token length: ...
getTokenFromRequest - Extracted token first 50 chars: ...
decodeToken - Input token length: ...
decodeToken - Success: { userId: ..., username: ..., role: ... }
getTokenFromRequest - Decode result: SUCCESS
```

### 4. 에러 발생 시 확인할 로그

- `Login - User not found:` - 사용자가 데이터베이스에 없음
- `Login - Password mismatch` - 비밀번호가 일치하지 않음
- `Login - Token generation error:` - 토큰 생성 실패
- `decodeToken - Error:` - 토큰 디코딩 실패
- `getTokenFromRequest - No authorization header` - Authorization 헤더 없음

### 5. 브라우저 콘솔 로그 확인 (가장 중요!)

**Cloudflare Pages에서는 브라우저 콘솔이 가장 중요한 디버깅 도구입니다.**

1. **F12 키를 눌러 개발자 도구 열기**
2. **Console 탭 확인**
   - 모든 `console.log`, `console.error` 메시지 확인
   - 특히 에러 메시지 (빨간색으로 표시됨)

3. **확인할 로그들:**
   - `Login - Token received, length: ...`
   - `Login - Token saved, verification: SUCCESS`
   - `API Request - Authorization header added, length: ...`
   - `SellerDashboard - User authenticated: ...`
   - `데이터 조회 실패: ...` (에러 발생 시)

### 6. 네트워크 탭 확인 (매우 중요!)

**Network 탭에서 API 요청/응답을 자세히 확인할 수 있습니다.**

1. **F12 → Network 탭 열기**
2. **페이지 새로고침 또는 로그인 시도**
3. **필터에서 "Fetch/XHR" 선택** (API 요청만 보기)

4. **`/api/v1/auth/login` 요청 확인:**
   - 클릭하여 상세 정보 확인
   - **Headers 탭:**
     - Request Headers 확인
     - Response Headers 확인
   - **Payload 탭:**
     - 요청 본문 확인 (username, password)
   - **Response 탭:**
     - Status Code: 200 (성공) 또는 401/500 (실패)
     - Response Body 전체 내용 확인
     - 에러 메시지 확인

5. **`/api/v1/contents/seller/list` 요청 확인:**
   - **Headers 탭:**
     - Request Headers에 `Authorization: Bearer ...` 포함 여부 확인
     - Authorization 헤더 값의 길이 확인
   - **Response 탭:**
     - Status Code: 200 (성공) 또는 401 (인증 실패)
     - Response Body의 에러 메시지 확인
     - `{ error: "...", details: "..." }` 형식의 에러 확인

### 7. 문제 해결 체크리스트

- [ ] 로그인 API가 호출되는가? (`=== LOGIN API CALLED ===` 로그 확인)
- [ ] 사용자가 데이터베이스에 존재하는가? (`Login - User found` 로그 확인)
- [ ] 비밀번호가 일치하는가? (`Login - Password verified` 로그 확인)
- [ ] 토큰이 생성되는가? (`Login - Token generated` 로그 확인)
- [ ] 토큰이 클라이언트에 저장되는가? (브라우저 콘솔에서 `Login - Token saved` 확인)
- [ ] API 요청 시 Authorization 헤더가 포함되는가? (Network 탭에서 확인)
- [ ] 토큰이 서버에서 디코딩되는가? (`decodeToken - Success` 로그 확인)

### 8. 로그 공유 방법 (Cloudflare Pages용)

**Cloudflare Pages에서는 브라우저 콘솔과 Network 탭 정보가 가장 중요합니다!**

문제가 지속되면 다음 정보를 스크린샷 또는 텍스트로 공유해주세요:

1. **브라우저 콘솔 로그 (필수!)**
   - F12 > Console 탭
   - 모든 로그를 복사하거나 스크린샷
   - 특히 빨간색 에러 메시지

2. **Network 탭 정보 (필수!)**
   - `/api/v1/auth/login` 요청:
     - Status Code
     - Response 탭의 전체 내용 (복사)
   - `/api/v1/contents/seller/list` 요청:
     - Status Code
     - Headers 탭의 Request Headers (Authorization 헤더 포함)
     - Response 탭의 전체 내용 (복사)

3. **사용한 계정 정보**
   - 사용자명 (비밀번호는 공유하지 마세요)
   - 역할 (admin, seller, buyer)

4. **에러 발생 시점**
   - 로그인 시도 시?
   - 판매자 페이지 접근 시?
   - 특정 작업 수행 시?

