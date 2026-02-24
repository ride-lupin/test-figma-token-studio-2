# Task ID: 10

**Title:** Figma MCP 코드 변환 규칙 문서화 및 가이드 작성

**Status:** pending

**Dependencies:** 8

**Priority:** low

**Description:** Figma MCP 출력을 프로젝트 컴포넌트 코드로 변환하는 규칙과 Vanilla Extract 스타일 작성 가이드 문서화

**Details:**

1. docs/figma-mcp-conversion-guide.md 파일 작성
2. 스타일 변환 규칙 정의:
   - CSS 변수 → vars.* 토큰 매핑 테이블
   - Tailwind 클래스 → Vanilla Extract 스타일 변환
   - 타이포그래피 클래스 → vars.typoType 매핑
3. 레이아웃 변환 규칙 정의:
   - Figma 구조 → 프로젝트 컴포넌트 매핑
   - Asset/Section → AccordionSection
   - Asset/Set → ListSection 등
4. Vanilla Extract 스타일 작성 가이드:
   - style.css.ts 파일 구조
   - recipe() 사용법
   - vars.* 토큰 참조 방법
   - 인라인 스타일 금지 규칙
5. 실제 변환 예시 코드 제공
6. 자주 발생하는 변환 패턴 정리

**Test Strategy:**

문서의 변환 규칙을 따라 실제 Figma MCP 출력을 프로젝트 코드로 변환해보고, 올바르게 작동하는지 확인. 가이드의 예시 코드들이 실제 프로젝트에서 컴파일되고 실행되는지 검증
