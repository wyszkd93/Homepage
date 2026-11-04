// DBMS_XPLAN 출력(표 형식)을 읽어 트리로 바꿉니다.
// 지원: DISPLAY / DISPLAY_CURSOR(ALLSTATS LAST 포함)의 | Id | Operation | Name | ... | 표와 Predicate Information.

export interface PlanNode {
  id: number;
  depth: number;
  op: string; // TABLE ACCESS FULL 등
  name: string; // 객체 이름
  cols: Record<string, string>; // 표의 나머지 칸 (Rows, Cost (%CPU), A-Rows ...)
  pred: boolean; // Id 앞에 * (조건이 걸린 단계)
  predicates: string[];
  children: PlanNode[];
  parent: PlanNode | null;
  order: number; // 실행 순서 (자식 먼저, 1부터)
  cost: number | null;
  selfCost: number | null; // 이 단계 자체 비용 = 비용 - 자식 비용 합
  warnings: string[];
}

export interface Plan {
  roots: PlanNode[];
  nodes: PlanNode[];
  headers: string[];
  hash?: string;
  sqlId?: string;
  notes: string[];
}

/** 12K, 3M, 1.5G 같은 표기를 숫자로 */
export function num(v: string | undefined): number | null {
  if (!v) return null;
  const m = v.trim().match(/^([\d.]+)\s*([KMGTP]?)/i);
  if (!m) return null;
  const mul: Record<string, number> = { '': 1, K: 1e3, M: 1e6, G: 1e9, T: 1e12, P: 1e15 };
  return parseFloat(m[1]) * (mul[m[2].toUpperCase()] ?? 1);
}

const findCol = (h: string[], ...names: string[]) => h.find((x) => names.some((n) => x.toLowerCase() === n.toLowerCase()));

export function parsePlan(text: string): Plan {
  const lines = text.replace(/\r/g, '').split('\n');
  const notes: string[] = [];
  const hash = text.match(/Plan hash value:\s*(\d+)/i)?.[1];
  const sqlId = text.match(/SQL_ID\s+([0-9a-z]{13})/i)?.[1];

  // 표 머리글 찾기
  const hi = lines.findIndex((l) => /^\s*\|.*\bId\b.*\|.*Operation/i.test(l));
  if (hi < 0) throw new Error('실행계획 표(| Id | Operation | ...)를 찾지 못했어요.');
  const split = (l: string) => {
    const s = l.trim();
    return s.slice(1, s.endsWith('|') ? -1 : undefined).split('|');
  };
  const headers = split(lines[hi]).map((c) => c.trim());
  const iId = headers.findIndex((c) => /^id$/i.test(c));
  const iOp = headers.findIndex((c) => /^operation$/i.test(c));
  const iName = headers.findIndex((c) => /^name$/i.test(c));

  const nodes: PlanNode[] = [];
  const raw: { node: PlanNode; indent: number }[] = [];
  for (let i = hi + 1; i < lines.length; i++) {
    const l = lines[i];
    if (/^\s*-{5,}\s*$/.test(l)) {
      if (raw.length) break; // 표 끝
      continue;
    }
    if (!/^\s*\|/.test(l)) {
      if (raw.length) break;
      continue;
    }
    const cells = split(l);
    if (cells.length < headers.length - 1) continue;
    const idCell = cells[iId] ?? '';
    const m = idCell.match(/(\*)?\s*(\d+)/);
    if (!m) continue;
    const opCell = cells[iOp] ?? '';
    const indent = opCell.length - opCell.trimStart().length;
    const cols: Record<string, string> = {};
    headers.forEach((h, k) => {
      if (k !== iId && k !== iOp && k !== iName && h) cols[h] = (cells[k] ?? '').trim();
    });
    const node: PlanNode = {
      id: +m[2], depth: 0, op: opCell.trim(), name: iName >= 0 ? (cells[iName] ?? '').trim() : '', cols, pred: !!m[1],
      predicates: [], children: [], parent: null, order: 0, cost: null, selfCost: null, warnings: [],
    };
    raw.push({ node, indent });
    nodes.push(node);
  }
  if (!nodes.length) throw new Error('표 안에서 단계를 하나도 읽지 못했어요.');

  // 들여쓰기로 부모-자식 연결
  const base = Math.min(...raw.map((r) => r.indent));
  const stack: { node: PlanNode; indent: number }[] = [];
  const roots: PlanNode[] = [];
  for (const r of raw) {
    r.node.depth = r.indent - base;
    while (stack.length && stack[stack.length - 1].indent >= r.indent) stack.pop();
    const parent = stack[stack.length - 1]?.node ?? null;
    r.node.parent = parent;
    if (parent) parent.children.push(r.node);
    else roots.push(r.node);
    stack.push(r);
  }

  // Predicate Information: "  2 - access(...)" 와 이어지는 줄
  const pi = lines.findIndex((l) => /Predicate Information/i.test(l));
  if (pi >= 0) {
    let cur: PlanNode | undefined;
    for (let i = pi + 1; i < lines.length; i++) {
      const l = lines[i];
      if (/^\s*(Column Projection|Note|Hint Report|Query Block)/i.test(l)) break;
      const m = l.match(/^\s*(\d+)\s+-\s+(.*)$/);
      if (m) {
        cur = nodes.find((n) => n.id === +m[1]);
        cur?.predicates.push(m[2].trim());
      } else if (cur && l.trim() && !/^-+$/.test(l.trim())) {
        cur.predicates[cur.predicates.length - 1] += ' ' + l.trim();
      }
    }
  }
  const ni = lines.findIndex((l) => /^\s*Note\s*$/i.test(l));
  if (ni >= 0) for (let i = ni + 1; i < lines.length; i++) {
    const t = lines[i].trim();
    if (/^-+$/.test(t)) continue;
    if (!t) { if (notes.length) break; continue; }
    notes.push(t.replace(/^-\s*/, ''));
  }

  // 비용, 실행 순서, 경고
  const costCol = findCol(headers, 'Cost (%CPU)', 'Cost');
  for (const n of nodes) n.cost = num(costCol ? n.cols[costCol] : undefined);
  // 비용 칸이 빈 단계(COUNT STOPKEY 등)는 그 아래 단계 비용으로 대신해요
  const eff = (n: PlanNode): number => n.cost ?? n.children.reduce((a, c) => a + eff(c), 0);
  for (const n of nodes) {
    if (n.cost == null) continue;
    const kids = n.children.reduce((a, c) => a + eff(c), 0);
    n.selfCost = Math.max(0, n.cost - kids);
  }
  let k = 0;
  const visit = (n: PlanNode) => { n.children.forEach(visit); n.order = ++k; };
  roots.forEach(visit);

  const eCol = findCol(headers, 'E-Rows', 'Rows');
  const aCol = findCol(headers, 'A-Rows');
  for (const n of nodes) {
    const op = n.op.toUpperCase();
    const rows = num(eCol ? n.cols[eCol] : undefined);
    if (/TABLE ACCESS (STORAGE )?FULL/.test(op) && (rows == null || rows >= 10000)) n.warnings.push('큰 테이블 전체 읽기');
    if (/MERGE JOIN CARTESIAN/.test(op)) n.warnings.push('카티션 곱 (조인 조건 빠졌는지 확인)');
    if (/INDEX FULL SCAN|INDEX SKIP SCAN/.test(op)) n.warnings.push(op.includes('SKIP') ? '인덱스 스킵 스캔' : '인덱스 전체 스캔');
    if (/FILTER/.test(op) && n.children.length > 1) n.warnings.push('서브쿼리를 행마다 반복할 수 있음');
    if (aCol && eCol && eCol !== aCol) {
      const a = num(n.cols[aCol]);
      const starts = num(n.cols['Starts']) ?? 1;
      const e = rows != null ? rows * starts : null;
      if (a != null && e != null && Math.max(a, e) >= 100 && (a > e * 10 || e > a * 10)) n.warnings.push(`예상 ${fmt(e)}행 ↔ 실제 ${fmt(a)}행 (통계 확인)`);
    }
  }
  return { roots, nodes, headers, hash, sqlId, notes };
}

export const fmt = (n: number) => (n >= 1e6 ? `${+(n / 1e6).toFixed(1)}M` : n >= 1e4 ? `${+(n / 1e3).toFixed(1)}K` : `${Math.round(n)}`);
