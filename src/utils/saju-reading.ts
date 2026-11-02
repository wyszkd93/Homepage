// 자평명리의 기본 규칙(십성, 신강·신약, 억부 용신, 대운, 세운)으로 풀이 문장을 만듭니다.
// 규칙 기반 단순화 모델이라 실제 상담 수준의 해석과는 차이가 있습니다.
import {
  type Element, type Pillar, type Saju, ELEMENTS, ELEMENT_KO, STEMS, BRANCHES, STEMS_KO, BRANCHES_KO,
  stemElement, branchElement, monthPillar, yearPillar, TERM_DAY,
} from './saju';

export type Gender = 'male' | 'female' | null;
export type God = '비견' | '겁재' | '식신' | '상관' | '편재' | '정재' | '편관' | '정관' | '편인' | '정인';
export type Group = '비겁' | '식상' | '재성' | '관성' | '인성';

const mod = (n: number, m: number) => ((n % m) + m) % m;

// 지지의 본기(本氣) 천간
const MAIN_STEM = [9, 5, 0, 1, 4, 2, 3, 5, 6, 7, 4, 8];
const GEN: Record<Element, Element> = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' };
const CTRL: Record<Element, Element> = { wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood' };
const PARENT = (e: Element) => ELEMENTS.find((x) => GEN[x] === e)!;
const CONTROLLER = (e: Element) => ELEMENTS.find((x) => CTRL[x] === e)!;

export const GROUP_OF: Record<God, Group> = {
  비견: '비겁', 겁재: '비겁', 식신: '식상', 상관: '식상', 편재: '재성', 정재: '재성', 편관: '관성', 정관: '관성', 편인: '인성', 정인: '인성',
};
const GROUPS: Group[] = ['비겁', '식상', '재성', '관성', '인성'];

/** 일간(dayStem) 기준으로 다른 천간(stem)의 십성 */
export function godOfStem(dayStem: number, stem: number): God {
  const me = stemElement(dayStem);
  const o = stemElement(stem);
  const same = dayStem % 2 === stem % 2;
  if (o === me) return same ? '비견' : '겁재';
  if (GEN[me] === o) return same ? '식신' : '상관';
  if (CTRL[me] === o) return same ? '편재' : '정재';
  if (CTRL[o] === me) return same ? '편관' : '정관';
  return same ? '편인' : '정인';
}
export const godOfBranch = (dayStem: number, branch: number) => godOfStem(dayStem, MAIN_STEM[branch]);

/** 그룹별로 해당하는 오행 */
export function groupElement(dayStem: number, g: Group): Element {
  const me = stemElement(dayStem);
  return { 비겁: me, 식상: GEN[me], 재성: CTRL[me], 관성: CONTROLLER(me), 인성: PARENT(me) }[g];
}

// 위치별 가중치: 월지(득령)가 가장 크고, 일지가 다음
const W = { yS: 1, yB: 1, mS: 1, mB: 3, dB: 2, hS: 1, hB: 1 };

export interface Structure {
  gods: { pos: string; char: string; god: God }[];
  weights: Record<Group, number>;
  godCount: Record<God, number>;
  support: number; // 비겁+인성 가중치 합
  total: number;
  strength: '신강' | '중화' | '신약';
  deukryeong: boolean; // 월지가 일간을 돕는지
  dominant: Group;
  missing: Group[];
  yongsin: Element; // 억부 용신(단순화)
  good: Element[]; // 희신 포함 유리한 오행
  bad: Element[]; // 기신
}

export function analyze(s: Saju): Structure {
  const ds = s.day.stem;
  const items: { pos: string; char: string; god: God; w: number }[] = [
    { pos: '년간', char: STEMS[s.year.stem], god: godOfStem(ds, s.year.stem), w: W.yS },
    { pos: '년지', char: BRANCHES[s.year.branch], god: godOfBranch(ds, s.year.branch), w: W.yB },
    { pos: '월간', char: STEMS[s.month.stem], god: godOfStem(ds, s.month.stem), w: W.mS },
    { pos: '월지', char: BRANCHES[s.month.branch], god: godOfBranch(ds, s.month.branch), w: W.mB },
    { pos: '일지', char: BRANCHES[s.day.branch], god: godOfBranch(ds, s.day.branch), w: W.dB },
  ];
  if (s.hour) {
    items.push({ pos: '시간', char: STEMS[s.hour.stem], god: godOfStem(ds, s.hour.stem), w: W.hS });
    items.push({ pos: '시지', char: BRANCHES[s.hour.branch], god: godOfBranch(ds, s.hour.branch), w: W.hB });
  }
  const weights: Record<Group, number> = { 비겁: 0, 식상: 0, 재성: 0, 관성: 0, 인성: 0 };
  const godCount = {} as Record<God, number>;
  for (const it of items) {
    weights[GROUP_OF[it.god]] += it.w;
    godCount[it.god] = (godCount[it.god] ?? 0) + 1;
  }
  const total = items.reduce((a, b) => a + b.w, 0);
  const support = weights.비겁 + weights.인성;
  const ratio = support / total;
  const strength = ratio >= 0.55 ? '신강' : ratio <= 0.4 ? '신약' : '중화';
  const mg = GROUP_OF[godOfBranch(ds, s.month.branch)];
  const deukryeong = mg === '비겁' || mg === '인성';
  const dominant = [...GROUPS].sort((a, b) => weights[b] - weights[a])[0];
  const missing = GROUPS.filter((g) => weights[g] === 0);

  const el = (g: Group) => groupElement(ds, g);
  let yongsin: Element;
  let good: Element[];
  let bad: Element[];
  if (strength === '신강') {
    // 힘이 넘치면 설기(식상)·소모(재성)·제어(관성) 중 원국에 적은 쪽을 씁니다.
    const cand: Group[] = ['식상', '재성', '관성'];
    const pick = cand.sort((a, b) => weights[a] - weights[b])[0];
    yongsin = el(pick);
    good = cand.map(el);
    bad = [el('비겁'), el('인성')];
  } else if (strength === '신약') {
    // 힘이 부족하면 생해 주는 인성, 인성이 이미 많으면 비겁
    const pick: Group = weights.인성 <= weights.비겁 ? '인성' : '비겁';
    yongsin = el(pick);
    good = [el('인성'), el('비겁')];
    bad = [el('재성'), el('관성'), el('식상')];
  } else {
    const counts = s.counts;
    yongsin = [...ELEMENTS].sort((a, b) => counts[a] - counts[b])[0];
    good = [yongsin, PARENT(yongsin)];
    bad = [CONTROLLER(yongsin)];
  }
  return {
    gods: items.map(({ pos, char, god }) => ({ pos, char, god })),
    weights, godCount, support, total, strength, deukryeong, dominant, missing, yongsin, good, bad,
  };
}

// ── 대운 ──────────────────────────────────────────────
const idx60 = (p: Pillar) => mod(6 * p.stem - 5 * p.branch, 60);
const fromIdx = (i: number): Pillar => ({ stem: mod(i, 10), branch: mod(i, 12) });

export interface Daeun { startAge: number; pillar: Pillar }

export function daeun(y: number, m: number, d: number, gender: Exclude<Gender, null>) {
  const ys = yearPillar(y, m, d).stem;
  const forward = (ys % 2 === 0) === (gender === 'male'); // 양남음녀 순행
  const birth = Date.UTC(y, m - 1, d);
  const termOf = (yy: number, mm: number) => Date.UTC(yy, mm - 1, TERM_DAY[mm - 1]);
  let days: number;
  if (forward) {
    let ny = y, nm = m;
    if (d >= TERM_DAY[m - 1]) { nm = m + 1; if (nm === 13) { nm = 1; ny++; } }
    days = (termOf(ny, nm) - birth) / 86400000;
  } else {
    let py = y, pm = m;
    if (d < TERM_DAY[m - 1]) { pm = m - 1; if (pm === 0) { pm = 12; py--; } }
    days = (birth - termOf(py, pm)) / 86400000;
  }
  const start = Math.max(1, Math.round(days / 3));
  const base = idx60(monthPillar(y, m, d));
  const list: Daeun[] = [];
  for (let k = 0; k < 9; k++) list.push({ startAge: start + 10 * k, pillar: fromIdx(base + (forward ? k + 1 : -(k + 1))) });
  return { forward, start, list };
}

// ── 지지 관계 ─────────────────────────────────────────
const isClash = (a: number, b: number) => mod(a - b, 12) === 6;
const HARMONY = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]];
const isHarmony = (a: number, b: number) => HARMONY.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

// ── 문장 데이터 ───────────────────────────────────────
const GROUP_TRAIT: Record<Group, string> = {
  비겁: '자기 주관과 독립심이 강합니다. 스스로 결정하고 밀고 나가는 힘이 있지만, 고집이 세다는 말을 듣기 쉽고 경쟁 상황에서 감정 소모가 큽니다.',
  식상: '표현력과 손재주, 아이디어가 강점입니다. 머릿속 생각을 결과물로 만들어 내는 능력이 좋지만, 틀에 박힌 규칙이나 간섭을 답답해합니다.',
  재성: '현실 감각과 결과 지향성이 뚜렷합니다. 손익 계산이 빠르고 일 처리가 실용적이지만, 일을 많이 벌여 체력과 시간이 부족해지기 쉽습니다.',
  관성: '책임감과 원칙을 중시합니다. 조직과 규칙 안에서 신뢰를 얻지만, 스스로에게 거는 기대가 커서 압박과 스트레스를 많이 받습니다.',
  인성: '배우고 생각하는 힘이 큽니다. 이해력과 판단력이 좋고 자격·전문성을 쌓는 데 유리하지만, 생각이 많아 실행이 늦어질 수 있습니다.',
};
const MISSING_NOTE: Record<Group, string> = {
  비겁: '비겁이 없어 혼자 버티는 힘이 약할 수 있으니 믿을 만한 동료를 곁에 두는 것이 좋습니다.',
  식상: '식상이 없어 생각을 밖으로 드러내는 데 시간이 걸립니다. 기록과 발표를 의식적으로 연습하면 보완됩니다.',
  재성: '재성이 없어 돈에 대한 감각을 따로 훈련해야 합니다. 수입·지출을 숫자로 관리하는 습관이 필요합니다.',
  관성: '관성이 없어 규칙에 얽매이지 않는 대신 스스로 마감과 기준을 정해 두지 않으면 흐트러지기 쉽습니다.',
  인성: '인성이 없어 쉬는 법에 서툴 수 있습니다. 배움과 휴식의 시간을 일정에 넣어 두세요.',
};
const STRENGTH_NOTE = {
  신강: '일간의 힘이 강한 사주입니다. 에너지가 넘치므로 일·활동·지출로 기운을 써 줄 때 운이 풀립니다. 혼자 다 하려는 성향은 줄이는 것이 좋습니다.',
  중화: '일간의 힘이 비교적 균형 잡힌 사주입니다. 큰 굴곡보다 꾸준함이 강점이며, 부족한 오행을 채우는 방향으로 움직이면 좋습니다.',
  신약: '일간의 힘이 약한 사주입니다. 혼자 무리하기보다 사람·공부·자격의 도움을 받을 때 성과가 커집니다. 체력과 컨디션 관리가 곧 운 관리입니다.',
};

const JOB_BY_GROUP: Record<Group, string> = {
  비겁: '독립 전문직, 프리랜서, 영업·스포츠·코칭처럼 본인 역량이 곧 성과가 되는 일',
  식상: '개발·엔지니어링, 콘텐츠·디자인, 교육·강의, 요리처럼 기술과 표현을 결과물로 만드는 일',
  재성: '금융·회계, 유통·무역, 영업관리, 사업 운영처럼 돈과 자원을 직접 다루는 일',
  관성: '공공기관, 대기업 관리직, 법·감사·보안처럼 규칙과 책임이 분명한 조직의 일',
  인성: '연구·교육, 자격 기반 전문직, 상담·기획처럼 지식과 문서를 다루는 일',
};
const JOB_BY_ELEMENT: Record<Element, string> = {
  wood: '교육·출판·디자인·의류',
  fire: 'IT·전기전자·방송·마케팅',
  earth: '부동산·건설·중개·식품',
  metal: '금융·기계·법률·의료기기',
  water: '무역·물류·데이터·연구·서비스',
};

const SPOUSE_PALACE: Record<God, string> = {
  비견: '배우자와 친구처럼 대등한 관계를 원합니다. 서로의 영역을 존중하지 않으면 주도권 다툼이 생깁니다.',
  겁재: '배우자와의 관계에서 경쟁심이나 금전 문제가 끼어들기 쉽습니다. 돈 관리 원칙을 미리 정해 두세요.',
  식신: '편안하고 다정한 관계를 만듭니다. 함께 먹고 즐기는 시간이 관계를 단단하게 합니다.',
  상관: '감정 표현이 솔직하고 기준이 높습니다. 말이 날카로워지는 순간을 조심하면 관계가 오래갑니다.',
  편재: '활동적이고 즐거운 연애를 합니다. 관계의 안정감을 의식적으로 챙길 필요가 있습니다.',
  정재: '현실적이고 안정적인 결혼 생활을 지향합니다. 생활 리듬과 경제관이 맞는 사람이 잘 맞습니다.',
  편관: '긴장감 있는 관계가 되기 쉽습니다. 상대를 통제하거나 통제당하지 않도록 거리를 조절하세요.',
  정관: '예의와 책임을 중시하는 관계를 만듭니다. 서로 믿고 맡기는 안정적인 결혼에 유리합니다.',
  편인: '혼자만의 시간이 꼭 필요한 편입니다. 이를 이해해 주는 상대와 잘 맞습니다.',
  정인: '배우자에게 보살핌을 받거나 서로 정서적으로 의지하는 관계입니다. 의존이 지나치지 않게 균형을 잡으세요.',
};

const THEME: Record<Group, string> = {
  비겁: '독립·경쟁·지출이 늘어나는 시기. 동업과 보증, 큰 돈거래는 신중하게',
  식상: '표현·기술·새 시도의 시기. 이직·창업 아이디어가 많아지고 결과물을 내기 좋음',
  재성: '돈과 일이 함께 바빠지는 시기. 수입 기회가 늘지만 체력 관리 필요',
  관성: '책임·승진·조직의 시기. 평가와 압박이 커지지만 자리를 잡기 좋음',
  인성: '공부·자격·문서의 시기. 계약, 이사, 자격 취득, 내실 다지기에 유리',
};

const HABIT_BY_ELEMENT: Record<Element, string> = {
  wood: '아침에 20~30분 걷기와 새로운 공부 계획 세우기. 목(木) 기운은 성장과 시작의 에너지라 하루를 일찍 여는 습관이 운을 엽니다.',
  fire: '햇볕을 쬐며 땀이 나는 운동을 주 3회 이상 하고, 생각을 사람들 앞에서 말로 꺼내 보세요. 화(火) 기운은 활동과 표현에서 살아납니다.',
  earth: '식사·수면 시간을 고정하고 가계부나 업무 일지를 매일 정리하세요. 토(土) 기운은 규칙성과 신뢰에서 나옵니다.',
  metal: '불필요한 물건과 일을 정기적으로 정리하고 마감·원칙을 문서로 정해 두세요. 금(金) 기운은 결단과 정리에서 힘을 얻습니다.',
  water: '수면 7시간과 물 섭취를 챙기고, 하루 10분 독서·일기로 생각을 정리하세요. 수(水) 기운은 휴식과 사유에서 채워집니다.',
};
const HABIT_BY_GROUP: Record<Group, string> = {
  비겁: '돈거래·보증은 하지 않는다는 원칙을 세우고, 결정 전에 한 사람에게 의견을 묻는 습관을 들이세요. 강한 주관이 고집으로 흐르는 것을 막아 줍니다.',
  식상: '말하거나 글을 올리기 전에 한 번 더 읽고 보내는 습관을 들이세요. 뛰어난 표현력이 구설로 바뀌는 것을 막아 줍니다.',
  재성: '수입의 일정 비율을 자동 저축하고, 일정표에 쉬는 시간을 먼저 넣으세요. 일을 많이 벌이는 성향에서 오는 과로를 막아 줍니다.',
  관성: '퇴근 후 업무 연락을 끊는 시간을 정하고 주 1회는 온전히 쉬세요. 책임감에서 오는 압박을 덜어 줍니다.',
  인성: '생각한 일은 24시간 안에 작은 것 하나라도 실행하세요. 고민이 길어져 기회를 놓치는 것을 막아 줍니다.',
};
const HABIT_BY_STRENGTH = {
  신강: '남는 에너지를 운동·봉사·취미 활동으로 꾸준히 써 주세요. 신강한 사주는 기운을 밖으로 쓸 때 막힌 일이 풀립니다.',
  중화: '지금의 균형을 지키는 것이 핵심입니다. 무리한 확장보다 같은 일을 오래 꾸준히 하는 루틴을 만드세요.',
  신약: '무리한 약속을 줄이고 컨디션이 좋은 시간대에 중요한 일을 배치하세요. 신약한 사주는 체력을 아끼는 것이 곧 성과입니다.',
};

const fav = (st: Structure, p: Pillar) => {
  const es = [stemElement(p.stem), branchElement(p.branch)];
  const g = es.filter((e) => st.good.includes(e)).length;
  const b = es.filter((e) => st.bad.includes(e)).length;
  return g - b; // 2·1 좋음, 0 보통, 음수 주의
};
const favLabel = (n: number) => (n >= 1 ? '좋음' : n === 0 ? '보통' : '주의');
const pName = (p: Pillar) => `${STEMS[p.stem]}${BRANCHES[p.branch]}(${STEMS_KO[p.stem]}${BRANCHES_KO[p.branch]})`;

export interface Reading {
  structure: { title: string; paras: string[]; gods: string };
  money: string[];
  relation: string[];
  daeun: { note: string; rows: { age: string; pillar: string; theme: string; fav: string; current: boolean }[]; paras: string[] } | null;
  year: { title: string; paras: string[] };
  habits: string[];
  yongsin: Element;
}

export function reading(s: Saju, birth: { y: number; m: number; d: number }, gender: Gender, now = new Date()): Reading {
  const st = analyze(s);
  const ds = s.day.stem;
  const el = (g: Group) => ELEMENT_KO[groupElement(ds, g)];

  // 1. 원국 구조와 성격
  const strong = ELEMENTS.filter((e) => s.counts[e] >= 3).map((e) => ELEMENT_KO[e]);
  const lack = ELEMENTS.filter((e) => s.counts[e] === 0).map((e) => ELEMENT_KO[e]);
  const p1 = [
    `월지가 일간을 ${st.deukryeong ? '돕고 있어(득령) 기본 체력이 받쳐 줍니다' : '돕지 않아(실령) 계절의 힘을 받지 못합니다'}. 전체적으로 ${st.strength} 사주로 봅니다. ${STRENGTH_NOTE[st.strength]}`,
    `가장 두드러진 기운은 ${st.dominant}(${el(st.dominant)})입니다. ${GROUP_TRAIT[st.dominant]}`,
  ];
  if (strong.length || lack.length) {
    p1.push(
      [strong.length ? `${strong.join('·')} 기운이 많아 그 성향이 강하게 드러납니다.` : '', lack.length ? `${lack.join('·')} 기운이 없어 그 부분을 의식적으로 채워야 합니다.` : '']
        .filter(Boolean).join(' '),
    );
  }
  for (const g of st.missing.slice(0, 2)) p1.push(MISSING_NOTE[g]);
  p1.push(`부족한 부분을 채워 주는 용신은 ${ELEMENT_KO[st.yongsin]}(${st.yongsin === 'wood' ? '木' : st.yongsin === 'fire' ? '火' : st.yongsin === 'earth' ? '土' : st.yongsin === 'metal' ? '金' : '水'}) 기운으로 봅니다.`);
  const gods = st.gods.map((g) => `${g.pos} ${g.char} ${g.god}`).join(' · ');

  // 2. 재물과 직업
  const jae = st.weights.재성;
  const sik = st.weights.식상;
  const money: string[] = [];
  if (st.strength !== '신약' && jae >= 2) money.push('재성이 있고 일간도 힘이 있어 재물을 감당하는 그릇이 큰 편입니다. 사업·투자처럼 직접 돈을 굴리는 활동도 감당할 수 있습니다.');
  else if (st.strength !== '신약') money.push('일간의 힘은 충분하지만 재성이 약해, 돈이 저절로 들어오기보다 스스로 기회를 만들어야 벌리는 구조입니다. 실력을 수입으로 연결하는 경로를 분명히 만드세요.');
  else if (jae >= 3) money.push('재성은 많은데 일간이 약한 재다신약 구조입니다. 돈이 오가는 일은 많지만 내 것으로 남기기 어렵습니다. 큰 투자보다 고정 수입과 저축이 유리합니다.');
  else money.push('일간이 약하고 재성도 크지 않아, 안정적인 월급·전문 자격을 기반으로 꾸준히 쌓는 방식이 가장 잘 맞습니다.');
  if (sik >= 2 && jae >= 1) money.push('식상이 재성을 생하는 구조라 기술·아이디어·콘텐츠가 곧 돈이 됩니다. 본업 외 부수입 루트를 만들기에도 좋습니다.');
  const jj = st.godCount.정재 ?? 0;
  const pj = st.godCount.편재 ?? 0;
  if (jj > pj) money.push('정재가 중심이라 꾸준히 벌고 아껴 모으는 저축형입니다. 계획 없는 지출을 싫어하며, 안정 자산이 맞습니다.');
  else if (pj > jj) money.push('편재가 중심이라 돈의 흐름이 크고 유동적입니다. 기회를 잘 잡지만 지출도 큰 편이니, 수입의 일부를 반드시 묶어 두세요.');
  if ((st.godCount.겁재 ?? 0) + (st.godCount.비견 ?? 0) >= 2) money.push('비겁이 많아 돈이 사람을 통해 새어 나가기 쉽습니다. 동업·보증·지인 금전거래는 피하세요.');
  money.push(`잘 맞는 직업군은 ${JOB_BY_GROUP[st.dominant]}입니다. 용신 오행 기준으로는 ${JOB_BY_ELEMENT[st.yongsin]} 분야가 유리합니다.`);

  // 3. 인간관계와 연애·결혼
  const rel: string[] = [];
  const w = st.weights;
  if (w.비겁 >= 3) rel.push('비겁이 강해 친구와 동료가 많고 의리가 있지만, 같은 목표를 두고 경쟁하는 관계가 생기기 쉽습니다.');
  if (w.인성 >= 3) rel.push('인성이 강해 윗사람·선배의 도움을 잘 받습니다. 다만 관계에서 수동적으로 기다리는 경향이 있습니다.');
  if (w.식상 >= 3) rel.push('식상이 강해 사교적이고 대화를 이끄는 편입니다. 직설적인 말이 오해를 부르지 않게 조심하세요.');
  if (w.관성 >= 3) rel.push('관성이 강해 예의 바르고 신뢰를 얻지만, 남의 시선을 의식해 속마음을 잘 드러내지 않습니다.');
  if (w.재성 >= 3) rel.push('재성이 강해 실속 있는 관계를 선호합니다. 관계를 손익으로 본다는 오해를 받지 않도록 표현에 신경 쓰세요.');
  if (!rel.length) rel.push('어느 한쪽으로 치우치지 않아 다양한 사람과 무난하게 어울립니다. 깊은 관계는 소수와 천천히 쌓는 편입니다.');
  const dayGod = godOfBranch(ds, s.day.branch);
  rel.push(`배우자 자리인 일지는 ${BRANCHES[s.day.branch]}(${dayGod})입니다. ${SPOUSE_PALACE[dayGod]}`);
  if (gender) {
    const spouse: Group = gender === 'male' ? '재성' : '관성';
    const n = st.gods.filter((g) => GROUP_OF[g.god] === spouse).length;
    const who = gender === 'male' ? '재성(아내의 별)' : '관성(남편의 별)';
    if (n === 0) rel.push(`${who}이 원국에 드러나 있지 않아 인연이 늦게 오거나 스스로 찾아 나서야 이어집니다. 대운에서 ${spouse}이 들어오는 시기를 노려 보세요.`);
    else if (n >= 3) rel.push(`${who}이 여럿이라 이성 인연은 많지만 선택이 어렵습니다. 조건보다 생활 방식이 맞는지를 기준으로 고르세요.`);
    else rel.push(`${who}이 적당히 자리 잡고 있어 결혼 인연이 비교적 순조로운 편입니다.`);
  }
  const clashes: string[] = [];
  if (isClash(s.day.branch, s.month.branch)) clashes.push('월지');
  if (s.hour && isClash(s.day.branch, s.hour.branch)) clashes.push('시지');
  rel.push(
    clashes.length
      ? `주의할 점: 일지가 ${clashes.join('·')}와 충(沖)을 이뤄 배우자 자리가 흔들리기 쉽습니다. 이사·이직 같은 큰 변화가 관계에 영향을 주지 않도록 미리 대화하세요.`
      : `주의할 점: ${st.dominant === '비겁' ? '고집으로 상대를 이기려 하지 않기' : st.dominant === '식상' ? '감정이 상했을 때 말로 상처 주지 않기' : st.dominant === '재성' ? '바쁘다는 이유로 함께하는 시간을 미루지 않기' : st.dominant === '관성' ? '참기만 하다 한 번에 터뜨리지 않기' : '생각만 하고 표현을 미루지 않기'}가 관계를 지키는 핵심입니다.`,
  );

  // 4. 대운
  let dRes: Reading['daeun'] = null;
  const age = now.getFullYear() - birth.y;
  if (gender) {
    const du = daeun(birth.y, birth.m, birth.d, gender);
    const curIdx = du.list.findIndex((x, i) => age >= x.startAge && (i === du.list.length - 1 || age < du.list[i + 1].startAge));
    const rows = du.list.map((x, i) => {
      const g1 = GROUP_OF[godOfStem(ds, x.pillar.stem)];
      const g2 = GROUP_OF[godOfBranch(ds, x.pillar.branch)];
      return {
        age: `${x.startAge}~${x.startAge + 9}세`,
        pillar: pName(x.pillar),
        theme: g1 === g2 ? g1 : `${g1}·${g2}`,
        fav: favLabel(fav(st, x.pillar)),
        current: i === curIdx,
      };
    });
    const paras: string[] = [];
    const describe = (label: string, x: Daeun) => {
      const g = GROUP_OF[godOfBranch(ds, x.pillar.branch)];
      const f = favLabel(fav(st, x.pillar));
      return `${label} ${pName(x.pillar)} 대운(${x.startAge}~${x.startAge + 9}세): ${THEME[g]}. 내 사주에는 ${f === '좋음' ? '도움이 되는 흐름' : f === '보통' ? '무난한 흐름' : '부담이 되는 흐름이라 무리한 확장보다 방어가 유리'}입니다.`;
    };
    if (curIdx >= 0) paras.push(describe('현재', du.list[curIdx]));
    else paras.push(`아직 첫 대운(${du.start}세) 전입니다.`);
    const next = du.list[curIdx + 1] ?? du.list[0];
    if (next && curIdx + 1 < du.list.length) paras.push(describe('다음', next));
    dRes = {
      note: `${du.forward ? '순행' : '역행'} · 대운수 ${du.start} · 나이는 올해 연도에서 태어난 해를 뺀 연 나이 기준`,
      rows,
      paras,
    };
  }

  // 5. 올해 세운
  const Y = now.getFullYear();
  const yp = yearPillar(Y, 6, 1);
  const yg1 = godOfStem(ds, yp.stem);
  const yg2 = godOfBranch(ds, yp.branch);
  const yf = fav(st, yp);
  const yParas = [
    `${Y}년은 ${pName(yp)}년입니다. 천간은 ${yg1}, 지지는 ${yg2}의 기운으로 들어옵니다. ${THEME[GROUP_OF[yg2]]}.`,
    yf >= 1
      ? '올해 기운이 용신 쪽이라 전반적으로 순조롭습니다. 미뤄 둔 계획을 실행하기 좋은 해입니다.'
      : yf === 0
        ? '올해 기운은 좋고 나쁨이 섞여 있습니다. 상반기에 기반을 다지고 하반기에 움직이는 편이 안전합니다.'
        : '올해 기운이 내 사주에 부담이 되는 쪽입니다. 새 일을 크게 벌이기보다 지키는 전략이 맞습니다.',
  ];
  const yb = yp.branch;
  if (isClash(yb, s.day.branch)) yParas.push(`세운 지지 ${BRANCHES[yb]}가 일지 ${BRANCHES[s.day.branch]}와 충합니다. 이사·이직·관계 변화가 생기기 쉽고 건강 관리에 신경 써야 합니다.`);
  if (isClash(yb, s.month.branch)) yParas.push(`세운 지지 ${BRANCHES[yb]}가 월지 ${BRANCHES[s.month.branch]}와 충합니다. 직장·가정 환경에 변동이 생길 수 있습니다.`);
  if (isHarmony(yb, s.day.branch)) yParas.push(`세운 지지 ${BRANCHES[yb]}가 일지와 합을 이룹니다. 새로운 인연이나 협력 관계가 생기기 좋습니다.`);
  const caution: string[] = [];
  for (let mm = 2; mm <= 13; mm++) {
    const gm = mm === 13 ? 1 : mm;
    const gy = mm === 13 ? Y + 1 : Y;
    const mp = monthPillar(gy, gm, 15);
    const bad = isClash(mp.branch, s.day.branch) || fav(st, mp) <= -2;
    if (bad) caution.push(`${gm}월 ${TERM_DAY[gm - 1]}일경~${gm === 12 ? 1 : gm + 1}월 초(${BRANCHES[mp.branch]}월)`);
  }
  yParas.push(
    caution.length
      ? `조심할 시기: ${caution.join(', ')}. 이 기간에는 큰 계약·투자·결정을 서두르지 마세요.`
      : '특별히 부딪히는 달은 없습니다. 다만 몸이 지치는 환절기에는 컨디션 관리를 우선하세요.',
  );

  // 6. 개운 습관
  const habits = [HABIT_BY_ELEMENT[st.yongsin], HABIT_BY_GROUP[st.dominant], HABIT_BY_STRENGTH[st.strength]];

  return {
    structure: { title: `${st.strength} · ${st.dominant} 중심 · 용신 ${ELEMENT_KO[st.yongsin]}`, paras: p1, gods },
    money,
    relation: rel,
    daeun: dRes,
    year: { title: `${Y}년 ${pName(yp)}`, paras: yParas },
    habits,
    yongsin: st.yongsin,
  };
}
