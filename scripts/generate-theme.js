#!/usr/bin/env node
/**
 * tokens.json → src/styles/theme.css.ts 자동 생성 스크립트
 *
 * 플러그인이 생성하는 포맷 기준:
 *   colors.color.XXX.YYY  → { value: "#hex", opacity? }
 *   typography.typoType.XXX → { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing }
 *
 * 사용법: node scripts/generate-theme.js
 */

const fs = require('fs');
const path = require('path');

const TOKENS_PATH = path.join(__dirname, '../tokens.json');
const OUTPUT_PATH = path.join(__dirname, '../src/styles/theme.css.ts');

const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf-8'));

// ─── 리프 판별 ────────────────────────────────────────────────────────────────
function isColorLeaf(obj) {
  return obj && typeof obj === 'object' && typeof obj.value === 'string';
}
function isTypoLeaf(obj) {
  return obj && typeof obj === 'object' && 'fontFamily' in obj;
}

// ─── 평탄화 ───────────────────────────────────────────────────────────────────
function flattenColors(obj, prefix = '') {
  const result = {};
  if (!obj || typeof obj !== 'object') return result;
  if (isColorLeaf(obj)) {
    result[prefix] = obj.value;
    return result;
  }
  for (const [key, val] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${key}` : key;
    Object.assign(result, flattenColors(val, p));
  }
  return result;
}

function flattenTypo(obj, prefix = '') {
  const result = {};
  if (!obj || typeof obj !== 'object') return result;
  if (isTypoLeaf(obj)) {
    result[prefix] = obj;
    return result;
  }
  for (const [key, val] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${key}` : key;
    Object.assign(result, flattenTypo(val, p));
  }
  return result;
}

// tokens.colors, tokens.typography 기준으로 맵 생성
// → getColor('color.primary.default'), getTypo('typoType.button2') 형태로 접근
const colorMap = flattenColors(tokens.colors);
const typoMap  = flattenTypo(tokens.typography);

// ─── 토큰 조회 ────────────────────────────────────────────────────────────────
function getColor(tokenPath) {
  const value = colorMap[tokenPath];
  if (value === undefined) throw new Error(`색상 토큰을 찾을 수 없습니다: ${tokenPath}`);
  return value;
}

function getTypo(tokenPath) {
  const value = typoMap[tokenPath];
  if (value === undefined) throw new Error(`타이포그래피 토큰을 찾을 수 없습니다: ${tokenPath}`);
  return value;
}

// ─── 블록 생성 ────────────────────────────────────────────────────────────────
function colorBlock(name) {
  const p = `color.${name}`;
  return `    ${name}: {
      default:      '${getColor(`${p}.default`)}',
      hover:        '${getColor(`${p}.hover`)}',
      disabled:     '${getColor(`${p}.disabled`)}',
      text:         '${getColor(`${p}.text`)}',
      textDisabled: '${getColor(`${p}.textDisabled`)}',
    },`;
}

function typoBlock(name) {
  const t = getTypo(`typoType.${name}`);
  return `    ${name}: {
      fontSize:      '${t.fontSize}px',
      fontWeight:    '${t.fontWeight}',
      lineHeight:    '${t.lineHeight}',
      letterSpacing: '${t.letterSpacing}',
    },`;
}

// ─── 파일 생성 ────────────────────────────────────────────────────────────────
const output = `import { createGlobalTheme } from '@vanilla-extract/css';

// 이 파일은 scripts/generate-theme.js로 자동 생성됩니다.
// 직접 수정하지 말고 tokens.json을 수정한 뒤
// npm run tokens:generate 를 실행하세요.

export const vars = createGlobalTheme(':root', {
  typoType: {
${typoBlock('button2')}
${typoBlock('button3')}
${typoBlock('button4')}
${typoBlock('button5')}
  },
  color: {
${colorBlock('primary')}
${colorBlock('gray')}
${colorBlock('red')}
${colorBlock('yellow')}
${colorBlock('green')}
  },
});
`;

fs.writeFileSync(OUTPUT_PATH, output);
console.log(`✓ theme.css.ts 생성 완료: ${OUTPUT_PATH}`);
