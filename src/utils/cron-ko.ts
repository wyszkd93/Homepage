// 한국어 일정 표현 → crontab 5필드. 자주 쓰는 표현만 규칙으로 알아듣고,
// 알아듣지 못한 부분은 leftover로 돌려줘 화면에서 알려준다.
//   예) "평일 새벽 2시" → 0 2 * * 1-5, "10분마다" → */10 * * * *,
//       "평일 9시부터 18시까지 30분마다" → */30 9-18 * * 1-5, "매월 1일 자정" → 0 0 1 * *

export interface KoCronResult {
  cron: string;
  leftover: string; // 해석하지 못하고 남은 글자 (비면 전부 이해)
}

const DOW: Record<string, number> = { 일: 0, 월: 1, 화: 2, 수: 3, 목: 4, 금: 5, 토: 6 };
// 의미 없이 붙는 말 (남아도 괜찮음)
const FILLER = /매일|에는|에|마다|실행(?:해\s*줘|하기|해)?|돌려\s*줘|돌리기|하기|해\s*줘|그리고|및|각각|정각|씩|번|날|시간|[,.·~\-]/g;

function hour(h: number, period?: string): number {
  if (!period) return h;
  if (['오후', '저녁', '밤'].includes(period)) return h === 12 ? (period === '밤' ? 0 : 12) : h + 12;
  if (['새벽', '오전', '아침'].includes(period)) return h === 12 ? 0 : h;
  return h; // 낮
}

const range = (a: number, b: number) => (a === b ? String(a) : `${a}-${b}`);

/** 숫자 목록을 crontab 표기로 (연속이면 a-b) */
function list(nums: number[]): string {
  const s = [...new Set(nums)].sort((x, y) => x - y);
  const parts: string[] = [];
  for (let i = 0; i < s.length; ) {
    let j = i;
    while (j + 1 < s.length && s[j + 1] === s[j] + 1) j++;
    parts.push(j - i >= 2 ? `${s[i]}-${s[j]}` : s.slice(i, j + 1).join(','));
    i = j + 1;
  }
  return parts.join(',');
}

export function koToCron(input: string): KoCronResult {
  let s = ` ${input.trim()} `;
  const take = (re: RegExp, fn: (m: RegExpExecArray) => void) => {
    const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
    s = s.replace(g, (...args) => {
      fn(args as unknown as RegExpExecArray);
      return ' ';
    });
  };
  if (!input.trim()) throw new Error('일정을 입력하세요. 예) 평일 새벽 2시');

  let minute: string | null = null;
  let hourF: string | null = null;
  let dom = '*';
  let month = '*';
  let dow = '*';
  const hours: number[] = [];
  const minutes: number[] = [];

  // ── 요일 ──
  const dows: number[] = [];
  take(/평일|주중/, () => dows.push(1, 2, 3, 4, 5));
  take(/주말/, () => dows.push(0, 6));
  // 월~금, 월요일부터 금요일까지
  take(/([일월화수목금토])(?:요일)?\s*(?:~|-|부터)\s*([일월화수목금토])요일(?:까지)?|([일월화수목금토])(?:요일)?\s*(?:~|-)\s*([일월화수목금토])(?![0-9])/, (m) => {
    const a = DOW[m[1] ?? m[3]];
    const b = DOW[m[2] ?? m[4]];
    for (let d = a; d !== (b + 1) % 7; d = (d + 1) % 7) dows.push(d);
  });
  // 월·수·금요일, 월요일, 매주 화요일
  take(/(?:매주\s*)?((?:[일월화수목금토]\s*[,·、]?\s*)+)요일/, (m) => {
    for (const ch of m[1].replace(/[\s,·、]/g, '')) dows.push(DOW[ch]);
  });
  // 요일 없이 나열: 월,수,금
  take(/(?<![0-9\p{L}])([일월화수목금토](?:\s*[,·、]\s*[일월화수목금토])+)(?![0-9\p{L}])/u, (m) => {
    for (const ch of m[1].replace(/[\s,·、]/g, '')) dows.push(DOW[ch]);
  });
  take(/매주/, () => {});
  if (dows.length) dow = dows.length === 7 ? '*' : list(dows);

  // ── 월·일 ──
  take(/매월|매달/, () => {});
  take(/((?:\d{1,2}\s*월\s*[,·]?\s*)+)/, (m) => {
    month = list(m[1].match(/\d{1,2}/g)!.map(Number));
  });
  take(/(\d{1,2})\s*일?\s*(?:~|부터)\s*(\d{1,2})\s*일(?:까지)?/, (m) => {
    dom = range(Number(m[1]), Number(m[2]));
  });
  take(/((?:\d{1,2}\s*일\s*[,·]?\s*)+)/, (m) => {
    dom = list(m[1].match(/\d{1,2}/g)!.map(Number));
  });
  if (/말일|마지막\s*날/.test(s)) throw new Error("'말일'은 리눅스 crontab 5필드로 표현할 수 없어요. (28~31일 + 스크립트 판단이 필요)");

  // ── 간격 ──
  take(/(\d{1,2})\s*분\s*(?:마다|간격)|매\s*(\d{1,2})\s*분/, (m) => {
    minute = `*/${m[1] ?? m[2]}`;
  });
  take(/(\d{1,2})\s*시간\s*(?:마다|간격)|매\s*(\d{1,2})\s*시간/, (m) => {
    hourF = `*/${m[1] ?? m[2]}`;
    minute ??= '0';
  });
  take(/매\s*분/, () => {
    minute = '*';
  });

  // ── 시각 ──
  take(/정오/, () => {
    hours.push(12);
    minutes.push(0);
  });
  take(/자정/, () => {
    hours.push(0);
    minutes.push(0);
  });
  // 9시부터 18시까지, 오전 9시~오후 6시, 9~18시
  take(
    /(새벽|오전|아침|낮|오후|저녁|밤)?\s*(\d{1,2})\s*시?\s*(?:부터|~|-)\s*(새벽|오전|아침|낮|오후|저녁|밤)?\s*(\d{1,2})\s*시(?:\s*까지|\s*사이)?/,
    (m) => {
      const a = hour(Number(m[2]), m[1]);
      let b = hour(Number(m[4]), m[3] ?? m[1]);
      if (b < a && b < 12) b += 12; // 오전 9시부터 6시까지 → 9-18
      hourF = range(a, b);
    },
  );
  take(/(\d{1,2}):(\d{2})/, (m) => {
    hours.push(Number(m[1]));
    minutes.push(Number(m[2]));
  });
  take(/(새벽|오전|아침|낮|오후|저녁|밤)?\s*(\d{1,2})\s*시\s*(반|(\d{1,2})\s*분)?/, (m) => {
    hours.push(hour(Number(m[2]), m[1]));
    minutes.push(m[3] === '반' ? 30 : m[4] ? Number(m[4]) : 0);
  });
  take(/매\s*시(?:간)?\s*(\d{1,2})\s*분/, (m) => {
    hourF = '*';
    minute = String(Number(m[1]));
  });
  take(/매\s*시(?:간)?/, () => {
    hourF ??= '*';
    minute ??= '0';
  });
  take(/(\d{1,2})\s*분/, (m) => {
    minutes.push(Number(m[1]));
  });

  // ── 조립 ──
  if (hours.length) {
    if (hourF) throw new Error('시간 범위와 특정 시각이 함께 있어요. 하나만 써 주세요.');
    const mins = [...new Set(minutes)];
    if (mins.length > 1 && hours.length > 1) throw new Error('시각마다 분이 달라서 한 줄로 표현할 수 없어요. (예: 9:00과 18:30은 두 줄로)');
    hourF = list(hours);
    minute ??= String(mins[0] ?? 0);
  } else if (minutes.length) {
    minute ??= list(minutes);
  }
  if (!minute && !hourF) {
    // 날짜만 있으면 자정
    if (dom === '*' && month === '*' && dow === '*') throw new Error('언제 실행할지 알아듣지 못했어요. 예) 평일 새벽 2시, 10분마다');
    minute = '0';
    hourF = '0';
  }
  minute ??= '0';
  hourF ??= '*';

  for (const [v, lo, hi, name] of [[minute, 0, 59, '분'], [hourF, 0, 23, '시'], [dom, 1, 31, '일'], [month, 1, 12, '월']] as const) {
    for (const n of v.match(/\d+/g) ?? []) {
      if (v.startsWith('*/')) continue;
      if (Number(n) < lo || Number(n) > hi) throw new Error(`${name}는 ${lo}~${hi} 사이여야 해요. (입력: ${n})`);
    }
  }

  const leftover = s.replace(FILLER, ' ').replace(/\s+/g, ' ').trim();
  return { cron: `${minute} ${hourF} ${dom} ${month} ${dow}`, leftover };
}
