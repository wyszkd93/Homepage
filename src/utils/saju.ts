// 재미로 보는 사주 계산. 절기 날짜는 해마다 하루 정도 차이가 나므로 평균 날짜로 근사합니다.

export const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const STEMS_KO = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
export const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
export const BRANCHES_KO = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
export const ANIMALS = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];

export type Element = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export const ELEMENTS: Element[] = ['wood', 'fire', 'earth', 'metal', 'water'];
export const ELEMENT_KO: Record<Element, string> = { wood: '목', fire: '화', earth: '토', metal: '금', water: '수' };
export const ELEMENT_HANJA: Record<Element, string> = { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' };

const STEM_EL: Element[] = ['wood', 'wood', 'fire', 'fire', 'earth', 'earth', 'metal', 'metal', 'water', 'water'];
const BRANCH_EL: Element[] = ['water', 'earth', 'wood', 'wood', 'earth', 'fire', 'fire', 'earth', 'metal', 'metal', 'earth', 'water'];

export const stemElement = (s: number) => STEM_EL[s];
export const branchElement = (b: number) => BRANCH_EL[b];

export interface Pillar { stem: number; branch: number }

// 각 달의 절입일(평균). 이 날부터 해당 지지의 달이 시작됩니다.
// 소한(1/6)=丑, 입춘(2/4)=寅, 경칩(3/6)=卯, 청명(4/5)=辰, 입하(5/6)=巳, 망종(6/6)=午,
// 소서(7/7)=未, 입추(8/8)=申, 백로(9/8)=酉, 한로(10/8)=戌, 입동(11/7)=亥, 대설(12/7)=子
const TERM_DAY = [6, 4, 6, 5, 6, 6, 7, 8, 8, 8, 7, 7];

const mod = (n: number, m: number) => ((n % m) + m) % m;

/** 1900-01-01(甲戌日)을 기준으로 한 일주 */
export function dayPillar(y: number, m: number, d: number): Pillar {
  const days = Math.round((Date.UTC(y, m - 1, d) - Date.UTC(1900, 0, 1)) / 86400000);
  const idx = mod(10 + days, 60);
  return { stem: idx % 10, branch: idx % 12 };
}

export function yearPillar(y: number, m: number, d: number): Pillar {
  // 입춘 전이면 지난해로 봅니다.
  const yy = m < 2 || (m === 2 && d < TERM_DAY[1]) ? y - 1 : y;
  return { stem: mod(yy - 4, 10), branch: mod(yy - 4, 12) };
}

export function monthPillar(y: number, m: number, d: number): Pillar {
  // 절입일 전이면 이전 달로
  let mm = d >= TERM_DAY[m - 1] ? m : m - 1; // 1~12, 0이면 전년 12월
  if (mm === 0) mm = 12;
  // 양력 2월(입춘 이후)=寅(2), 3월=卯 ... 1월=丑
  const branch = mod(mm, 12);
  const ys = yearPillar(y, m, d).stem;
  // 오호둔: 甲·己년 → 寅월 丙
  const tigerStem = mod((ys % 5) * 2 + 2, 10);
  const stem = mod(tigerStem + mod(branch - 2, 12), 10);
  return { stem, branch };
}

/** hourBranch: 0(子)~11(亥). 오서둔: 甲·己일 → 子시 甲 */
export function hourPillar(dayStem: number, hourBranch: number): Pillar {
  return { stem: mod((dayStem % 5) * 2 + hourBranch, 10), branch: hourBranch };
}

export interface Saju {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar | null;
  counts: Record<Element, number>;
}

/** hourBranch가 null이면 시주를 모름으로 둡니다. 子시(23:30~)는 다음 날로 넘기지 않고 그날의 子시로 봅니다. */
export function calcSaju(y: number, m: number, d: number, hourBranch: number | null): Saju {
  const year = yearPillar(y, m, d);
  const month = monthPillar(y, m, d);
  const day = dayPillar(y, m, d);
  const hour = hourBranch === null ? null : hourPillar(day.stem, hourBranch);
  const counts: Record<Element, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const p of [year, month, day, hour]) {
    if (!p) continue;
    counts[STEM_EL[p.stem]]++;
    counts[BRANCH_EL[p.branch]]++;
  }
  return { year, month, day, hour, counts };
}

// 상생: 목→화→토→금→수→목, 상극: 목→토→수→화→금→목
const GEN: Record<Element, Element> = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' };
const CTRL: Record<Element, Element> = { wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood' };

export type Relation = 'same' | 'helped' | 'helps' | 'controls' | 'controlled';
/** 오늘(b)이 나(a)에게 어떤 기운인지 */
export function relation(me: Element, today: Element): Relation {
  if (me === today) return 'same';
  if (GEN[today] === me) return 'helped';
  if (GEN[me] === today) return 'helps';
  if (CTRL[me] === today) return 'controls';
  return 'controlled';
}

export const pillarText = (p: Pillar) => `${STEMS[p.stem]}${BRANCHES[p.branch]}`;
export const pillarKo = (p: Pillar) => `${STEMS_KO[p.stem]}${BRANCHES_KO[p.branch]}`;
