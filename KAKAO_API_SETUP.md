# 카카오 API 설정 가이드

카카오 공식 API를 사용하여 프로필과 사진을 조회하는 방법입니다.

## 1. 카카오 개발자 센터 앱 등록

1. [카카오 개발자 센터](https://developers.kakao.com/) 접속
2. 내 애플리케이션 → 애플리케이션 추가하기
3. 앱 이름, 사업자명 입력 후 저장

## 2. 플랫폼 설정

1. 플랫폼 → Web 플랫폼 등록
2. 사이트 도메인 등록 (예: `http://localhost:3000`)

## 3. 카카오 로그인 활성화

1. 제품 설정 → 카카오 로그인 → 활성화 설정: ON
2. Redirect URI 등록:
   - 개발: `http://localhost:3000/auth/kakao/callback`
   - 운영: `https://yourdomain.com/auth/kakao/callback`

## 4. 동의항목 설정

1. 제품 설정 → 카카오 로그인 → 동의항목
2. 필수 동의항목:
   - 닉네임
   - 프로필 사진
   - 카카오계정(이메일) - 선택
   - 전화번호 - 선택

## 5. REST API 키 확인

1. 앱 설정 → 앱 키
2. REST API 키 복사

## 6. 환경 변수 설정

`.env` 파일 생성:

```env
VITE_KAKAO_REST_API_KEY=your_rest_api_key_here
VITE_KAKAO_REDIRECT_URI=http://localhost:3000/auth/kakao/callback
VITE_API_BASE_URL=http://localhost:8000/api
```

## 7. 백엔드 API 구현 필요

현재 프론트엔드만 구현되어 있습니다. 실제로 동작하려면 백엔드 API가 필요합니다:

### 필요한 API 엔드포인트:

1. **POST `/api/auth/kakao/token`**
   - 카카오 인증 코드를 액세스 토큰으로 교환
   - 카카오 API: `POST https://kauth.kakao.com/oauth/token`

2. **GET `/api/profile`**
   - 전화번호/아이디로 프로필 조회
   - 주의: 다른 사용자 정보는 동의 없이 조회할 수 없습니다

3. **GET `/api/photos`**
   - 사용자의 사진 목록 조회
   - 카카오톡은 공식적으로 메시지/사진 조회 API를 제공하지 않으므로
   - 실제 구현 시 대안이 필요합니다

## 중요 사항

⚠️ **제약사항:**

1. **카카오톡 메시지/사진 API 없음**
   - 카카오는 공식적으로 카카오톡 메시지나 사진 조회 API를 제공하지 않습니다
   - 따라서 과거 사진 조회 기능은 제한적입니다

2. **사용자 동의 필요**
   - 다른 사용자의 정보를 조회하려면 해당 사용자의 명시적 동의가 필요합니다
   - 개인정보 보호법 준수 필수

3. **본인 정보만 조회 가능**
   - 카카오 로그인을 통해 본인의 프로필 정보만 조회할 수 있습니다

## 대안 방법

카카오톡 사진 조회가 불가능하므로, 다음 대안을 고려할 수 있습니다:

1. **사용자 직접 업로드**
   - 사용자가 직접 사진을 업로드하여 앨범 형식으로 제공

2. **카카오톡 채널 연동**
   - 카카오톡 채널 API를 통해 채널 메시지 조회 (공개 채널만)

3. **카카오스토리 API**
   - 카카오스토리 API를 통해 스토리 사진 조회 (사용자 동의 필요)

## 참고 링크

- [카카오 개발자 문서](https://developers.kakao.com/docs)
- [카카오 로그인 REST API](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api)
- [카카오 사용자 정보 가져오기](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#req-user-info)

