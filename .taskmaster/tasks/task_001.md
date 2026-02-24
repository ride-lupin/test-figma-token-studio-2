# Task ID: 1

**Title:** Token Studio GitHub 연동 설정 (tokens/sync 브랜치)

**Status:** pending

**Dependencies:** None

**Priority:** high

**Description:** Figma Token Studio 플러그인 설치 및 GitHub 저장소 연동 설정 — PR 플로우를 위해 tokens/sync 전용 브랜치 사용

**Details:**

1. Figma에서 Token Studio 플러그인 설치
2. GitHub Personal Access Token 발급 (Fine-grained Token, ridenow-frontend 저장소 read/write 권한)
3. Token Studio 플러그인 설정:
   - Settings → Storage → GitHub 선택
   - Repository: owner/ridenow-frontend
   - Branch: tokens/sync  ← main 대신 전용 브랜치 사용
   - File path: tokens.json
4. 초기 Push로 연결 상태 확인 (tokens/sync 브랜치에 tokens.json 생성됨)
5. W3C Design Token 형식으로 기본 토큰 구조 생성 (palette, typography, space, shadow)

⚠️ main 브랜치 직접 push 금지: PR 리뷰 플로우 유지를 위해
   Token Studio는 항상 tokens/sync 브랜치에만 push

**Test Strategy:**

Token Studio에서 테스트 토큰 수정 후 GitHub Push 클릭 → tokens/sync 브랜치에 tokens.json이 업데이트되는지 확인. main 브랜치에는 직접 반영되지 않아야 함
