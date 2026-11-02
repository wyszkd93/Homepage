// 모구의 견생 한 바퀴: 강아지 한 마리의 일생을 해마다 진행하는 간단한 시뮬레이션 엔진.
// 견종별 수명·비율은 공개 자료(견종 표준, 국내 반려견 등록 통계 등)를 바탕으로 한 대략값입니다.

export interface Breed {
  id: string;
  name: string;
  emoji: string;
  size: 'small' | 'medium' | 'large';
  weight: number; // 태어날 확률 가중치 (국내 인기 순 대략)
  life: [number, number]; // 평균 수명 범위(년)
  trait: string;
}

export const BREEDS: Breed[] = [
  { id: 'maltese', name: '말티즈', emoji: '🐩', size: 'small', weight: 22, life: [12, 15], trait: '하얀 솜뭉치' },
  { id: 'poodle', name: '푸들', emoji: '🐩', size: 'small', weight: 16, life: [14, 16], trait: '똑똑한 곱슬이' },
  { id: 'pomeranian', name: '포메라니안', emoji: '🐕', size: 'small', weight: 13, life: [12, 16], trait: '모구와 같은 견종' },
  { id: 'mix', name: '믹스견', emoji: '🐕', size: 'medium', weight: 12, life: [13, 15], trait: '세상에 하나뿐인 조합' },
  { id: 'shihtzu', name: '시츄', emoji: '🐶', size: 'small', weight: 7, life: [10, 16], trait: '느긋한 털보' },
  { id: 'chihuahua', name: '치와와', emoji: '🐕', size: 'small', weight: 5, life: [14, 16], trait: '작지만 용감한' },
  { id: 'bichon', name: '비숑 프리제', emoji: '🐩', size: 'small', weight: 5, life: [14, 15], trait: '구름 같은 털' },
  { id: 'jindo', name: '진돗개', emoji: '🐕', size: 'medium', weight: 4, life: [12, 15], trait: '한 사람만 보는 의리' },
  { id: 'corgi', name: '웰시코기', emoji: '🐕', size: 'medium', weight: 3, life: [12, 13], trait: '식빵 엉덩이' },
  { id: 'shiba', name: '시바견', emoji: '🐕', size: 'medium', weight: 3, life: [13, 16], trait: '도도한 표정' },
  { id: 'yorkie', name: '요크셔테리어', emoji: '🐕', size: 'small', weight: 3, life: [13, 16], trait: '반짝이는 털' },
  { id: 'dachshund', name: '닥스훈트', emoji: '🌭', size: 'small', weight: 2, life: [12, 16], trait: '긴 허리' },
  { id: 'golden', name: '골든 리트리버', emoji: '🦮', size: 'large', weight: 3, life: [10, 12], trait: '다정한 천사' },
  { id: 'labrador', name: '래브라도 리트리버', emoji: '🦮', size: 'large', weight: 2, life: [10, 12], trait: '먹는 걸 좋아하는 친구' },
];

export const NAMES = ['콩이', '보리', '초코', '뭉치', '두부', '코코', '몽이', '해피', '별이', '구름', '밤이', '쿠키', '라떼', '모카', '호두', '땅콩', '감자', '사랑', '누리', '하루', '루이', '토리', '봄이', '까미'];
export const PERSONALITIES = [
  { id: 'sweet', name: '애교쟁이', note: '사람만 보면 배를 보여 줘요' },
  { id: 'shy', name: '겁쟁이', note: '낯선 소리에 숨지만 가족 품에선 용감해요' },
  { id: 'foodie', name: '먹보', note: '부스럭 소리만 나도 달려와요' },
  { id: 'rascal', name: '장난꾸러기', note: '양말은 모두 제 장난감이에요' },
  { id: 'calm', name: '점잖은 신사', note: '가만히 곁을 지켜 줘요' },
  { id: 'curious', name: '호기심 대장', note: '산책길 냄새를 하나도 그냥 안 지나쳐요' },
  { id: 'sleepy', name: '잠꾸러기', note: '하루 대부분을 꿈속에서 보내요' },
] as const;
export const FAMILIES = [
  { id: 'single', name: '혼자 사는 직장인 집사', walk: 1.2 },
  { id: 'couple', name: '신혼부부', walk: 1.6 },
  { id: 'kids', name: '아이 둘 있는 시끌벅적한 집', walk: 1.8 },
  { id: 'grand', name: '할머니 할아버지 댁', walk: 1.4 },
  { id: 'student', name: '대학생 자취방', walk: 1.1 },
  { id: 'farm', name: '마당 있는 시골집', walk: 2.2 },
] as const;

export type Personality = (typeof PERSONALITIES)[number];
export type Family = (typeof FAMILIES)[number];

export interface Stats { health: number; happy: number; bond: number }

export interface Choice {
  id: string;
  age: number;
  q: string;
  options: { label: string; effect: Partial<Stats> & { life?: number; walk?: number; treat?: number }; text: string }[];
}

export interface LifeEvent { age: number; month: number; icon: string; text: string; effect?: Partial<Stats>; memory?: boolean }

export interface Dog {
  breed: Breed;
  name: string;
  personality: Personality;
  family: Family;
  sex: '수컷' | '암컷';
  lifespan: number; // 이번 생의 수명(년, 소수)
  stats: Stats;
  walkRate: number; // 하루 산책 횟수
  treatRate: number; // 하루 간식 개수
  walks: number;
  treats: number;
  friends: number;
  memories: string[];
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const clamp = (n: number) => Math.max(0, Math.min(100, n));
/** 받침이 있으면 '이가', 없으면 '가' (예: 땅콩이가, 보리가) */
export const nameGa = (name: string) => {
  const c = name.charCodeAt(name.length - 1) - 0xac00;
  return c >= 0 && c <= 11171 && c % 28 !== 0 ? `${name}이가` : `${name}가`;
};

export function pickBreed(): Breed {
  const total = BREEDS.reduce((a, b) => a + b.weight, 0);
  let r = Math.random() * total;
  for (const b of BREEDS) {
    r -= b.weight;
    if (r <= 0) return b;
  }
  return BREEDS[0];
}

export function born(): Dog {
  const breed = pickBreed();
  const family = pick(FAMILIES);
  const personality = pick(PERSONALITIES);
  // 수명: 견종 범위 안에서 정규분포에 가깝게, 범위를 조금 넘을 수도 있게
  const mid = (breed.life[0] + breed.life[1]) / 2;
  const spread = (breed.life[1] - breed.life[0]) / 2 + 0.8;
  const g = (Math.random() + Math.random() + Math.random()) / 3 - 0.5; // -0.5~0.5, 가운데에 몰림
  const lifespan = Math.max(8, mid + g * 2 * spread);
  return {
    breed,
    name: pick(NAMES),
    personality,
    family,
    sex: Math.random() < 0.5 ? '수컷' : '암컷',
    lifespan,
    stats: { health: 80, happy: 60, bond: 25 },
    walkRate: family.walk,
    treatRate: personality.id === 'foodie' ? 3 : 2,
    walks: 0,
    treats: 0,
    friends: 0,
    memories: [],
  };
}

export const CHOICES: Choice[] = [
  {
    id: 'neuter', age: 0.8, q: '동물병원 선생님이 중성화 수술을 권해요.',
    options: [
      { label: '수술할게요', effect: { health: 6, life: 0.6, happy: -3 }, text: '며칠 넥카라를 했지만 금방 회복했어요.' },
      { label: '조금 더 생각해 볼게요', effect: { happy: 2 }, text: '조금 더 지켜보기로 했어요.' },
    ],
  },
  {
    id: 'weekend', age: 2.5, q: '주말에는 무엇을 할까요?',
    options: [
      { label: '멀리 산책·등산', effect: { health: 6, happy: 4, bond: 4, walk: 0.3 }, text: '주말마다 새로운 냄새를 맡으러 떠나요.' },
      { label: '집에서 같이 뒹굴기', effect: { happy: 5, bond: 6, health: -2 }, text: '소파는 이제 둘만의 자리예요.' },
    ],
  },
  {
    id: 'diet', age: 5, q: '체중이 조금 늘었대요. 간식을 어떻게 할까요?',
    options: [
      { label: '다이어트 시작', effect: { health: 8, life: 0.7, happy: -4, treat: -1 }, text: '간식은 줄고 산책은 늘었어요. 몸이 가벼워졌어요.' },
      { label: '그래도 간식은 행복이야', effect: { happy: 6, health: -6, life: -0.5, treat: 1 }, text: '오늘도 간식 앞에서 꼬리가 프로펠러처럼 돌아가요.' },
    ],
  },
  {
    id: 'checkup', age: 7.5, q: '이제 노견이 될 나이예요. 정기 건강검진을 받을까요?',
    options: [
      { label: '해마다 검진할게요', effect: { health: 6, life: 1, happy: -2 }, text: '작은 이상을 일찍 찾아 바로 관리했어요.' },
      { label: '아플 때만 갈게요', effect: { happy: 2 }, text: '병원 냄새는 여전히 싫은가 봐요.' },
    ],
  },
  {
    id: 'stroller', age: 11, q: '다리에 힘이 조금 빠졌어요. 산책은 어떻게 할까요?',
    options: [
      { label: '강아지 유모차 사기', effect: { happy: 8, bond: 5 }, text: '유모차를 타고 좋아하던 공원에 다시 갔어요.' },
      { label: '집 앞만 천천히 걷기', effect: { health: 3, happy: 2, walk: -0.4 }, text: '느려도 매일 같은 길을 함께 걸어요.' },
    ],
  },
];

type Pool = { min: number; max: number; icon: string; text: (d: Dog) => string; effect?: Partial<Stats>; friend?: boolean; memory?: boolean; when?: (d: Dog) => boolean }[];

const POOL: Pool = [
  { min: 0, max: 0.4, icon: '🏠', text: (d) => `${d.family.name}에 입양됐어요. 오늘부터 이름은 '${d.name}'!`, effect: { bond: 10 }, memory: true },
  { min: 0.1, max: 0.5, icon: '💉', text: () => '예방접종을 무사히 마쳤어요. 용감했어요!', effect: { health: 4 } },
  { min: 0.2, max: 0.9, icon: '🧻', text: () => '배변 패드를 드디어 정확히 맞혔어요. 온 가족이 박수!', effect: { bond: 4 } },
  { min: 0.3, max: 1, icon: '🌸', text: () => '첫 산책! 세상이 이렇게 냄새로 가득한 줄 몰랐어요.', effect: { happy: 6 }, memory: true },
  { min: 0.3, max: 1.5, icon: '🧦', text: () => '양말 한 짝이 사라졌어요. 범인은 꼬리를 흔들고 있어요.', effect: { happy: 3 }, when: (d) => d.personality.id === 'rascal' || Math.random() < 0.4 },
  { min: 1, max: 9, icon: '🐾', text: () => '공원에서 단짝 친구를 사귀었어요.', effect: { happy: 5 }, friend: true },
  { min: 1, max: 10, icon: '🎂', text: (d) => `생일 파티! 강아지 케이크에 ${d.name}의 이름이 적혀 있었어요.`, effect: { happy: 5, bond: 3 }, memory: true },
  { min: 1, max: 12, icon: '🍗', text: () => '식탁 위 닭가슴살을 몰래 먹다 딱 걸렸어요.', effect: { happy: 4, bond: -1 }, when: (d) => d.personality.id === 'foodie' || Math.random() < 0.4 },
  { min: 1, max: 9, icon: '✂️', text: () => '미용실에서 돌아왔더니 다른 강아지 같대요. 본인도 당황.', effect: { happy: -2 } },
  { min: 1, max: 9, icon: '🌊', text: () => '처음으로 바다에 갔어요. 파도한테 짖었어요.', effect: { happy: 7 }, memory: true },
  { min: 1.5, max: 8, icon: '⛺', text: () => '가족과 캠핑을 떠났어요. 텐트 안이 제일 좋았대요.', effect: { happy: 6, bond: 5 }, memory: true },
  { min: 2, max: 10, icon: '🐱', text: () => '집에 고양이 동생이 왔어요. 아직은 서로 눈치 보는 중.', effect: { happy: -2 }, friend: true },
  { min: 2, max: 10, icon: '👶', text: () => '사람 아기가 태어났어요. 아기 침대 옆을 지키는 경비원이 됐어요.', effect: { bond: 6 }, memory: true, when: (d) => d.family.id === 'couple' },
  { min: 2, max: 11, icon: '📦', text: () => '이사를 했어요. 새 집 구석구석 냄새 확인 완료.', effect: { happy: -1, bond: 2 } },
  { min: 2, max: 12, icon: '❄️', text: () => '첫눈이 왔어요. 눈밭에서 미친 듯이 뛰어다녔어요.', effect: { happy: 6 }, memory: true },
  { min: 1, max: 12, icon: '😴', text: () => '햇볕 드는 창가에서 낮잠. 오늘도 평화로운 하루.', effect: { happy: 3 }, when: (d) => d.personality.id === 'sleepy' || Math.random() < 0.5 },
  { min: 3, max: 12, icon: '🩺', text: () => '슬개골이 살짝 약하대요. 미끄럼 방지 매트를 깔았어요.', effect: { health: -5 }, when: (d) => d.breed.size === 'small' },
  { min: 4, max: 10, icon: '🩺', text: () => '고관절 관리를 시작했어요. 수영 재활도 같이 해요.', effect: { health: -5 }, when: (d) => d.breed.size === 'large' },
  { min: 3, max: 12, icon: '🦷', text: () => '스케일링을 받았어요. 입냄새가 사라졌대요.', effect: { health: 3 } },
  { min: 4, max: 12, icon: '🏆', text: () => '동네 강아지 운동회 달리기에서 1등!', effect: { happy: 6 }, memory: true, when: (d) => d.stats.health > 70 },
  { min: 6, max: 20, icon: '🤍', text: () => '주둥이에 흰 털이 하나둘 생겼어요.', effect: {} },
  { min: 8, max: 20, icon: '💊', text: () => '관절 영양제를 먹기 시작했어요. 맛있는 츄르에 섞어서.', effect: { health: 2 } },
  { min: 8, max: 20, icon: '🛋️', text: () => '계단 대신 강아지 계단을 놓았어요. 소파는 포기 못 해요.', effect: { happy: 2 } },
  { min: 9, max: 20, icon: '👂', text: () => '귀가 조금 어두워졌어요. 대신 손짓을 더 잘 봐요.', effect: { bond: 3 } },
  { min: 9, max: 20, icon: '🌅', text: (d) => `오늘은 ${nameGa(d.name)} 좋아하던 길을 아주 천천히 걸었어요.`, effect: { bond: 5, happy: 3 }, memory: true },
  { min: 10, max: 20, icon: '📷', text: () => '가족이 함께 사진관에서 가족사진을 찍었어요.', effect: { bond: 6 }, memory: true },
];

/** 한 해 동안 일어날 사건 1~3개 (월 순서대로) */
export function eventsForYear(d: Dog, year: number, used: Set<number>): LifeEvent[] {
  const count = year === 0 ? 3 : 1 + Math.floor(Math.random() * 2) + (Math.random() < 0.3 ? 1 : 0);
  const out: LifeEvent[] = [];
  const cands = POOL.map((p, i) => ({ p, i })).filter(({ p, i }) => {
    if (used.has(i) && !(p.icon === '🐾' || p.icon === '😴')) return false;
    const lo = Math.max(p.min, year);
    const hi = Math.min(p.max, year + 1, d.lifespan);
    return lo < hi && (!p.when || p.when(d));
  });
  // 0살은 입양을 반드시 먼저
  if (year === 0) cands.sort((a, b) => a.p.min - b.p.min);
  for (let k = 0; k < count && cands.length; k++) {
    const idx = year === 0 ? 0 : Math.floor(Math.random() * cands.length);
    const { p, i } = cands.splice(idx, 1)[0];
    used.add(i);
    const lo = Math.max(p.min, year);
    const hi = Math.min(p.max, year + 1, d.lifespan);
    const age = year === 0 ? lo + (hi - lo) * (k / 3 + Math.random() * 0.2) : rand(lo, hi);
    out.push({ age, month: Math.floor((age % 1) * 12), icon: p.icon, text: p.text(d), effect: p.effect, memory: p.memory });
    if (p.friend) d.friends++;
  }
  return out.sort((a, b) => a.age - b.age);
}

export function applyEffect(d: Dog, e: Partial<Stats> & { life?: number; walk?: number; treat?: number } = {}) {
  if (e.health) d.stats.health = clamp(d.stats.health + e.health);
  if (e.happy) d.stats.happy = clamp(d.stats.happy + e.happy);
  if (e.bond) d.stats.bond = clamp(d.stats.bond + e.bond);
  if (e.life) d.lifespan += e.life;
  if (e.walk) d.walkRate = Math.max(0.5, d.walkRate + e.walk);
  if (e.treat) d.treatRate = Math.max(0.5, d.treatRate + e.treat);
}

/** 시간이 dt년 흐를 때: 산책·간식 누적, 나이에 따른 건강 변화 */
export function tick(d: Dog, age: number, dt: number) {
  d.walks += d.walkRate * 365 * dt;
  d.treats += d.treatRate * 365 * dt;
  const senior = age > d.lifespan * 0.65;
  d.stats.health = clamp(d.stats.health + (senior ? -6 : 0.5) * dt);
  d.stats.bond = clamp(d.stats.bond + 1.2 * dt);
  d.stats.happy = clamp(d.stats.happy - 3.5 * dt);
  // 건강이 아주 나쁘면 수명이 조금씩 줄어요
  if (d.stats.health < 25) d.lifespan -= 0.15 * dt;
}

export function stageOf(age: number, d: Dog) {
  if (age < 1) return { label: '아기 강아지', icon: '🍼' };
  if (age < d.lifespan * 0.6) return { label: '어른 강아지', icon: d.breed.emoji };
  return { label: '노견', icon: '🦴' };
}

export function ageText(age: number) {
  const y = Math.floor(age);
  const m = Math.floor((age - y) * 12);
  return y === 0 ? `${m}개월` : m ? `${y}살 ${m}개월` : `${y}살`;
}

// ── 강아지별로 가기 전, 가족에게 남기는 말 ──
// 살아온 기록(가족·성격·기억·선택·산책 수)을 보고 3~4문장을 고릅니다.
const OPEN_BY_FAMILY: Record<string, string> = {
  single: '혼자 퇴근하던 너의 저녁, 문 앞에서 기다리는 게 내 하루의 제일 큰 일이었어.',
  couple: '둘이서 나를 부르던 목소리가 세상에서 제일 좋은 소리였어.',
  kids: '꼬마들이 자라는 걸 옆에서 다 봤어. 내가 다 키운 거나 마찬가지야.',
  grand: '할머니 할아버지 무릎이 세상에서 제일 따뜻한 자리였어.',
  student: '좁은 방이었지만, 너랑 있어서 하나도 좁지 않았어.',
  farm: '마당을 달리던 날들, 바람 냄새까지 다 기억할게.',
};
const BY_MEMORY: Record<string, string> = {
  '🌊': '바다에서 파도한테 짖던 날 기억나? 사실 좀 무서웠는데 네가 웃어서 괜찮았어.',
  '❄️': '첫눈 오던 날, 우리 둘 다 바보처럼 뛰어다녔잖아.',
  '🎂': '내 이름 적힌 케이크, 정말 맛있었어. 내년 몫까지 먹은 걸로 할게.',
  '⛺': '캠핑 가서 텐트에 같이 누워 있던 밤이 자꾸 생각나.',
  '🐱': '고양이 동생이랑은 결국 친해졌어. 내 몫까지 잘 챙겨 줘.',
  '👶': '아기 침대 옆을 지키는 일, 나 꽤 잘했지?',
  '🏆': '운동회 1등 한 거, 동네방네 자랑해도 돼.',
  '📷': '가족사진에 나도 넣어 줘서 고마워. 거기서 나 제일 잘 나왔지?',
  '🌅': '느려진 나랑 끝까지 같은 길을 걸어 줘서 고마워.',
  '🌸': '처음 산책하던 날, 세상이 이렇게 좋은 냄새로 가득한 줄 몰랐어.',
  '🏠': '처음 너희 집에 온 날, 사실 조금 떨렸어. 이렇게 좋은 집인 줄 몰랐거든.',
};
const BY_PERSONALITY: Record<string, string> = {
  sweet: '배 만져 줄 때가 제일 행복했어. 그 손 잊지 않을게.',
  shy: '겁 많은 나를 늘 먼저 안아 줘서 고마워. 너 덕분에 용감했어.',
  foodie: '간식은… 솔직히 조금 더 먹고 싶었어. 그래도 네가 준 건 다 맛있었어.',
  rascal: '양말 숨긴 거 미안해. 사실 네 냄새가 좋아서 그랬어.',
  calm: '말은 못 했지만 나는 늘 네 옆에 있었어. 앞으로도 그럴 거야.',
  curious: '산책길 냄새를 다 맡을 때까지 기다려 줘서 고마워.',
  sleepy: '꿈속에서도 맨날 너랑 산책했어. 거기서도 계속할게.',
};
const BY_PICK: Record<string, [string, string]> = {
  checkup: ['병원은 싫었지만, 덕분에 너랑 더 오래 있을 수 있었어.', ''],
  stroller: ['유모차 태워 줘서 고마워. 다리가 아파도 좋아하던 공원 바람을 맞을 수 있었어.', '느려진 걸음에 맞춰 천천히 걸어 줘서 고마워.'],
  diet: ['다이어트할 때 서운했던 거, 이제 다 이해해.', ''],
  weekend: ['주말마다 새 냄새 맡으러 데려가 줘서 신났어.', '소파에서 같이 뒹굴던 주말이 제일 좋았어.'],
};
const CLOSINGS = [
  '먼저 강아지별에 가서 기다릴게. 천천히, 아주 천천히 와. 사랑해.',
  '너무 오래 울지 말고, 맛있는 거 먹고 산책 많이 해. 사랑해.',
  '나는 강아지별에서 꼬리 흔들면서 기다릴게. 고마웠어, 정말 많이.',
  '다음에 또 만나면, 그때도 내가 먼저 달려갈게. 사랑해.',
];

export function lastWords(d: Dog, memories: { icon: string }[], picks: Record<string, number>): string[] {
  const out: string[] = [OPEN_BY_FAMILY[d.family.id] ?? '너희 집에 와서 정말 행복했어.'];
  // 가장 최근의 특별한 기억 하나
  const mem = [...memories].reverse().find((m) => BY_MEMORY[m.icon] && m.icon !== '🏠');
  if (mem) out.push(BY_MEMORY[mem.icon]);
  // 고른 선택 중 하나 (나중 선택 우선)
  for (const id of ['stroller', 'checkup', 'weekend', 'diet']) {
    if (id === 'stroller' && mem?.icon === '🌅') continue; // '천천히 걸어 줘서'가 겹치지 않게
    const k = picks[id];
    const line = k === undefined ? '' : BY_PICK[id]?.[k] ?? '';
    if (line) { out.push(line); break; }
  }
  if (out.length < 3) out.push(BY_PERSONALITY[d.personality.id] ?? '');
  if (d.walks > 3000) out.push(`같이 걸은 ${Math.round(d.walks).toLocaleString('ko-KR')}번의 산책, 하나도 안 잊을게.`);
  out.push(CLOSINGS[Math.floor(Math.random() * CLOSINGS.length)]);
  return out.filter(Boolean).slice(0, 5);
}
