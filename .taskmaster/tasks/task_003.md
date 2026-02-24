# Task ID: 3

**Title:** 토큰 유효성 검증 스크립트 개발

**Status:** done

**Dependencies:** 2 ✓

**Priority:** high

**Description:** tokens.json 파일의 W3C Design Token 형식 준수 및 데이터 유효성을 검증하는 스크립트 작성

**Details:**

scripts/validate.js 파일 작성:
1. JSON 파싱 오류 확인
2. W3C Design Token 형식 검증 ($value, $type 필드 존재)
3. 필수 카테고리 존재 여부 확인 (palette, space, typography)
4. 색상 값 형식 검증 (hex, rgba 패턴)
5. 타이포그래피 객체 구조 검증 (fontFamily, fontWeight, fontSize, lineHeight)
6. dimension 타입 숫자 값 검증
7. shadow 타입 CSS 문법 검증
8. 검증 실패 시 상세한 오류 메시지와 함께 exit code 1 반환

**Test Strategy:**

유효한 tokens.json과 의도적으로 오류가 있는 tokens.json 파일로 테스트하여 올바른 검증 결과와 오류 메시지가 출력되는지 확인
