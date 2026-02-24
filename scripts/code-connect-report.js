#!/usr/bin/env node
/**
 * Code Connect 변경 감지 및 리포트 생성 스크립트
 * - git diff로 추가/수정/삭제된 .figma.tsx 파일 감지
 * - figma connect parse로 현재 등록된 컴포넌트 목록 조회
 * - 마크다운 리포트 생성 → code-connect-report.md
 */

const { execSync } = require("fs").promises ? require("child_process") : require("child_process");
const fs = require("fs");

const REPORT_FILE = "code-connect-report.md";
const PUBLISH_RESULT = process.argv.find((a) => a.startsWith("--publish-result="))?.split("=")[1];

// ── 1. 변경된 .figma.tsx 파일 감지 ──────────────────────────────────────────
function getChangedFiles() {
  const run = (filter) => {
    try {
      return execSync(
        `git diff --name-only --diff-filter=${filter} HEAD~1 HEAD -- "src/**/*.figma.tsx"`,
        { encoding: "utf8" }
      )
        .trim()
        .split("\n")
        .filter(Boolean);
    } catch {
      return [];
    }
  };

  return {
    added: run("A"),
    modified: run("M"),
    deleted: run("D"),
  };
}

// ── 2. 현재 등록된 컴포넌트 목록 조회 ────────────────────────────────────────
function getRegisteredComponents() {
  try {
    const raw = execSync("npx figma connect parse 2>/dev/null", {
      encoding: "utf8",
    });
    const parsed = JSON.parse(raw);
    return parsed.map((item) => ({
      component: item.component,
      figmaNode: item.figmaNode,
      file: item._codeConnectFilePath?.replace(process.cwd() + "/", "") ?? "",
    }));
  } catch {
    return [];
  }
}

// ── 3. 마크다운 리포트 생성 ──────────────────────────────────────────────────
function buildReport({ changes, components, publishResult }) {
  const lines = [];

  lines.push("## 🔗 Code Connect 변경 사항");
  lines.push("");

  // 변경된 파일
  const { added, modified, deleted } = changes;
  const hasChanges = added.length + modified.length + deleted.length > 0;

  if (!hasChanges) {
    lines.push("> 변경된 `.figma.tsx` 파일 없음 (workflow_dispatch로 실행됨)");
  } else {
    if (added.length > 0) {
      lines.push("### ✨ 추가");
      added.forEach((f) => lines.push(`- \`${f}\``));
      lines.push("");
    }
    if (modified.length > 0) {
      lines.push("### ✏️ 수정");
      modified.forEach((f) => lines.push(`- \`${f}\``));
      lines.push("");
    }
    if (deleted.length > 0) {
      lines.push("### 🗑️ 삭제");
      deleted.forEach((f) => lines.push(`- \`${f}\``));
      lines.push("");
    }
  }

  // 등록된 컴포넌트 현황
  if (components.length > 0) {
    lines.push("### 📋 Figma에 등록된 컴포넌트");
    lines.push("");
    lines.push("| 컴포넌트 | Figma 노드 | 파일 |");
    lines.push("|---|---|---|");
    components.forEach(({ component, figmaNode, file }) => {
      const nodeId = figmaNode.match(/node-id=([\d-]+)/)?.[1] ?? "";
      lines.push(`| \`${component}\` | [${nodeId}](${figmaNode}) | \`${file}\` |`);
    });
    lines.push("");
  }

  // 배포 결과
  if (publishResult === "success") {
    lines.push("### 🚀 배포 결과");
    lines.push("");
    lines.push("✅ Figma에 성공적으로 배포되었습니다.");
  } else if (publishResult === "failed") {
    lines.push("### 🚀 배포 결과");
    lines.push("");
    lines.push("❌ 배포에 실패했습니다. [Actions 로그를 확인해주세요.]");
  }

  return lines.join("\n");
}

// ── 실행 ─────────────────────────────────────────────────────────────────────
const changes = getChangedFiles();
const components = getRegisteredComponents();
const report = buildReport({ changes, components, publishResult: PUBLISH_RESULT });

fs.writeFileSync(REPORT_FILE, report, "utf8");
console.log(report);
