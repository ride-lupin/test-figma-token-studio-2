# Task ID: 4

**Title:** 토큰 변경사항 Diff 리포트 생성 스크립트 개발

**Status:** done

**Dependencies:** 2 ✓

**Priority:** medium

**Description:** 이전 커밋과 현재 tokens.json을 비교하여 변경사항을 분석하고 리포트를 생성하는 스크립트 작성

**Details:**

scripts/diff.js 파일 작성:
1. git show HEAD~1:tokens.json으로 이전 버전 가져오기
2. 현재 tokens.json과 deep comparison 수행
3. 추가된 토큰 (➕), 변경된 토큰 (✏️), 삭제된 토큰 (🗑️) 분류
4. 변경 내용을 사람이 읽기 쉬운 형태로 포맷팅
5. GitHub Actions Summary 형식으로 마크다운 출력
6. 변경사항이 없을 경우 '변경사항 없음' 메시지 출력
7. 출력 예시: '🎨 변경된 토큰 (3개)\n✏️ palette.blue.600: #0A93FF → #0080FF'

**Test Strategy:**

의도적으로 토큰을 수정한 테스트 커밋을 생성하여 추가/변경/삭제 케이스별로 올바른 diff 리포트가 생성되는지 확인
