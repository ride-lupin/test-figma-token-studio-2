#!/usr/bin/env node
/**
 * tokens.json Diff 리포트 생성 스크립트
 * - 이전 커밋과 현재 tokens.json 비교
 * - 추가/변경/삭제 토큰 분류
 * - GitHub Actions Summary 마크다운 출력
 * - DIFF_REPORT 환경변수로 notify.js에 결과 전달
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TOKEN_PATH = path.resolve(__dirname, '../tokens.json');

// --- 유틸 ---

function flattenTokens(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && 'value' in value) {
      // 새 형식: { value, opacity, description, ... }
      result[fullKey] = value.value;
    } else if (value && typeof value === 'object' && '$value' in value) {
      // 구 형식: { $value, $type, ... }
      result[fullKey] = value.$value;
    } else if (value && typeof value === 'object') {
      Object.assign(result, flattenTokens(value, fullKey));
    }
  }
  return result;
}

function valueToString(val) {
  if (typeof val === 'object' && val !== null) {
    return JSON.stringify(val);
  }
  return String(val);
}

// --- 이전 버전 가져오기 ---

function getPreviousTokens() {
  try {
    const raw = execSync('git show HEAD~1:tokens.json', { encoding: 'utf-8' });
    return JSON.parse(raw);
  } catch {
    // 첫 커밋이거나 이전 버전 없으면 빈 객체
    return {};
  }
}

// --- Diff 계산 ---

function computeDiff(prev, curr) {
  const prevFlat = flattenTokens(prev);
  const currFlat = flattenTokens(curr);

  const added = [];
  const changed = [];
  const removed = [];

  for (const [key, currVal] of Object.entries(currFlat)) {
    if (!(key in prevFlat)) {
      added.push({ key, value: currVal });
    } else if (valueToString(prevFlat[key]) !== valueToString(currVal)) {
      changed.push({ key, from: prevFlat[key], to: currVal });
    }
  }

  for (const [key, prevVal] of Object.entries(prevFlat)) {
    if (!(key in currFlat)) {
      removed.push({ key, value: prevVal });
    }
  }

  return { added, changed, removed };
}

// --- 마크다운 리포트 생성 ---

function buildMarkdown({ added, changed, removed }) {
  const total = added.length + changed.length + removed.length;

  if (total === 0) {
    return '## 🎨 Design Token 변경사항\n\n변경사항 없음';
  }

  const lines = ['## 🎨 Design Token 변경사항', ''];

  if (changed.length > 0) {
    lines.push(`### ✏️ 변경된 토큰 (${changed.length}개)`, '');
    lines.push('| 토큰 | 이전 값 | 변경 값 |');
    lines.push('|------|---------|---------|');
    for (const { key, from, to } of changed) {
      lines.push(`| \`${key}\` | ${valueToString(from)} | ${valueToString(to)} |`);
    }
    lines.push('');
  }

  if (added.length > 0) {
    lines.push(`### ➕ 추가된 토큰 (${added.length}개)`, '');
    lines.push('| 토큰 | 값 |');
    lines.push('|------|-----|');
    for (const { key, value } of added) {
      lines.push(`| \`${key}\` | ${valueToString(value)} |`);
    }
    lines.push('');
  }

  if (removed.length > 0) {
    lines.push(`### 🗑️ 삭제된 토큰 (${removed.length}개)`, '');
    lines.push('| 토큰 | 이전 값 |');
    lines.push('|------|---------|');
    for (const { key, value } of removed) {
      lines.push(`| \`${key}\` | ${valueToString(value)} |`);
    }
    lines.push('');
  }

  lines.push(`---`, `**총 변경: ${total}건** (추가 ${added.length} / 변경 ${changed.length} / 삭제 ${removed.length})`);

  return lines.join('\n');
}

// --- GitHub Actions Summary 출력 ---

function writeToSummary(markdown) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath) {
    fs.appendFileSync(summaryPath, markdown + '\n');
    console.log('✅ GitHub Actions Summary에 diff 리포트 기록 완료');
  }
}

// --- GITHUB_OUTPUT으로 notify.js에 전달 ---

function writeToOutput(markdown) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (outputPath) {
    const escaped = markdown.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
    fs.appendFileSync(outputPath, `diff_report=${escaped}\n`);
  }
  // 로컬 실행 시 임시 파일로도 저장 (notify.js가 참조)
  fs.writeFileSync(path.resolve(__dirname, '../.diff-report.md'), markdown);
}

// --- 메인 실행 ---

console.log('📊 tokens.json diff 분석 시작...\n');

const current = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
const previous = getPreviousTokens();

const diff = computeDiff(previous, current);
const { added, changed, removed } = diff;
const total = added.length + changed.length + removed.length;

// 콘솔 출력
if (total === 0) {
  console.log('변경사항 없음');
} else {
  if (changed.length > 0) {
    console.log(`✏️  변경된 토큰 (${changed.length}개):`);
    for (const { key, from, to } of changed) {
      console.log(`   ${key}: ${valueToString(from)} → ${valueToString(to)}`);
    }
  }
  if (added.length > 0) {
    console.log(`➕ 추가된 토큰 (${added.length}개):`);
    for (const { key, value } of added) {
      console.log(`   ${key}: ${valueToString(value)}`);
    }
  }
  if (removed.length > 0) {
    console.log(`🗑️  삭제된 토큰 (${removed.length}개):`);
    for (const { key, value } of removed) {
      console.log(`   ${key}: ${valueToString(value)}`);
    }
  }
  console.log(`\n총 변경: ${total}건`);
}

const markdown = buildMarkdown(diff);
writeToSummary(markdown);
writeToOutput(markdown);
