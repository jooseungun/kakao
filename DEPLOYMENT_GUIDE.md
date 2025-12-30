# Cloudflare Pages 배포 가이드

## 빌드 오류 해결

만약 `cd client` 오류가 발생한다면, Cloudflare Pages 대시보드에서 빌드 설정을 확인하세요.

## Cloudflare Pages 설정

1. Cloudflare 대시보드 → Pages → 프로젝트 선택
2. **Settings** → **Builds & deployments** 섹션
3. 다음 설정 확인:

### 빌드 설정

- **Build command**: `npm install && npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (또는 비워두기)
- **Node.js version**: `18` 또는 `20`

### 환경 변수 (선택사항)

**Settings** → **Environment variables**:

- `VITE_KAKAO_REST_API_KEY`: 카카오 REST API 키
- `VITE_KAKAO_REDIRECT_URI`: 배포된 사이트의 리다이렉트 URI
- `VITE_API_BASE_URL`: 백엔드 API URL

## 빌드 프로세스

1. GitHub에 푸시
2. Cloudflare Pages가 자동으로 감지
3. `npm install` 실행
4. `npm run build` 실행 (Vite가 `dist` 폴더에 빌드)
5. `dist` 폴더 내용 배포

## 문제 해결

### 오류: `cd client: can't cd to client`

- **원인**: 빌드 명령에 `cd client`가 포함되어 있음
- **해결**: 빌드 명령을 `npm install && npm run build`로 변경

### 오류: `vite: command not found`

- **원인**: 의존성이 제대로 설치되지 않음
- **해결**: 빌드 명령에 `npm install`이 포함되어 있는지 확인

### 빌드는 성공하지만 사이트가 표시되지 않음

- **원인**: Build output directory가 잘못 설정됨
- **해결**: `dist`로 설정되어 있는지 확인

