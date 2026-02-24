# Task ID: 6

**Title:** GitHub Actions 워크플로우 구축 (검증 + PR 자동 생성)

**Status:** done

**Dependencies:** 3 ✓, 5 ✓

**Priority:** high

**Description:** tokens/sync 브랜치 push 감지 시 자동 검증, PR 생성, diff 리포트 및 알림 워크플로우 작성

**Details:**

.github/workflows/sync-tokens.yml 파일 작성:
1. 트리거: tokens/sync 브랜치에 tokens.json 변경 push 시 + workflow_dispatch
2. ubuntu-latest 환경에서 Node.js 20 설정
3. fetch-depth: 0으로 전체 히스토리 체크아웃
4. validate.js 실행하여 토큰 유효성 검증 (실패 시 워크플로우 중단, PR 미생성)
5. diff.js 실행하여 변경사항 분석
6. PR 자동 생성/업데이트 (gh CLI 또는 peter-evans/create-pull-request 액션 활용):
   - tokens/sync → main 방향으로 PR 생성
   - 이미 열린 PR이 있으면 본문만 업데이트 (중복 방지)
   - PR 제목: "chore(tokens): {커밋 메시지}"
   - PR 본문: diff 리포트 자동 삽입
   - label: "tokens" 자동 부착
7. notify.js 실행하여 Slack/Notion 알림 (PR URL 포함)
8. GitHub Secrets: SLACK_BOT_TOKEN, NOTION_TOKEN, NOTION_DATABASE_ID (선택적)
   GH_TOKEN은 GITHUB_TOKEN 자동 제공 활용

**Test Strategy:**

tokens/sync 브랜치에 tokens.json 수정 후 push → ① 검증 통과, ② main으로의 PR 자동 생성, ③ PR 본문에 diff 리포트 포함 확인. 의도적 오류 토큰 push 시 검증 실패로 PR 미생성 확인
