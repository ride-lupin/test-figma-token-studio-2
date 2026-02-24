# Task ID: 2

**Title:** 루트 tokens.json 구조 및 스크립트 초기 설정

**Status:** done

**Dependencies:** 1

**Priority:** high

**Description:** 프로젝트 루트의 tokens.json 파일 관리 구조와 스크립트 디렉토리 초기 설정

**Details:**

1. 루트 tokens.json이 이미 존재하므로 W3C Design Token 형식으로 구조 정비
2. scripts/ 디렉토리 생성 (프로젝트 루트 기준)
3. package.json에 필요한 의존성 추가:
   - @notionhq/client (Notion 연동용)
   - ajv (JSON 스키마 검증용)
4. tokens.json 스키마 정의 파일 생성
5. 기본 토큰 카테고리 구조 확인 및 정비 (palette, typography, space, shadow)

**Test Strategy:**

루트 tokens.json 파일이 올바른 W3C Design Token 형식을 따르는지 JSON 파싱 및 스키마 검증으로 확인
