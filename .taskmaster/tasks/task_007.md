# Task ID: 7

**Title:** Code Connect 패키지 설치 및 기본 설정

**Status:** pending

**Dependencies:** None

**Priority:** medium

**Description:** Figma Code Connect를 위한 패키지 설치 및 기본 설정 구성

**Details:**

1. @figma/code-connect 패키지 설치
2. figma.config.ts 파일 생성 및 기본 설정
3. Figma Personal Access Token 발급 (Code Connect용)
4. .env 파일에 FIGMA_ACCESS_TOKEN 추가
5. package.json에 Code Connect 관련 스크립트 추가:
   - figma:connect:create
   - figma:connect:publish
   - figma:connect:parse
6. .gitignore에 Figma 관련 임시 파일 패턴 추가
7. Code Connect 디렉토리 구조 계획 수립

**Test Strategy:**

figma connect --help 명령어가 정상 작동하고, Figma 토큰 인증이 성공하는지 확인. 기본 설정 파일들이 올바른 형식으로 생성되었는지 검증
