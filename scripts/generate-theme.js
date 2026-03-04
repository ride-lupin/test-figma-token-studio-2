#!/usr/bin/env node
/**
 * tokens.json → src/styles/theme.css.ts 자동 생성 스크립트
 *
 * Token Studio 포맷의 tokens.json을 읽어 Vanilla Extract 형식의
 * theme.css.ts 파일을 생성합니다.
 *
 * 사용법: node scripts/generate-theme.js
 */

const fs = require("fs");
const path = require("path");

const TOKENS_PATH = path.join(__dirname, "../tokens.json");
const OUTPUT_PATH = path.join(__dirname, "../src/styles/theme.css.ts");

const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, "utf-8"));
const tokenSetOrder = tokens.$metadata?.tokenSetOrder ?? [];

// 토큰 셋을 { "경로": 값 } 형태로 평탄화
function flattenSet(obj, prefix = "") {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith("$")) continue;
    const p = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && "$value" in value) {
      result[p] = value.$value;
    } else if (value && typeof value === "object") {
      Object.assign(result, flattenSet(value, p));
    }
  }
  return result;
}

// tokenSetOrder 순서대로 모든 셋을 병합 (뒤 셋이 앞 셋을 덮어씀)
const flatMap = {};
for (const setName of tokenSetOrder) {
  if (tokens[setName]) {
    Object.assign(flatMap, flattenSet(tokens[setName]));
  }
}

// {some.path} 형태의 참조를 실제 값으로 재귀 해석
function resolve(value, depth = 0) {
  if (depth > 10 || typeof value !== "string") return value;

  const pureRef = value.match(/^\{([^}]+)\}$/);
  if (pureRef) {
    const resolved = flatMap[pureRef[1]];
    if (resolved === undefined) {
      throw new Error(`참조를 찾을 수 없습니다: ${pureRef[1]}`);
    }
    return resolve(resolved, depth + 1);
  }

  return value.replace(/\{([^}]+)\}/g, (_, ref) => {
    const resolved = flatMap[ref];
    return resolved !== undefined ? resolve(String(resolved), depth + 1) : _;
  });
}

// 색상 토큰 값 가져오기
function getColor(tokenPath) {
  const value = flatMap[tokenPath];
  if (value === undefined)
    throw new Error(`색상 토큰을 찾을 수 없습니다: ${tokenPath}`);
  return resolve(String(value));
}

// 타이포그래피 복합 토큰 가져오기 (객체 → 각 속성 해석)
function getTypo(tokenPath) {
  const value = flatMap[tokenPath];
  if (value === undefined)
    throw new Error(`타이포그래피 토큰을 찾을 수 없습니다: ${tokenPath}`);
  if (typeof value !== "object")
    throw new Error(`${tokenPath}는 복합 토큰이 아닙니다`);
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => [k, resolve(String(v))])
  );
}

// 색상 그룹 블록 생성
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

// 타이포그래피 블록 생성
function typoBlock(name) {
  const t = getTypo(`typoType.${name}`);
  return `    ${name}: {
      fontSize:      '${t.fontSize}',
      fontWeight:    '${t.fontWeight}',
      lineHeight:    '${t.lineHeight}',
      letterSpacing: '${t.letterSpacing}',
    },`;
}

const output = `import { createGlobalTheme } from '@vanilla-extract/css';

// 이 파일은 scripts/generate-theme.js로 자동 생성됩니다.
// 직접 수정하지 말고 tokens.json을 수정한 뒤 npm run tokens:generate 를 실행하세요.

export const vars = createGlobalTheme(':root', {
  typoType: {
${typoBlock("button2")}
${typoBlock("button3")}
${typoBlock("button4")}
${typoBlock("button5")}
  },
  color: {
${colorBlock("primary")}
${colorBlock("gray")}
${colorBlock("red")}
${colorBlock("yellow")}
${colorBlock("green")}
  },
});
`;

fs.writeFileSync(OUTPUT_PATH, output);
console.log(`✓ theme.css.ts 생성 완료: ${OUTPUT_PATH}`);
