// SQL 포매터(간결형·정렬형) + 문법 강조.
// 간결형: 절 키워드와 내용은 한 줄(select a, b / from t), where·having·on의 and/or만
//         다음 줄에 한 단계 들여쓰기, 서브쿼리는 괄호 안을 한 단계 들여쓰기.
// 정렬형: 키워드 첫 단어를 6칸에 맞춰(FROM   t / GROUP  BY a) 내용이 같은 열에서 시작,
//         목록은 한 줄에 하나씩 그 열에 맞추고 and/or도 그 열에서 시작,
//         서브쿼리는 '(SELECT'처럼 괄호에 붙이고 안쪽 절은 SELECT 위치에 맞춘다.

export type Case = 'upper' | 'lower' | 'preserve';
type TokType = 'ws' | 'comment' | 'string' | 'ident' | 'number' | 'bind' | 'word' | 'op' | 'open' | 'close' | 'comma' | 'semi' | 'dot';
export interface Token {
  type: TokType;
  text: string;
}

const KEYWORDS = new Set(
  `select from where group by having order union all intersect minus except join left right full outer inner cross natural on using
  insert into values update set delete merge when matched then else end case and or not in exists between like escape is null as
  distinct with connect start prior nocycle fetch first next rows row only offset limit returning for of nowait skip locked asc desc
  nulls last create table view index drop alter add modify column primary key foreign references constraint default unique check
  grant revoke to commit rollback savepoint truncate begin declare exception raise return over partition within lateral pivot unpivot
  sample union level rownum sysdate systimestamp true false interval day month year hour minute second at time zone
  dual immediate execute exec procedure function package body trigger sequence synonym tablespace user identified`
    .split(/\s+/)
    .filter(Boolean),
);

const FUNCTIONS = new Set(
  `count sum avg min max round trunc nvl nvl2 decode coalesce nullif cast convert to_char to_date to_number to_timestamp substr instr
  length lengthb upper lower initcap trim ltrim rtrim lpad rpad replace translate concat abs ceil floor mod power sqrt sign greatest
  least add_months months_between last_day next_day extract listagg row_number rank dense_rank lag lead first_value last_value ntile
  regexp_like regexp_replace regexp_substr regexp_instr sys_context userenv chr ascii now current_date current_timestamp date_format
  ifnull if group_concat string_agg array_agg date_trunc to_json json_value json_query xmlagg xmlelement
  datediff dateadd date_add date_sub str_to_date timestampdiff getdate isnull len charindex`
    .split(/\s+/)
    .filter(Boolean),
);

// 앞에서 줄을 바꾸는 절 (여러 단어는 공백으로)
const CLAUSES = [
  'select', 'from', 'where', 'group by', 'having', 'order by', 'union all', 'union', 'intersect', 'minus', 'except',
  'left outer join', 'right outer join', 'full outer join', 'left join', 'right join', 'full join', 'inner join',
  'cross join', 'natural join', 'join', 'insert into', 'values', 'update', 'set', 'delete from', 'delete', 'merge into',
  'using', 'connect by', 'start with', 'fetch', 'offset', 'limit', 'returning', 'for update', 'with',
];
// 이 절 안의 and/or는 줄을 바꾼다
const COND_CLAUSES = new Set(['where', 'having', 'on', 'connect by', 'start with']);
// 정렬형에서 쉼표마다 줄을 바꾸는 절
const LIST_CLAUSES = new Set(['select', 'from', 'group by', 'order by', 'set', 'returning', 'with']);
// 혼자 한 줄을 차지하는 절 (다음 내용은 다음 줄)
const SET_OPS = new Set(['union all', 'union', 'intersect', 'minus', 'except']);

const RE = {
  ws: /^\s+/,
  lineComment: /^--[^\n]*/,
  blockComment: /^\/\*[\s\S]*?(\*\/|$)/,
  string: /^[NnEeXxBb]?'(?:[^']|'')*'?/,
  qident: /^"(?:[^"]|"")*"?|^`[^`]*`?|^\[[^\]\n]*\]/,
  number: /^(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/,
  bind: /^(?::[\p{L}\w$#]+|\?|\$\d+|@[\p{L}\w$#]+)/u,
  word: /^[\p{L}_][\p{L}\p{N}_$#]*/u,
  outer: /^\(\+\)/,
  op: /^(?:<>|!=|>=|<=|\|\||=>|::|:=|[-+*/%=<>^~!&|])/,
};

export function tokenize(sql: string): Token[] {
  const out: Token[] = [];
  let s = sql;
  while (s.length) {
    let m: RegExpMatchArray | null;
    let type: TokType;
    if ((m = s.match(RE.ws))) type = 'ws';
    else if ((m = s.match(RE.lineComment)) || (m = s.match(RE.blockComment))) type = 'comment';
    else if ((m = s.match(RE.string))) type = 'string';
    else if ((m = s.match(RE.qident))) type = 'ident';
    else if ((m = s.match(RE.number))) type = 'number';
    else if ((m = s.match(RE.outer))) type = 'op';
    else if ((m = s.match(RE.bind))) type = 'bind';
    else if ((m = s.match(RE.word))) type = 'word';
    else if ((m = s.match(RE.op))) type = 'op';
    else {
      const c = s[0];
      type = c === '(' ? 'open' : c === ')' ? 'close' : c === ',' ? 'comma' : c === ';' ? 'semi' : c === '.' ? 'dot' : 'op';
      m = [c] as unknown as RegExpMatchArray;
    }
    out.push({ type, text: m[0] });
    s = s.slice(m[0].length);
  }
  return out;
}

const applyCase = (w: string, c: Case) => (c === 'upper' ? w.toUpperCase() : c === 'lower' ? w.toLowerCase() : w);

/** PL/SQL 블록이나 DDL 본문처럼 간결형으로 다루지 않는 입력인지 */
export function isBlock(sql: string): boolean {
  return /\b(begin|declare)\b|\bcreate\s+(or\s+replace\s+)?(procedure|function|package|trigger|type)\b/i.test(sql);
}

interface Ctx {
  sub: boolean; // 서브쿼리 괄호(또는 최상위)인지
  base: number; // 이 쿼리 블록의 들여쓰기
  clause: string; // 현재 절
  clauseCol: number; // 절 내용이 시작하는 열 (긴 목록 줄바꿈용)
  between: boolean; // BETWEEN 뒤 첫 AND 대기
  caseDepth: number; // CASE ... END 안이면 and/or로 줄을 바꾸지 않음
  closeIndent: number; // 닫는 괄호 들여쓰기
  fresh: boolean; // 정렬형: 방금 연 서브쿼리 괄호 (첫 절을 괄호에 붙임)
}

const WRAP = 100;

export function formatCompact(sql: string, kcase: Case, tab = 4, align = false): string {
  const toks = tokenize(sql).filter((t) => t.type !== 'ws');
  const lines: string[] = [];
  let line = '';
  let lineIndent = 0;
  const root: Ctx = { sub: true, base: 0, clause: '', clauseCol: 0, between: false, caseDepth: 0, closeIndent: 0, fresh: false };
  const stack: Ctx[] = [root];
  let prev: Token | null = null;
  let prevWord = ''; // 직전 토큰이 단어면 소문자형

  const top = () => stack[stack.length - 1];
  const newline = (indent: number) => {
    if (line.trim()) lines.push(line.replace(/\s+$/, ''));
    line = ' '.repeat(indent);
    lineIndent = indent;
    prev = null;
  };
  const atLineStart = () => line.trim() === '';
  const put = (text: string, space: boolean) => {
    if (space && !atLineStart() && !/\s$/.test(line)) line += ' ';
    line += text;
  };

  // 다음 단어들이 절 키워드(여러 단어 포함)로 시작하면 그 절 이름과 길이를 돌려준다
  const matchClause = (i: number): [string, number] | null => {
    for (const c of CLAUSES) {
      const parts = c.split(' ');
      let ok = true;
      for (let k = 0; k < parts.length; k++) {
        const t = toks[i + k];
        if (!t || t.type !== 'word' || t.text.toLowerCase() !== parts[k]) {
          ok = false;
          break;
        }
      }
      if (ok) return [c, parts.length];
    }
    return null;
  };

  const isOperand = (t: Token | null) =>
    !!t && ((t.type === 'word' && !KEYWORDS.has(t.text.toLowerCase())) || t.type === 'number' || t.type === 'string' || t.type === 'ident' || t.type === 'bind' || t.type === 'close');

  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    const ctx = top();
    const lower = t.text.toLowerCase();

    if (t.type === 'comment') {
      if (t.text.startsWith('/*+')) put(t.text, true); // 힌트는 그 자리에
      else {
        put(t.text, !atLineStart());
        if (t.text.startsWith('--')) newline(lineIndent);
      }
      prev = t;
      continue;
    }

    if (t.type === 'word' && ctx.sub) {
      const cm = matchClause(i);
      // WITH는 문장 맨 앞에서만, USING은 MERGE 안에서만 절로 본다
      const valid =
        cm && !(cm[0] === 'with' && ctx.clause !== '') && !(cm[0] === 'using' && ctx.clause !== 'merge into') && ctx.caseDepth === 0;
      if (cm && valid) {
        const [name, len] = cm;
        if (!ctx.fresh) {
          if (!atLineStart()) newline(ctx.base);
          line = ' '.repeat(ctx.base);
          lineIndent = ctx.base;
        }
        ctx.fresh = false;
        const parts = toks.slice(i, i + len).map((w) => applyCase(w.text, kcase));
        // 정렬형은 첫 단어를 6칸에 맞추고 뒤에 한 칸 → 내용은 항상 base + 7 이후
        const words = align ? [parts[0].padEnd(6), ...parts.slice(1)].join(' ').replace(/ +$/, '') : parts.join(' ');
        line += words;
        if (align) line += ' '.repeat(Math.max(1, 7 - words.length));
        ctx.clause = name;
        ctx.clauseCol = line.length;
        ctx.between = false;
        i += len - 1;
        prev = { type: 'word', text: words };
        prevWord = name;
        if (SET_OPS.has(name)) newline(ctx.base);
        continue;
      }
      if (lower === 'on' && ctx.clause.endsWith('join')) {
        put(applyCase(t.text, kcase), true);
        ctx.clause = 'on';
        prev = t;
        prevWord = 'on';
        continue;
      }
      if (lower === 'between') ctx.between = true;
      if (lower === 'case') ctx.caseDepth++;
      if (lower === 'end' && ctx.caseDepth > 0) ctx.caseDepth--;
      if ((lower === 'and' || lower === 'or') && COND_CLAUSES.has(ctx.clause) && ctx.caseDepth === 0) {
        if (lower === 'and' && ctx.between) {
          ctx.between = false;
        } else {
          newline(align ? ctx.clauseCol : ctx.base + tab);
          line += applyCase(t.text, kcase);
          prev = t;
          prevWord = lower;
          continue;
        }
      }
    }

    switch (t.type) {
      case 'open': {
        const next = toks[i + 1];
        const isSub = !!next && next.type === 'word' && ['select', 'with'].includes(next.text.toLowerCase());
        const space = !!prev && prev.type !== 'open' && prev.type !== 'dot';
        // 함수 호출은 붙이고(nvl(...)), 키워드·INSERT 대상 테이블 뒤는 띄운다
        const call = prev?.type === 'word' && !KEYWORDS.has(prevWord) && ctx.clause !== 'insert into';
        put('(', space && !call);
        if (isSub && align) {
          stack.push({ sub: true, base: line.length, clause: '', clauseCol: line.length, between: false, caseDepth: 0, closeIndent: lineIndent, fresh: true });
        } else if (isSub) {
          const indent = lineIndent + tab;
          stack.push({ sub: true, base: indent, clause: '', clauseCol: indent, between: false, caseDepth: 0, closeIndent: lineIndent, fresh: false });
          newline(indent);
        } else {
          stack.push({ sub: false, base: ctx.base, clause: ctx.clause, clauseCol: ctx.clauseCol, between: false, caseDepth: 0, closeIndent: lineIndent, fresh: false });
        }
        prev = t;
        break;
      }
      case 'close': {
        const c = stack.length > 1 ? stack.pop()! : ctx;
        if (c.sub && !align) newline(c.closeIndent);
        put(')', false);
        prev = t;
        break;
      }
      case 'comma': {
        line += ',';
        if (ctx.sub && ((align && LIST_CLAUSES.has(ctx.clause)) || line.length > WRAP)) newline(ctx.clauseCol);
        else line += ' ';
        prev = t;
        break;
      }
      case 'semi': {
        line = line.replace(/\s+$/, '') + ';';
        newline(0);
        lines.push('');
        stack.length = 1;
        root.clause = '';
        prev = null;
        break;
      }
      case 'dot':
        line = line.replace(/\s+$/, '') + '.';
        prev = t;
        break;
      case 'op': {
        const tx = t.text;
        if (tx === '(+)' || tx === '::' || tx === '%') {
          line = line.replace(/\s+$/, '') + tx;
          prev = { type: 'dot', text: tx }; // 다음 토큰을 붙인다
          break;
        }
        const wildcard = tx === '*' && (!prev || prev.type === 'open' || prev.type === 'comma' || prev.type === 'dot' || (prev.type === 'word' && KEYWORDS.has(prevWord)));
        if (wildcard) {
          put('*', prev?.type !== 'open' && prev?.type !== 'dot');
          prev = { type: 'word', text: '*' };
          prevWord = '*';
          break;
        }
        const unary = (tx === '-' || tx === '+') && !isOperand(prev);
        put(tx, true);
        if (!unary) line += ' ';
        prev = unary ? { type: 'open', text: tx } : t;
        break;
      }
      default: {
        let text = t.text;
        if (t.type === 'word') {
          const next = toks[i + 1];
          if (KEYWORDS.has(lower) || (FUNCTIONS.has(lower) && next?.type === 'open')) text = applyCase(text, kcase);
          prevWord = KEYWORDS.has(lower) ? lower : '';
        } else prevWord = '';
        const glue = prev && (prev.type === 'open' || prev.type === 'dot');
        put(text, !glue);
        prev = t;
      }
    }
  }
  newline(0);
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  return lines.join('\n');
}

/** sql-formatter 결과 보정: FETCH FIRST n ROWS ONLY의 대소문자, 한 줄로 */
export function fixFetch(text: string, kcase: Case): string {
  return text.replace(/\bFETCH(\s+)(FIRST|NEXT)\s+(\S+)\s+(ROWS?)\s+(ONLY|WITH\s+TIES)\b/gi, (_m, sp, a, n, r, o) =>
    [applyCase('fetch', kcase) + sp + applyCase(a, kcase), n, applyCase(r, kcase), applyCase(o, kcase)].join(' '),
  );
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** 정리된 SQL을 문법 강조 HTML로 */
export function highlight(sql: string): string {
  const toks = tokenize(sql);
  return toks
    .map((t, i) => {
      const lower = t.text.toLowerCase();
      let cls = '';
      if (t.type === 'comment') cls = 'c';
      else if (t.type === 'string') cls = 's';
      else if (t.type === 'number') cls = 'n';
      else if (t.type === 'bind') cls = 'b';
      else if (t.type === 'word') {
        const next = toks.slice(i + 1).find((x) => x.type !== 'ws');
        if (FUNCTIONS.has(lower) && next?.type === 'open') cls = 'f';
        else if (KEYWORDS.has(lower)) cls = 'k';
      }
      return cls ? `<span class="sx-${cls}">${esc(t.text)}</span>` : esc(t.text);
    })
    .join('');
}
