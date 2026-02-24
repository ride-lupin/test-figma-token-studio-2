# Task ID: 5

**Title:** 개발팀 알림 시스템 구축

**Status:** pending

**Dependencies:** 4

**Priority:** medium

**Description:** 토큰 변경사항을 다양한 채널(GitHub Actions Summary, Slack, Notion)로 알림하는 스크립트 개발

**Details:**

scripts/notify.js 파일 작성:
1. GitHub Actions Summary에 diff 리포트 출력 (기본)
2. SLACK_BOT_TOKEN 환경변수 존재 시 Slack DM 발송
3. NOTION_TOKEN, NOTION_DATABASE_ID 환경변수 존재 시 Notion DB에 레코드 생성
4. PR 컨텍스트에서 실행 시 PR 코멘트 추가
5. Notion 레코드 필드: 변경일시, 커밋메시지, 추가/변경/삭제 토큰 목록, Actions URL
6. 알림 실패 시에도 전체 워크플로우는 성공으로 처리 (알림은 부가 기능)
7. 환경변수별 조건부 실행으로 유연한 알림 채널 설정

**Test Strategy:**

각 알림 채널별로 환경변수를 설정/해제하며 올바른 채널에만 알림이 발송되는지 확인. Notion DB에 올바른 형식의 레코드가 생성되는지 검증
