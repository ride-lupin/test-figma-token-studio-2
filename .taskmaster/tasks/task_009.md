# Task ID: 9

**Title:** Code Connect 자동 배포 시스템 구축

**Status:** pending

**Dependencies:** 8

**Priority:** low

**Description:** Code Connect 매핑 파일 변경 시 Figma에 자동 배포하는 GitHub Actions 워크플로우 구축

**Details:**

1. .github/workflows/deploy-code-connect.yml 파일 작성
2. 트리거: **/*.figma.tsx 파일 변경 시 + workflow_dispatch
3. Node.js 환경 설정 및 의존성 설치
4. FIGMA_ACCESS_TOKEN 시크릿 설정
5. figma connect publish 명령어 실행
6. 배포 성공/실패 결과를 GitHub Actions Summary에 출력
7. 배포 실패 시 상세 오류 로그 출력
8. 기존 sync-tokens.yml 워크플로우에 Code Connect 배포 단계 추가 (선택적)
9. 배포 결과를 Slack으로 알림 (선택적)

**Test Strategy:**

.figma.tsx 파일을 수정하여 커밋 시 워크플로우가 자동 실행되고, figma connect publish가 성공하는지 확인. Figma에서 업데이트된 Code Connect 정보가 반영되었는지 검증
