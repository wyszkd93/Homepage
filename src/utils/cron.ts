// 리눅스 crontab 5필드(분 시 일 월 요일) 해석기. 일/요일 규칙은 Vixie cron과 같다:
// 둘 다 '*'로 시작하지 않으면 OR, 하나라도 '*'로 시작하면 AND.

export interface CronSpec {
  minutes: number[];
  hours: number[];
  days: Set<number>;
  months: Set<number>;
  weekdays: Set<number>;
  dayStar: boolean;
  weekdayStar: boolean;
}

const MACROS: Record<string, string> = {
  '@yearly': '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *',
};

const MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

interface FieldDef {
  label: string;
  min: number;
  max: number;
  names?: string[];
  nameBase?: number;
}

const FIELDS: FieldDef[] = [
  { label: '분', min: 0, max: 59 },
  { label: '시', min: 0, max: 23 },
  { label: '일', min: 1, max: 31 },
  { label: '월', min: 1, max: 12, names: MONTH_NAMES, nameBase: 1 },
  { label: '요일', min: 0, max: 7, names: DAY_NAMES, nameBase: 0 },
];

/** '@daily' 같은 별칭을 5필드 식으로 바꾼다. */
export function expandMacro(expr: string): string {
  const t = expr.trim();
  return MACROS[t.toLowerCase()] ?? t;
}

function parseValue(raw: string, f: FieldDef): number {
  const up = raw.toUpperCase();
  const idx = f.names?.indexOf(up) ?? -1;
  if (idx >= 0) return idx + (f.nameBase ?? 0);
  if (!/^\d+$/.test(raw)) throw new Error(`${f.label} 필드의 '${raw}'를 이해하지 못했어요.`);
  const n = Number(raw);
  if (n < f.min || n > f.max) throw new Error(`${f.label} 필드는 ${f.min}~${f.max} 사이여야 해요. (입력: ${n})`);
  return n;
}

function parseField(text: string, f: FieldDef): Set<number> {
  const out = new Set<number>();
  for (const part of text.split(',')) {
    if (!part) throw new Error(`${f.label} 필드에 빈 항목이 있어요.`);
    const [range, stepRaw, extra] = part.split('/');
    if (extra !== undefined) throw new Error(`${f.label} 필드의 '${part}'에 '/'가 두 번 있어요.`);
    let step = 1;
    if (stepRaw !== undefined) {
      if (!/^\d+$/.test(stepRaw) || Number(stepRaw) === 0) throw new Error(`${f.label} 필드의 간격 '${stepRaw}'가 올바르지 않아요.`);
      step = Number(stepRaw);
    }
    let lo: number;
    let hi: number;
    if (range === '*') {
      lo = f.min;
      hi = f.max;
    } else if (range.includes('-')) {
      const [a, b] = range.split('-');
      lo = parseValue(a, f);
      hi = parseValue(b, f);
      if (lo > hi) throw new Error(`${f.label} 필드의 범위 '${range}'는 앞 값이 더 커요.`);
    } else {
      lo = parseValue(range, f);
      hi = stepRaw !== undefined ? f.max : lo;
    }
    for (let v = lo; v <= hi; v += step) out.add(v);
  }
  return out;
}

export function parseCron(expr: string): CronSpec {
  const src = expandMacro(expr);
  if (src.startsWith('@')) throw new Error(`'${src}'는 시각으로 계산할 수 없는 별칭이에요.`);
  const parts = src.split(/\s+/).filter(Boolean);
  if (parts.length !== 5) {
    throw new Error(`필드가 ${parts.length}개예요. '분 시 일 월 요일' 5개로 입력해 주세요.`);
  }
  const sets = parts.map((p, i) => parseField(p, FIELDS[i]));
  const weekdays = new Set([...sets[4]].map((d) => d % 7)); // 7 = 일요일
  return {
    minutes: [...sets[0]].sort((a, b) => a - b),
    hours: [...sets[1]].sort((a, b) => a - b),
    days: sets[2],
    months: sets[3],
    weekdays,
    dayStar: parts[2].startsWith('*'),
    weekdayStar: parts[4].startsWith('*'),
  };
}

function dayMatches(spec: CronSpec, d: Date): boolean {
  if (!spec.months.has(d.getMonth() + 1)) return false;
  const dom = spec.days.has(d.getDate());
  const dow = spec.weekdays.has(d.getDay());
  if (spec.dayStar || spec.weekdayStar) return dom && dow;
  return dom || dow;
}

/** from 이후(초과) 실행 시각을 최대 count개 찾는다. 로컬 시간대 기준, 최대 5년 앞까지 탐색. */
export function nextRuns(spec: CronSpec, from: Date, count = 5): Date[] {
  const runs: Date[] = [];
  const day = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  for (let i = 0; i < 366 * 5 && runs.length < count; i++, day.setDate(day.getDate() + 1)) {
    if (!dayMatches(spec, day)) continue;
    for (const h of spec.hours) {
      for (const m of spec.minutes) {
        const t = new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, m);
        if (t > from) {
          runs.push(t);
          if (runs.length === count) return runs;
        }
      }
    }
  }
  return runs;
}
