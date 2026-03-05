#!/usr/bin/env node
/**
 * tokens.json 유효성 검증 스크립트
 *
 * 플러그인이 생성하는 포맷 기준:
 *   colors    → 리프: { value: "#hex", opacity?: number }
 *   typography → 리프: { fontFamily, fontSize, fontWeight, ... }
 *   effects   → 리프: { effects: [...] }
 *   spacing   → 리프: { value: number }
 */

const fs = require('fs');
const path = require('path');

const TOKEN_PATH = path.resolve(__dirname, '../tokens.json');
const COLOR_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

let errors = [];
let warnings = [];

function error(msg) { errors.push(`  ❌ ${msg}`); }
function warn(msg)  { warnings.push(`  ⚠️  ${msg}`); }

// ─── 파일 로드 ────────────────────────────────────────────────────────────────
function loadTokens() {
  if (!fs.existsSync(TOKEN_PATH)) {
    error(`파일을 찾을 수 없습니다: ${TOKEN_PATH}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
  } catch (e) {
    error(`JSON 파싱 오류: ${e.message}`);
    return null;
  }
}

// ─── 리프 노드 판별 ────────────────────────────────────────────────────────────
function isColorLeaf(obj) {
  return obj && typeof obj === 'object' && typeof obj.value === 'string';
}
function isTypoLeaf(obj) {
  return obj && typeof obj === 'object' && 'fontFamily' in obj;
}
function isSpacingLeaf(obj) {
  return obj && typeof obj === 'object' && typeof obj.value === 'number';
}
function isEffectLeaf(obj) {
  return obj && typeof obj === 'object' && Array.isArray(obj.effects);
}

// ─── 섹션별 검증 ──────────────────────────────────────────────────────────────
function validateColors(obj, nodePath = 'colors') {
  if (!obj || typeof obj !== 'object') return;
  if (isColorLeaf(obj)) {
    if (!COLOR_PATTERN.test(obj.value)) {
      error(`color 형식 오류 (${nodePath}): "${obj.value}" — #hex 형식이어야 합니다`);
    }
    return;
  }
  for (const [key, val] of Object.entries(obj)) {
    validateColors(val, `${nodePath}.${key}`);
  }
}

function validateTypography(obj, nodePath = 'typography') {
  if (!obj || typeof obj !== 'object') return;
  if (isTypoLeaf(obj)) {
    for (const field of ['fontFamily', 'fontSize', 'fontWeight']) {
      if (!(field in obj)) warn(`typography 필드 누락 (${nodePath}): ${field}`);
    }
    return;
  }
  for (const [key, val] of Object.entries(obj)) {
    validateTypography(val, `${nodePath}.${key}`);
  }
}

function validateSpacing(obj, nodePath = 'spacing') {
  if (!obj || typeof obj !== 'object') return;
  if (isSpacingLeaf(obj)) {
    if (typeof obj.value !== 'number') {
      error(`spacing 형식 오류 (${nodePath}): value가 숫자여야 합니다`);
    }
    return;
  }
  for (const [key, val] of Object.entries(obj)) {
    validateSpacing(val, `${nodePath}.${key}`);
  }
}

function validateEffects(obj, nodePath = 'effects') {
  if (!obj || typeof obj !== 'object') return;
  if (isEffectLeaf(obj)) return;
  for (const [key, val] of Object.entries(obj)) {
    validateEffects(val, `${nodePath}.${key}`);
  }
}

// ─── 메인 실행 ────────────────────────────────────────────────────────────────
console.log('🔍 tokens.json 유효성 검증 시작...\n');

const tokens = loadTokens();

if (tokens) {
  if (tokens.colors)     validateColors(tokens.colors);
  else warn('colors 섹션이 없습니다');

  if (tokens.typography) validateTypography(tokens.typography);
  else warn('typography 섹션이 없습니다');

  if (tokens.spacing)    validateSpacing(tokens.spacing);
  else warn('spacing 섹션이 없습니다');

  if (tokens.effects)    validateEffects(tokens.effects);
}

// ─── 결과 출력 ────────────────────────────────────────────────────────────────
if (warnings.length > 0) {
  console.log(`⚠️  경고 (${warnings.length}건):`);
  warnings.forEach(w => console.log(w));
  console.log();
}

if (errors.length > 0) {
  console.log(`❌ 검증 실패 (${errors.length}건):`);
  errors.forEach(e => console.log(e));
  process.exit(1);
} else {
  console.log('✅ 검증 통과 — tokens.json이 올바른 형식입니다.');
}
