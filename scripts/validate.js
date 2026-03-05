#!/usr/bin/env node
/**
 * tokens.json 유효성 검증 스크립트
 * - W3C Design Token 형식 준수 여부 확인
 * - 필수 카테고리 존재 여부 확인
 * - 값 형식 검증 (color, dimension, typography 등)
 */

const fs = require('fs');
const path = require('path');

const TOKEN_PATH = path.resolve(__dirname, '../tokens.json');

const REQUIRED_CATEGORIES = ['colors', 'dimension', 'spacing'];

const COLOR_PATTERN = /^(#([0-9a-fA-F]{3,8})|rgba?\([^)]+\))$/;
const DIMENSION_PATTERN = /^[\d.]+$|^\{[^}]+\}(\s*[*+\-/]\s*\{[^}]+\})*(\s*[*+\-/]\s*[\d.]+)*$/;

let errors = [];
let warnings = [];

function error(msg) {
  errors.push(`  ❌ ${msg}`);
}

function warn(msg) {
  warnings.push(`  ⚠️  ${msg}`);
}

// 1. JSON 파싱
function loadTokens() {
  if (!fs.existsSync(TOKEN_PATH)) {
    error(`tokens.json 파일을 찾을 수 없습니다: ${TOKEN_PATH}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
  } catch (e) {
    error(`JSON 파싱 오류: ${e.message}`);
    return null;
  }
}

// 2. 토큰 노드가 W3C 형식인지 확인 ($type, $value)
function isTokenNode(obj) {
  return obj && typeof obj === 'object' && '$value' in obj;
}

// 3. 토큰 트리를 순회하며 각 노드 검증
function validateTokenNode(node, path) {
  if (typeof node !== 'object' || node === null) return;

  // $type, $value가 있으면 토큰 노드
  if ('$value' in node) {
    if (!('$type' in node)) {
      warn(`$type 누락: ${path}`);
    } else {
      validateTokenValue(node.$type, node.$value, path);
    }
    return;
  }

  // 아니면 그룹 노드 - 재귀 순회 (메타 키 제외)
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    if (typeof value === 'object' && value !== null) {
      validateTokenNode(value, `${path}.${key}`);
    }
  }
}

// 4. $type에 따라 $value 형식 검증
function validateTokenValue(type, value, path) {
  // 참조 형식 ({...})이면 검증 스킵
  if (typeof value === 'string' && value.trim().startsWith('{')) return;

  switch (type) {
    case 'color':
      if (typeof value !== 'string' || !COLOR_PATTERN.test(value.trim())) {
        error(`color 형식 오류 (${path}): "${value}" — hex 또는 rgba() 형식이어야 합니다`);
      }
      break;

    case 'dimension':
    case 'spacing':
    case 'borderRadius':
    case 'borderWidth':
      if (typeof value !== 'string' && typeof value !== 'number') {
        error(`${type} 형식 오류 (${path}): 숫자 또는 문자열이어야 합니다`);
      }
      break;

    case 'typography':
      if (typeof value !== 'object' || value === null) {
        error(`typography 형식 오류 (${path}): 객체이어야 합니다`);
      } else {
        const required = ['fontWeight', 'fontSize', 'lineHeight'];
        for (const field of required) {
          if (!(field in value)) {
            error(`typography 필수 필드 누락 (${path}): ${field}`);
          }
        }
        if (!('fontFamily' in value)) {
          warn(`typography fontFamily 누락 (${path}): 상위 컨텍스트에서 상속되지 않을 경우 렌더링 문제가 발생할 수 있습니다`);
        }
      }
      break;

    case 'boxShadow':
      if (!Array.isArray(value) && typeof value !== 'object') {
        error(`boxShadow 형식 오류 (${path}): 객체 또는 배열이어야 합니다`);
      }
      break;

    case 'opacity':
      if (typeof value === 'string' && !value.endsWith('%') && isNaN(Number(value))) {
        error(`opacity 형식 오류 (${path}): 숫자 또는 백분율(%) 형식이어야 합니다`);
      }
      break;
  }
}

// 5. 필수 카테고리 존재 여부 확인
function validateRequiredCategories(tokens) {
  const core = tokens.core;
  if (!core) {
    error('"core" 그룹이 없습니다');
    return;
  }
  for (const cat of REQUIRED_CATEGORIES) {
    if (!(cat in core)) {
      error(`필수 카테고리 누락: core.${cat}`);
    }
  }
}

// 6. $metadata 검증
function validateMetadata(tokens) {
  if (!tokens.$metadata) {
    error('$metadata 가 없습니다');
    return;
  }
  if (!Array.isArray(tokens.$metadata.tokenSetOrder) || tokens.$metadata.tokenSetOrder.length === 0) {
    error('$metadata.tokenSetOrder 가 비어있거나 배열이 아닙니다');
  }
}

// --- 메인 실행 ---
console.log('🔍 tokens.json 유효성 검증 시작...\n');

const tokens = loadTokens();

if (tokens) {
  validateRequiredCategories(tokens);
  validateMetadata(tokens);

  // core, light, dark, theme 순회
  for (const setName of ['core', 'light', 'dark', 'theme']) {
    if (tokens[setName]) {
      validateTokenNode(tokens[setName], setName);
    }
  }
}

// 결과 출력
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
