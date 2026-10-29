/** 마크다운 본문에서 n번째 펜스 코드 블록을 꺼냅니다. */
export function codeBlock(markdown: string, index: number): string | undefined {
  const blocks = [...markdown.matchAll(/^(```|~~~)[^\n]*\n([\s\S]*?)^\1\s*$/gm)].map((m) => m[2]);
  return blocks[index]?.replace(/\s+$/, '');
}

/** "SQL> " 프롬프트, SQL*Plus 줄 번호("  2  "), 첫 ';' 이후의 실행 결과를 제거합니다. */
export function cleanSql(sql: string): string {
  const out: string[] = [];
  for (const raw of sql.split('\n')) {
    const line = raw.replace(/^SQL>\s?/, '').replace(/^\s{0,3}\d+\s{2}/, '');
    out.push(line);
    if (/;\s*(--.*)?$/.test(line)) break;
  }
  return out.join('\n').trim();
}
