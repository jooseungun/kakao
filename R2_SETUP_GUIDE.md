# Cloudflare R2 썸네일 이미지 저장 설정 가이드

## 1. Cloudflare R2 버킷 생성

1. Cloudflare 대시보드에 로그인
2. R2 메뉴로 이동
3. "Create bucket" 클릭
4. 버킷 이름: `selledu-images`
5. 버킷 생성 완료

## 2. R2 버킷 Public 설정 (선택사항)

R2 버킷을 public으로 설정하면 직접 URL로 접근할 수 있습니다.

### 방법 1: R2 Public URL 사용
- R2 버킷 설정에서 "Public access" 활성화
- Public URL 형식: `https://pub-{account-id}.r2.dev/{file-path}`

### 방법 2: Workers를 통한 제공 (권장)
- 현재 구현된 방식: `/api/v1/images/{file-path}` 엔드포인트 사용
- 더 안전하고 제어 가능한 방식

## 3. wrangler.toml 설정

R2 버킷을 생성한 후 `wrangler.toml` 파일에서 주석을 해제하세요:
```toml
# R2 버킷을 생성한 후 주석 해제
[[r2_buckets]]
binding = "IMAGES"
bucket_name = "selledu-images"
preview_bucket_name = "selledu-images"
```

**중요**: R2 버킷을 생성하기 전에는 이 설정이 주석 처리되어 있어야 배포가 성공합니다.

## 4. 환경 변수 설정

Cloudflare Pages 대시보드에서:
1. 프로젝트 설정 → Environment variables
2. R2 버킷이 자동으로 바인딩됩니다 (wrangler.toml 기반)

## 5. 사용 방법

### 썸네일 업로드
```javascript
const formData = new FormData();
formData.append('file', imageFile);

const response = await api.post('/upload/thumbnail', formData);
// response.data.thumbnail_url 사용
```

### 이미지 URL 형식
- R2 URL: `/api/v1/images/thumbnails/{timestamp}_{random}.{ext}`
- 예시: `/api/v1/images/thumbnails/1234567890_abc123.jpg`

## 6. 파일 구조

R2 버킷 내 파일 구조:
```
selledu-images/
  └── thumbnails/
      ├── 1234567890_abc123.jpg
      ├── 1234567891_def456.png
      └── ...
```

## 7. 주의사항

- 파일 크기 제한: 5MB
- 지원 형식: jpg, jpeg, png, gif, webp
- 캐시 설정: 1년 (31536000초)
- 기존 DB 저장 방식은 R2가 없을 때만 사용됩니다 (fallback)

## 8. 트러블슈팅

### R2 버킷이 인식되지 않는 경우
1. Cloudflare 대시보드에서 버킷이 생성되었는지 확인
2. wrangler.toml의 버킷 이름이 정확한지 확인
3. Cloudflare Pages 프로젝트를 다시 배포

### 이미지가 표시되지 않는 경우
1. R2 버킷의 public 설정 확인
2. `/api/v1/images/[...path].ts` 엔드포인트가 정상 작동하는지 확인
3. 브라우저 콘솔에서 이미지 로드 오류 확인

