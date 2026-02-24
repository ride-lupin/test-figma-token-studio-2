# Task ID: 8

**Title:** 주요 컴포넌트 Code Connect 매핑 파일 작성

**Status:** pending

**Dependencies:** 7

**Priority:** medium

**Description:** Button, AccordionSection, ListSection 등 주요 컴포넌트의 Figma-Code 매핑 파일 작성

**Details:**

각 컴포넌트별 .figma.tsx 매핑 파일 작성:
1. Button 컴포넌트 (@ride-developer/rui-web)
2. AccordionSection 컴포넌트 (@components/Layout)
3. ListSection 컴포넌트 (@components/Layout)
4. DataTable 컴포넌트 (@components/DataTable)
5. DataGrid 컴포넌트 (@components/DataGrid)
6. TextField 컴포넌트 (@ridenow-frontend/rui)
7. Dialog 컴포넌트 (@ridenow-frontend/rui)

각 매핑 파일에서:
- figmaNode로 Figma 컴포넌트 ID 연결
- props 매핑 정의 (size, variants, color 등)
- example 코드 제공
- imports 경로 정확히 설정

**Test Strategy:**

각 .figma.tsx 파일이 올바른 TypeScript 문법으로 작성되었는지 확인. figma connect parse 명령어로 매핑 파일 파싱이 성공하는지 검증
