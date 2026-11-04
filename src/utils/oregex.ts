// Oracle REGEXP_* 함수를 브라우저(JavaScript 정규식)로 흉내 냅니다.
// Oracle 정규식은 POSIX ERE + 일부 Perl 확장(\d \w \s, 게으른 수량자)이라 대부분 그대로 통해요.

export type Fn = 'like' | 'substr' | 'instr' | 'replace' | 'count';
export interface Opts {
  pattern: string;
  match: string; // Oracle match_parameter: i c n m x
  position: number; // 1부터
  occurrence: number; // 1부터, REPLACE에서 0은 전부
  subexpr: number; // 0 = 전체
  replace: string;
  returnOpt: 0 | 1; // INSTR: 0 = 시작 위치, 1 = 끝 다음 위치
}

const POSIX: Record<string, string> = {
  alpha: 'A-Za-z', digit: '0-9', alnum: 'A-Za-z0-9', upper: 'A-Z', lower: 'a-z', space: '\\s', blank: ' \\t',
  punct: '!-\\/:-@\\[-`{-~', xdigit: '0-9A-Fa-f', cntrl: '\\x00-\\x1f\\x7f', print: '\\x20-\\x7e', graph: '\\x21-\\x7e', word: '\\w',
};

/** Oracle 패턴 → JS RegExp. 쓸 수 없는 문법이면 경고를 돌려줘요. */
export function toJs(pattern: string, match: string): { re: RegExp; warnings: string[] } {
  const warnings: string[] = [];
  let p = pattern;
  if (/\(\?[=!]|\(\?<[=!]/.test(p)) warnings.push('Oracle은 전후방 탐색((?=…), (?<=…))을 지원하지 않아요. 실제 DB에서는 오류가 나요.');
  if (/\(\?<[A-Za-z]/.test(p) || /\(\?:/.test(p)) warnings.push('Oracle은 이름 붙은 그룹·(?:…) 비캡처 그룹을 지원하지 않아요.');
  if (/\\[bB]/.test(p)) warnings.push('\\b(단어 경계)는 Oracle에서 동작하지 않아요. 앞뒤 문자를 직접 지정하세요.');
  p = p.replace(/\[:(\w+):\]/g, (m, n) => {
    if (POSIX[n] == null) { warnings.push(`[:${n}:] 문자 클래스는 몰라서 그대로 두었어요.`); return m; }
    return POSIX[n];
  });
  // x: 패턴 안 공백 무시 (이스케이프·대괄호 안은 그대로)
  if (match.includes('x')) {
    let out = '', inCls = false;
    for (let i = 0; i < p.length; i++) {
      const c = p[i];
      if (c === '\\') { out += c + (p[i + 1] ?? ''); i++; continue; }
      if (c === '[') inCls = true;
      else if (c === ']') inCls = false;
      if (!inCls && /\s/.test(c)) continue;
      out += c;
    }
    p = out;
  }
  // 대소문자: 뒤에 나온 i/c가 이겨요 (Oracle 규칙)
  const lastI = match.lastIndexOf('i'), lastC = match.lastIndexOf('c');
  let flags = 'gd'; // d: 그룹 위치(indices)까지
  if (lastI > lastC) flags += 'i';
  if (match.includes('n')) flags += 's';
  if (match.includes('m')) flags += 'm';
  return { re: new RegExp(p, flags), warnings };
}

export interface Hit { start: number; end: number; groups: (string | undefined)[]; idx: ([number, number] | undefined)[] }

/** position(1부터)부터 겹치지 않게 찾은 모든 일치 */
export function hits(src: string, re: RegExp, position: number): Hit[] {
  const out: Hit[] = [];
  re.lastIndex = Math.max(0, position - 1);
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    out.push({ start: m.index, end: m.index + m[0].length, groups: [...m], idx: [...((m as RegExpExecArray & { indices?: ([number, number] | undefined)[] }).indices ?? [])] });
    if (m[0].length === 0) re.lastIndex++;
    if (out.length > 5000) break;
  }
  return out;
}

/** Oracle 바꿀 문자열(\1 …\9)을 그룹 값으로 */
const expand = (repl: string, g: (string | undefined)[]) => repl.replace(/\\(\d)/g, (_, d) => g[+d] ?? '');

export function run(fn: Fn, src: string, o: Opts): { value: string; hits: Hit[]; warnings: string[] } {
  const { re, warnings } = toJs(o.pattern, o.match);
  const hs = hits(src, re, o.position);
  const nth = hs[o.occurrence - 1];
  switch (fn) {
    case 'like':
      return { value: hs.length ? 'TRUE (조건 맞음)' : 'FALSE', hits: hs.slice(0, 1), warnings };
    case 'count':
      return { value: String(hs.length), hits: hs, warnings };
    case 'substr': {
      if (!nth) return { value: 'NULL', hits: [], warnings };
      const v = nth.groups[o.subexpr];
      return { value: v === undefined || v === '' ? 'NULL' : v, hits: [nth], warnings };
    }
    case 'instr': {
      if (!nth) return { value: '0', hits: [], warnings };
      if (o.subexpr > 0) {
        const at = nth.idx[o.subexpr];
        if (!at) return { value: '0', hits: [nth], warnings };
        return { value: String(o.returnOpt ? at[1] + 1 : at[0] + 1), hits: [nth], warnings };
      }
      return { value: String(o.returnOpt ? nth.end + 1 : nth.start + 1), hits: [nth], warnings };
    }
    case 'replace': {
      const targets = o.occurrence === 0 ? hs : nth ? [nth] : [];
      let out = '', last = 0;
      for (const h of targets) {
        out += src.slice(last, h.start) + expand(o.replace, h.groups);
        last = h.end;
      }
      out += src.slice(last);
      return { value: out === '' ? 'NULL' : out, hits: targets, warnings };
    }
  }
}

const q = (s: string) => `'${s.replace(/'/g, "''")}'`;
/** 같은 동작을 하는 Oracle SQL 조각 */
export function sqlOf(fn: Fn, o: Opts, col = 'col'): string {
  const m = o.match ? q(o.match) : null;
  const P = q(o.pattern);
  switch (fn) {
    case 'like': return `WHERE REGEXP_LIKE(${col}, ${P}${m ? `, ${m}` : ''})`;
    case 'count': return `REGEXP_COUNT(${col}, ${P}, ${o.position}${m ? `, ${m}` : ''})`;
    case 'substr': return `REGEXP_SUBSTR(${col}, ${P}, ${o.position}, ${o.occurrence}, ${m ?? 'NULL'}, ${o.subexpr})`;
    case 'instr': return `REGEXP_INSTR(${col}, ${P}, ${o.position}, ${o.occurrence}, ${o.returnOpt}, ${m ?? 'NULL'}, ${o.subexpr})`;
    case 'replace': return `REGEXP_REPLACE(${col}, ${P}, ${q(o.replace)}, ${o.position}, ${o.occurrence}${m ? `, ${m}` : ''})`;
  }
}
