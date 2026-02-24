# Task ID: 1

**Title:** Token Studio GitHub 연동 설정 (tokens/sync 브랜치)

**Status:** done

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

## Subtasks

### 1.1. Token Studio 플러그인 설치 및 GitHub PAT 발급

**Status:** done  
**Dependencies:** None  

Figma Token Studio 플러그인 설치 및 GitHub Personal Access Token 발급

**Details:**

1. Figma에서 Token Studio 플러그인 설치 (Community → Tokens Studio for Figma 검색)
2. GitHub Personal Access Token 발급:
   - GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens
   - Repository 권한: ridenow-frontend read/write
   - 권한 항목: Contents (read/write), Metadata (read)
3. 발급된 PAT을 안전한 곳에 임시 보관

### 1.2. Token Studio GitHub 연동 설정

**Status:** done  
**Dependencies:** 1.1  

Token Studio 플러그인에서 GitHub 저장소 연동 설정 구성

**Details:**

Token Studio 플러그인에서 GitHub 연동 설정:
1. 플러그인 실행 → Settings → Sync → GitHub 선택
2. 설정 값 입력:
   - Repository: owner/ridenow-frontend
   - Branch: tokens/sync  ← main 대신 전용 브랜치 사용
   - File path: tokens.json
   - Token (PAT): 1.1에서 발급한 토큰 입력

⚠️ main 브랜치 직접 push 금지: PR 리뷰 플로우 유지를 위해
   Token Studio는 항상 tokens/sync 브랜치에만 push

### 1.3. 초기 tokens.json 구조 생성 및 연결 확인

**Status:** done  
**Dependencies:** 1.2  

W3C Design Token 형식의 초기 tokens.json 생성 및 tokens/sync 브랜치 연결 상태 확인

**Details:**

1. Token Studio에서 W3C Design Token 형식으로 기본 토큰 구조 생성:
   - palette (색상 토큰: gray, blue 등)
   - typography (타이포그래피: $type: typography)
   - space (여백: $type: dimension)
   - shadow (그림자: $type: shadow)
2. 플러그인 상단 Push 버튼 클릭
3. GitHub tokens/sync 브랜치에 tokens.json 생성 확인
4. main 브랜치에는 직접 반영되지 않았는지 확인
