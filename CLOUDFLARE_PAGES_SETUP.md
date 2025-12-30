# Cloudflare Pages 배포 설정 가이드

## 문제 해결

### 발생한 오류
```
✘ [ERROR] It looks like you've run a Workers-specific command in a Pages project.
For Pages, please run `wrangler pages deploy` instead.
```

### 원인
Cloudflare Pages 대시보드에서 "Deploy command"가 `npx wrangler deploy`로 설정되어 있어서 발생한 오류입니다.

### 해결 방법

#### 1. Cloudflare Pages 대시보드 설정 수정

1. Cloudflare 대시보드 → Pages → 프로젝트 선택
2. **Settings** → **Builds & deployments** 섹션으로 이동
3. **Deploy command** 필드를 **비워두거나 제거**합니다
   - Cloudflare Pages는 빌드 후 자동으로 배포되므로 별도의 deploy 명령이 필요 없습니다
   - Functions는 `functions` 폴더를 자동으로 감지하여 배포됩니다

#### 2. 빌드 설정 확인

다음 설정이 올바르게 되어 있는지 확인하세요:

- **Build command**: `cd client && npm install && npm run build`
- **Build output directory**: `client/build`
- **Root directory**: `/` (프로젝트 루트)
- **Node.js version**: `18` (또는 환경 변수에서 설정)

#### 3. 환경 변수 설정

**Settings** → **Environment variables**에서 필요한 환경 변수를 설정하세요:

- `NODE_VERSION`: `18`
- 기타 필요한 환경 변수들

#### 4. Functions 배포

`functions` 폴더의 Functions는 자동으로 배포됩니다. 별도의 deploy 명령이 필요하지 않습니다.

## 배포 프로세스

1. **GitHub에 푸시** → Cloudflare Pages가 자동으로 감지
2. **빌드 실행** → `cd client && npm install && npm run build`
3. **자동 배포** → 빌드된 파일과 Functions가 자동으로 배포됨

## 수동 배포 (필요한 경우)

로컬에서 수동으로 배포하려면:

```bash
# 빌드
npm run client:build

# Pages 배포 (Functions 포함)
npx wrangler pages deploy client/build
```

## 참고사항

- `wrangler deploy`는 Workers용 명령입니다
- Pages 프로젝트는 `wrangler pages deploy`를 사용하거나 자동 배포를 사용합니다
- `wrangler.toml`의 환경 설정은 Functions 배포 시에만 사용됩니다

