#!/usr/bin/env node
/**
 * 알림 스크립트
 * - GitHub Actions Summary: 항상 출력 (diff.js가 먼저 기록)
 * - Slack: SLACK_BOT_TOKEN + SLACK_CHANNEL_ID 환경변수 존재 시
 * - Notion: NOTION_TOKEN + NOTION_DATABASE_ID 환경변수 존재 시
 * - PR 코멘트: GITHUB_TOKEN + PR_NUMBER 환경변수 존재 시
 *
 * 알림 실패 시에도 exit code 0 유지 (알림은 부가 기능)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// --- diff 리포트 읽기 ---

function getDiffReport() {
  const reportPath = path.resolve(__dirname, '../.diff-report.md');
  if (fs.existsSync(reportPath)) {
    return fs.readFileSync(reportPath, 'utf-8');
  }
  return '## 🎨 Design Token 변경사항\n\n(diff 리포트 없음)';
}

// --- HTTP POST 유틸 ---

function httpPost(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request(
      { hostname, path, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data), ...headers } },
      (res) => {
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body: raw }));
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function httpPatch(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request(
      { hostname, path, method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data), ...headers } },
      (res) => {
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body: raw }));
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// --- Slack 알림 ---

async function notifySlack(report) {
  const token = process.env.SLACK_BOT_TOKEN;
  const channel = process.env.SLACK_CHANNEL_ID;
  if (!token || !channel) return;

  const prUrl = process.env.PR_URL || '';
  const commitMsg = process.env.COMMIT_MESSAGE || '(커밋 메시지 없음)';
  const actionsUrl = process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : '';

  const text = [
    `🎨 *Design Token 변경 감지*`,
    `커밋: ${commitMsg}`,
    prUrl ? `PR: ${prUrl}` : '',
    actionsUrl ? `Actions: ${actionsUrl}` : '',
  ].filter(Boolean).join('\n');

  try {
    const res = await httpPost('slack.com', '/api/chat.postMessage',
      { Authorization: `Bearer ${token}` },
      { channel, text, mrkdwn: true }
    );
    const parsed = JSON.parse(res.body);
    if (parsed.ok) {
      console.log(`✅ Slack 알림 전송 완료 (channel: ${channel})`);
    } else {
      console.warn(`⚠️  Slack 알림 실패: ${parsed.error}`);
    }
  } catch (e) {
    console.warn(`⚠️  Slack 알림 오류: ${e.message}`);
  }
}

// --- Notion 알림 ---

async function notifyNotion(report) {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!token || !databaseId) return;

  const commitMsg = process.env.COMMIT_MESSAGE || '(커밋 메시지 없음)';
  const prUrl = process.env.PR_URL || '';
  const actionsUrl = process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : '';

  const body = {
    parent: { database_id: databaseId },
    properties: {
      Name: { title: [{ text: { content: `Token 변경: ${commitMsg}` } }] },
      날짜: { date: { start: new Date().toISOString() } },
      커밋: { rich_text: [{ text: { content: commitMsg } }] },
      PR: prUrl ? { url: prUrl } : { url: null },
      'Actions URL': actionsUrl ? { url: actionsUrl } : { url: null },
    },
    children: [
      {
        object: 'block',
        type: 'code',
        code: { rich_text: [{ text: { content: report } }], language: 'markdown' },
      },
    ],
  };

  try {
    const res = await httpPost('api.notion.com', '/v1/pages',
      { Authorization: `Bearer ${token}`, 'Notion-Version': '2022-06-28' },
      body
    );
    if (res.status === 200) {
      console.log('✅ Notion DB 레코드 생성 완료');
    } else {
      console.warn(`⚠️  Notion 알림 실패 (status: ${res.status})`);
    }
  } catch (e) {
    console.warn(`⚠️  Notion 알림 오류: ${e.message}`);
  }
}

// --- PR 코멘트 ---

async function notifyPrComment(report) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;
  const prNumber = process.env.PR_NUMBER;
  if (!token || !repo || !prNumber) return;

  try {
    const res = await httpPost('api.github.com', `/repos/${repo}/issues/${prNumber}/comments`,
      { Authorization: `Bearer ${token}`, 'User-Agent': 'token-sync-bot' },
      { body: report }
    );
    if (res.status === 201) {
      console.log(`✅ PR #${prNumber} 코멘트 추가 완료`);
    } else {
      console.warn(`⚠️  PR 코멘트 실패 (status: ${res.status})`);
    }
  } catch (e) {
    console.warn(`⚠️  PR 코멘트 오류: ${e.message}`);
  }
}

// --- 메인 실행 ---

(async () => {
  console.log('📣 알림 발송 시작...\n');

  const report = getDiffReport();

  // 어떤 알림 채널이 활성화되어 있는지 표시
  const channels = [];
  if (process.env.SLACK_BOT_TOKEN && process.env.SLACK_CHANNEL_ID) channels.push('Slack');
  if (process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID) channels.push('Notion');
  if (process.env.GITHUB_TOKEN && process.env.PR_NUMBER) channels.push('PR 코멘트');
  if (process.env.GITHUB_STEP_SUMMARY) channels.push('GitHub Summary');

  if (channels.length === 0) {
    console.log('ℹ️  활성화된 알림 채널 없음 (환경변수 미설정)');
  } else {
    console.log(`활성 채널: ${channels.join(', ')}`);
  }

  // 병렬 실행 — 실패해도 계속 진행
  await Promise.allSettled([
    notifySlack(report),
    notifyNotion(report),
    notifyPrComment(report),
  ]);

  console.log('\n✅ 알림 단계 완료');
})();
