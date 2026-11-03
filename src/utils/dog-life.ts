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
  { id: 'farm', name: '시골 삼대 가족', walk: 2.2 },
  { id: 'shop', name: '동네 빵집 사장님 부부', walk: 1.5 },
  { id: 'mom', name: '엄마와 딸 둘이 사는 집', walk: 1.4 },
  { id: 'share', name: '친구 셋이 사는 셰어하우스', walk: 1.6 },
  { id: 'artist', name: '그림 그리는 작가 집사', walk: 1.3 },
] as const;

// ── 사는 집: 가족마다 여러 집 중 하나로 태어나요 ──
export type Place = 'city' | 'house' | 'farm' | 'sea' | 'hanok';
export interface Home { id: string; name: string; place: Place; spots: string[] }
export const HOMES: Record<string, Home> = {
  apt: { id: 'apt', name: '아파트', place: 'city', spots: ['아파트 산책로', '단지 놀이터', '한강 공원', '호수 공원', '상가 앞 광장'] },
  officetel: { id: 'officetel', name: '오피스텔', place: 'city', spots: ['카페 거리', '빌딩 사이 공원', '강아지 운동장', '천변 산책로'] },
  villa: { id: 'villa', name: '빌라 3층', place: 'city', spots: ['동네 골목', '작은 어린이공원', '시장 길', '뒷산 둘레길'] },
  oneroom: { id: 'oneroom', name: '원룸', place: 'city', spots: ['대학가 골목', '캠퍼스 잔디밭', '편의점 앞 공터', '천변 산책로'] },
  rooftop: { id: 'rooftop', name: '옥탑방', place: 'city', spots: ['옥상 텃밭', '동네 계단길', '언덕 위 공원', '골목 놀이터'] },
  house: { id: 'house', name: '마당 있는 주택', place: 'house', spots: ['우리 집 마당', '동네 골목', '뒷산 오솔길', '개천 산책로'] },
  alley: { id: 'alley', name: '골목 안 단독주택', place: 'house', spots: ['골목 담벼락 길', '동네 공원', '시장 길', '약수터 가는 길'] },
  hanok: { id: 'hanok', name: '한옥', place: 'hanok', spots: ['한옥 마당', '돌담길', '마을 정자', '고궁 옆 산책길'] },
  seaside: { id: 'seaside', name: '바닷가 마을 집', place: 'sea', spots: ['모래사장', '방파제', '항구 앞 길', '해안 산책로', '갯벌 앞'] },
  farmhouse: { id: 'farmhouse', name: '마당 있는 시골집', place: 'farm', spots: ['마당', '개울가', '논두렁', '마을 정자', '뒷산'] },
  orchard: { id: 'orchard', name: '과수원 집', place: 'farm', spots: ['사과나무 사이', '과수원 길', '개울가', '원두막 앞'] },
  mountain: { id: 'mountain', name: '산자락 전원주택', place: 'farm', spots: ['숲길', '계곡', '산 입구', '잔디 마당', '들꽃 길'] },
  shopfront: { id: 'shopfront', name: '빵집 딸린 집', place: 'house', spots: ['가게 앞 골목', '시장 길', '동네 공원', '버스 정류장 앞'] },
  atelier: { id: 'atelier', name: '작업실 딸린 주택', place: 'house', spots: ['작업실 마당', '미술관 앞 공원', '골목 갤러리 길', '강변 산책로'] },
  // 이사 선택으로 바뀌는 집
  parkapt: { id: 'parkapt', name: '공원 앞 아파트', place: 'city', spots: ['공원 잔디밭', '공원 둘레길', '호수 공원', '강아지 운동장'] },
  nearwork: { id: 'nearwork', name: '회사 근처 오피스텔', place: 'city', spots: ['빌딩 사이 공원', '카페 거리', '점심 산책길', '천변 산책로'] },
};
const FAMILY_HOMES: Record<string, string[]> = {
  single: ['officetel', 'oneroom', 'villa', 'apt', 'rooftop'],
  couple: ['apt', 'villa', 'officetel', 'house', 'seaside'],
  kids: ['apt', 'villa', 'house', 'alley'],
  grand: ['house', 'hanok', 'alley', 'seaside'],
  student: ['oneroom', 'rooftop', 'villa'],
  farm: ['farmhouse', 'orchard', 'mountain', 'seaside'],
  shop: ['shopfront', 'villa', 'alley'],
  mom: ['apt', 'villa', 'officetel', 'alley'],
  share: ['house', 'villa', 'rooftop'],
  artist: ['atelier', 'rooftop', 'hanok', 'seaside'],
};
export const homeIs = (d: Dog, ...ids: string[]) => ids.includes(d.home.id);
export const placeIs = (d: Dog, ...ps: Place[]) => ps.includes(d.home.place);

export type Personality = (typeof PERSONALITIES)[number];
export type Family = (typeof FAMILIES)[number];

export interface Stats { health: number; happy: number; bond: number }

export interface Choice {
  id: string;
  age: number;
  q: string;
  options: { label: string; effect: Partial<Stats> & { life?: number; walk?: number; treat?: number }; text: string }[];
}

export interface LifeEvent {
  age: number; month: number; icon: string; text: string; effect?: Partial<Stats>; memory?: boolean; key?: string;
  rare?: boolean; // 아주 드물게 일어나는 일
  apply?: (d: Dog, age: number) => void; // 가족 구성 변화 같은 추가 효과
}

export interface Dog {
  breed: Breed;
  name: string;
  personality: Personality;
  family: Family;
  home: Home; // 사는 집 (이사하면 바뀌어요)
  sex: '수컷' | '암컷';
  lifespan: number; // 이번 생의 수명(년, 소수)
  stats: Stats;
  walkRate: number; // 하루 산책 횟수
  treatRate: number; // 하루 간식 개수
  walks: number;
  treats: number;
  friends: number;
  memories: string[];
  choices: Choice[]; // 이번 생에 마주칠 가족의 선택 (생마다 다르게 뽑음)
  flags: string[]; // 선택이 남긴 흔적 → 나중에 이어지는 사건
  household: { extra: ('adult' | 'child' | 'baby')[]; away: number }; // 가족 구성 변화 (장면에 반영)
  sibling: Breed | null; // 함께 사는 강아지 동생
  siblingAt: number; // 동생이 온 나이 (장면에서 동생을 아기→어른으로 그리기)
  rare: number; // 희귀한 일을 겪은 횟수
  joy: { sum: number; t: number; base: number }; // 평생 행복 점수 누적값, base: 이 강아지의 평소 기분
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
  const d: Dog = {
    breed,
    name: pick(NAMES),
    personality,
    family,
    home: HOMES[pick(FAMILY_HOMES[family.id] ?? ['apt'])],
    sex: Math.random() < 0.5 ? '수컷' : '암컷',
    lifespan,
    stats: { health: 80, happy: 60, bond: 25 },
    walkRate: family.walk,
    treatRate: personality.id === 'foodie' ? 3 : 2,
    walks: 0,
    treats: 0,
    friends: 0,
    memories: [],
    choices: [],
    flags: [],
    household: { extra: [], away: 0 },
    sibling: null,
    siblingAt: 0,
    rare: 0,
    joy: { sum: 0, t: 0, base: 0 },
  };
  // 평소 기분: 성격·가족에 따라, 그리고 타고난 운으로 조금씩 달라요
  const PBASE: Record<string, number> = { sweet: 6, foodie: 4, rascal: 3, curious: 2, sleepy: 2, calm: 0, shy: -5 };
  d.joy.base = 48 + (PBASE[personality.id] ?? 0) * 1.5 + (family.walk - 1.5) * 8 + (Math.random() - 0.5) * 34;
  d.choices = pickChoices(d);
  return d;
}

// 나이대별 선택 후보. 한 생에서는 나이대마다 하나씩, 모두 5번 고르게 됩니다.
type Opt = Choice['options'][number];
const C = (id: string, age: number, q: string, options: Opt[], when?: (d: Dog) => boolean) => ({ id, age, q, options, when });
const CHOICE_BANDS: ReturnType<typeof C>[][] = [
  [
    C('neuter', 0.8, '동물병원 선생님이 중성화 수술을 권해요.', [
      { label: '수술할게요', effect: { health: 6, life: 0.6, happy: -3 }, text: '며칠 넥카라를 했지만 금방 회복했어요.' },
      { label: '조금 더 생각해 볼게요', effect: { happy: 2 }, text: '조금 더 지켜보기로 했어요.' },
    ]),
    C('school', 0.7, '동네에 강아지 유치원이 생겼대요.', [
      { label: '보내 볼게요', effect: { happy: 4, bond: -2 }, text: '친구들 사이에서 인기 만점이래요.' },
      { label: '집에서 같이 놀래요', effect: { bond: 6 }, text: '거실이 곧 놀이터예요.' },
    ]),
    C('crate', 0.5, '밤마다 낑낑 울어요. 어디서 재울까요?', [
      { label: '침대에서 같이 자기', effect: { bond: 8, happy: 3 }, text: '이불 속이 제일 따뜻한 자리가 됐어요.' },
      { label: '전용 집에서 혼자 자기 연습', effect: { health: 2, bond: 2 }, text: '며칠 울더니 이제 자기 집이 제일 좋대요.' },
    ]),
    C('name', 0.4, '이름을 부르면 고개를 갸웃해요. 어떻게 부를까요?', [
      { label: '또박또박 이름만', effect: { bond: 6 }, text: '이름만 들어도 꼬리부터 흔들어요.' },
      { label: '애칭을 잔뜩 붙여서', effect: { happy: 5, bond: 3 }, text: '"우리 강아지 왔쪄요"에 제일 빨리 달려와요.' },
    ]),
    C('food', 0.6, '첫 사료를 골라야 해요.', [
      { label: '건강 사료로 꼼꼼하게', effect: { health: 6, life: 0.4 }, text: '성분표를 한참 읽은 보람이 있었어요.' },
      { label: '제일 잘 먹는 걸로', effect: { happy: 6, health: -1 }, text: '밥그릇을 핥아서 반짝반짝하게 만들어요.' },
    ]),
    C('socialize', 0.9, '사회화 시기래요. 바깥 세상을 얼마나 보여 줄까요?', [
      { label: '여기저기 많이 데려가기', effect: { happy: 5, health: 2 }, text: '지하철 소리도, 자전거도 이제 하나도 안 무서워요.' },
      { label: '천천히 집 근처부터', effect: { bond: 5 }, text: '익숙한 동네 냄새부터 하나씩 배웠어요.' },
    ]),
    C('bath', 0.6, '첫 목욕 날이에요.', [
      { label: '욕조에서 따뜻한 물로', effect: { bond: 4, health: 2 }, text: '거품 모자를 쓰고 얌전히 있었어요.' },
      { label: '물 없는 샴푸로 살살', effect: { happy: 3 }, text: '뽀송해진 털로 온 집을 뛰어다녔어요.' },
    ]),
    C('bite', 0.5, '손을 자꾸 깨물어요. 어떻게 가르칠까요?', [
      { label: '"아야!" 하고 놀이 멈추기', effect: { bond: 5 }, text: '세게 물면 놀이가 끝난다는 걸 금방 알았어요.' },
      { label: '치발기 장난감 쥐여 주기', effect: { happy: 4, health: 1 }, text: '치발기를 물고 소파 밑 보물창고로 가져갔어요.' },
      { label: '훈련 선생님께 배우기', effect: { bond: 3, health: 2, happy: -1 }, text: '선생님 앞에서는 세상 얌전한 척했어요.' },
    ]),
    C('collar', 0.5, '첫 목줄을 골라 볼까요?', [
      { label: '눈에 띄는 빨간 목줄', effect: { happy: 3 }, text: '빨간 목줄을 하고 동네 패셔니스타가 됐어요.' },
      { label: '털색에 맞춘 하늘색', effect: { happy: 3 }, text: '하늘색 목줄이 털색과 꼭 어울렸어요.' },
      { label: '이름표 달린 가죽 목줄', effect: { bond: 3 }, text: '짤랑거리는 이름표 소리가 우리 집 초인종이 됐어요.' },
    ]),
    C('yard', 0.7, '마당에서 키울까, 집 안에서 같이 살까요?', [
      { label: '마당에 예쁜 집 지어 주기', effect: { health: 4, happy: 3, walk: 0.2 }, text: '마당 구석구석이 다 내 영역이 됐어요.' },
      { label: '집 안에서 같이 살기', effect: { bond: 6 }, text: '아랫목 방석이 제일 따뜻한 내 자리예요.' },
    ], (d) => d.family.id === 'farm'),
    C('duty', 0.6, '아이들이 서로 산책을 시키겠대요.', [
      { label: '당번표 만들어 돌아가며', effect: { bond: 4, walk: 0.2 }, text: '냉장고에 붙은 산책 당번표에 내 발도장도 찍었어요.' },
      { label: '어른이랑 꼭 같이 다니기', effect: { health: 2, bond: 3 }, text: '아이 하나, 어른 하나, 강아지 하나. 줄이 셋이에요.' },
    ], (d) => d.family.id === 'kids'),
    C('guest', 0.5, '손님이 오면 침대 밑에 숨어요.', [
      { label: '억지로 꺼내지 않고 기다리기', effect: { bond: 6 }, text: '한참 뒤에 슬그머니 나와서 손님 냄새를 맡았어요.' },
      { label: '손님에게 간식을 부탁하기', effect: { happy: 4, bond: 2 }, text: '간식 주는 손님은 좋은 사람이래요.' },
    ], (d) => d.personality.id === 'shy' || d.personality.id === 'calm'),
    C('bakery', 0.7, '가게에 데려가도 될까요?', [
      { label: '가게 마스코트로 데려가기', effect: { happy: 5, bond: 3 }, text: '빵 굽는 냄새 속에서 손님마다 인사를 받았어요.' },
      { label: '2층 집에서 쉬게 하기', effect: { health: 2, bond: 2 }, text: '계단 위에서 가게 종소리를 들으며 기다려요.' },
    ], (d) => d.family.id === 'shop'),
    C('room', 0.6, '친구 셋 중 누구 방에서 잘까요?', [
      { label: '돌아가며 하루씩', effect: { bond: 5 }, text: '요일마다 다른 방, 다른 이불 냄새를 맡아요.' },
      { label: '거실에 내 자리 만들기', effect: { happy: 4, bond: 2 }, text: '거실 한가운데 방석이 모두의 쉼터가 됐어요.' },
    ], (d) => d.family.id === 'share'),
    C('canvas', 0.8, '작업실에 들어오고 싶어 해요.', [
      { label: '작업실 문 열어 두기', effect: { bond: 6, happy: 2 }, text: '발바닥에 물감을 묻히고 캔버스에 도장을 찍었어요.' },
      { label: '작업실 밖에 방석 두기', effect: { health: 2, bond: 3 }, text: '문턱에 턱을 괴고 그림 그리는 걸 지켜봐요.' },
    ], (d) => d.family.id === 'artist'),
    C('beach', 0.9, '처음으로 바닷가에 데려가 볼까요?', [
      { label: '파도 가까이 가 보기', effect: { happy: 6, health: 1 }, text: '파도가 밀려오자 깜짝 놀라 뒷걸음질 쳤어요.' },
      { label: '모래사장만 걷기', effect: { happy: 4, bond: 2 }, text: '모래에 찍힌 내 발자국을 한참 냄새 맡았어요.' },
    ], (d) => d.home.place === 'sea'),
  ],
  [
    C('weekend', 2.5, '주말에는 무엇을 할까요?', [
      { label: '멀리 산책·등산', effect: { health: 6, happy: 4, bond: 4, walk: 0.3 }, text: '주말마다 새로운 냄새를 맡으러 떠나요.' },
      { label: '집에서 같이 뒹굴기', effect: { happy: 5, bond: 6, health: -2 }, text: '소파는 이제 둘만의 자리예요.' },
    ]),
    C('trip', 2.2, '가족 여행을 가요. 강아지는 어떻게 할까요?', [
      { label: '애견 동반 숙소로 같이 가기', effect: { happy: 8, bond: 5 }, text: '바닷가 숙소에서 같이 노을을 봤어요.' },
      { label: '믿을 만한 호텔에 맡기기', effect: { happy: -3, health: 1 }, text: '돌아오자 꼬리가 떨어질 듯 흔들렸어요.' },
    ]),
    C('sport', 3, '어질리티(장애물 달리기)에 재능이 보인대요.', [
      { label: '대회에 나가 보자', effect: { health: 5, happy: 5, walk: 0.2 }, text: '터널을 통과할 때 관중들이 박수를 쳤어요.' },
      { label: '그냥 동네에서 즐기기', effect: { happy: 3, bond: 3 }, text: '놀이터 미끄럼틀이 우리만의 코스예요.' },
    ], (d) => d.breed.size !== 'small' || d.personality.id === 'curious'),
    C('cafe', 2, '주말에 애견카페에 가 볼까요?', [
      { label: '친구 많은 애견카페', effect: { happy: 6 }, text: '처음 본 친구들과 정신없이 뛰어놀았어요.' },
      { label: '한적한 강아지 운동장', effect: { health: 4, bond: 3 }, text: '넓은 잔디밭을 혼자 독차지하고 달렸어요.' },
    ]),
    C('hobby', 3.2, '가족이 새 취미를 시작했어요. 같이 할까요?', [
      { label: '같이 러닝하기', effect: { health: 7, walk: 0.3, happy: 2 }, text: '새벽 러닝 크루의 마스코트가 됐어요.' },
      { label: '같이 캠핑 다니기', effect: { happy: 7, bond: 4 }, text: '캠핑장마다 단골 손님이 됐어요.' },
    ]),
    C('photo', 2.8, 'SNS에 강아지 계정을 만들어 볼까요?', [
      { label: '만들어서 자랑하자', effect: { happy: 4 }, text: '팔로워들이 매일 안부를 물어요.' },
      { label: '우리끼리만 간직하기', effect: { bond: 5 }, text: '앨범 속 사진이 차곡차곡 쌓여요.' },
    ]),
    C('snow', 2.6, '첫눈이 펑펑 와요!', [
      { label: '눈밭으로 뛰어나가기', effect: { happy: 7, health: 1 }, text: '코에 눈을 얹은 채 동그라미를 그리며 뛰었어요.' },
      { label: '창문으로 같이 구경하기', effect: { bond: 4, happy: 2 }, text: '창문에 코 자국을 잔뜩 남겼어요.' },
    ]),
    C('clothes', 2.3, '강아지 옷을 선물받았어요.', [
      { label: '공룡 옷 입혀 보기', effect: { happy: 2, bond: 2 }, text: '공룡 꼬리를 끌고 다니며 동네 스타가 됐어요.' },
      { label: '불편해 보여서 벗기기', effect: { happy: 3 }, text: '역시 맨몸이 최고래요.' },
      { label: '사진 한 장만 찍고 벗기기', effect: { bond: 3 }, text: '그 사진은 지금도 가족 단톡방 프로필이에요.' },
    ]),
    C('trick', 2.7, '새 묘기를 가르쳐 볼까요?', [
      { label: '하이파이브', effect: { bond: 5 }, text: '손바닥만 보이면 앞발을 척 올려요.' },
      { label: '"빵!" 하면 쓰러지기', effect: { happy: 4, bond: 3 }, text: '쓰러지는 연기가 거의 배우급이에요.' },
      { label: '간식 앞에서 오래 기다리기', effect: { bond: 4, health: 1 }, text: '침을 흘리면서도 "먹어" 소리까지 꾹 참았어요.' },
    ]),
    C('rain', 2.1, '장마철이라 일주일째 산책을 못 했어요.', [
      { label: '우비 입고 잠깐이라도', effect: { health: 3, happy: 3 }, text: '노란 우비를 입고 웅덩이만 골라 밟았어요.' },
      { label: '집에서 숨바꼭질', effect: { bond: 5 }, text: '이불 속에 숨은 가족을 냄새로 1초 만에 찾았어요.' },
      { label: '실내 수영장 가 보기', effect: { health: 4, happy: 2 }, text: '처음엔 허우적댔지만 금방 개헤엄 선수가 됐어요.' },
    ]),
    C('exam', 2.4, '집사 시험 기간이라 산책이 짧아졌어요.', [
      { label: '도서관 앞 잔디까지 같이 가기', effect: { happy: 4, walk: 0.1 }, text: '시험 기간 내내 도서관 앞 잔디의 마스코트였어요.' },
      { label: '친구에게 산책 부탁하기', effect: { happy: 3, bond: -1 }, text: '집사 친구가 새 산책 메이트가 됐어요.' },
    ], (d) => d.family.id === 'student'),
    C('market', 2.5, '할머니가 오일장에 가신대요.', [
      { label: '장바구니 수레에 태워 같이 가기', effect: { happy: 6, bond: 3 }, text: '시장 상인들이 하나씩 간식을 쥐여 줬어요.' },
      { label: '할아버지랑 집 보기', effect: { bond: 4 }, text: '할아버지 무릎에서 라디오를 들으며 기다렸어요.' },
    ], (d) => d.family.id === 'grand' || d.family.id === 'farm'),
    C('rival', 2.9, '옆집 강아지랑 맨날 담장 너머로 짖어요.', [
      { label: '같이 산책시켜 친해지게', effect: { happy: 5 }, text: '짖던 사이가 엉덩이 냄새 맡는 사이가 됐어요.' },
      { label: '다른 길로 돌아가기', effect: { health: 2, happy: 1 }, text: '새 산책길에서 처음 보는 꽃을 발견했어요.' },
    ], (d) => d.personality.id === 'rascal' || d.personality.id === 'curious' || d.personality.id === 'sweet'),
  ],
  [
    C('elevator', 4.8, '엘리베이터에서 이웃이 강아지를 무서워해요.', [
      { label: '안고 타기', effect: { bond: 4 }, text: '이웃이 이제는 먼저 인사해 줘요.' },
      { label: '계단으로 다니기', effect: { health: 4, walk: 0.1 }, text: '계단 덕분에 다리가 튼튼해졌어요.' },
    ], (d) => homeIs(d, 'apt', 'officetel', 'villa')),
    C('garden', 5, '마당에 강아지 놀이터를 만들어 줄까요?', [
      { label: '모래 놀이터 만들기', effect: { happy: 6 }, text: '모래를 파다가 오래된 장난감을 발굴했어요.' },
      { label: '그늘막과 물그릇만', effect: { health: 3, happy: 2 }, text: '여름 오후는 그늘막 아래가 명당이에요.' },
    ], (d) => placeIs(d, 'house', 'hanok', 'farm')),
    C('fishing', 5.2, '동네 어르신이 배에 태워 주신대요.', [
      { label: '구명조끼 입고 타 보기', effect: { happy: 7, bond: 2 }, text: '뱃머리에 앉아 갈매기와 눈싸움을 했어요.' },
      { label: '방파제에서 기다리기', effect: { bond: 3 }, text: '배가 돌아오자 꼬리로 바닥을 쓸며 반겼어요.' },
    ], (d) => d.home.place === 'sea'),
    C('momday', 4.7, '엄마가 야근하는 날이 많아졌어요.', [
      { label: '딸이 산책 담당 하기', effect: { bond: 5, walk: 0.1 }, text: '딸의 하굣길이 곧 내 산책길이 됐어요.' },
      { label: '엄마 회사 근처 반려견 유치원', effect: { happy: 4 }, text: '퇴근길에 엄마와 같이 집에 와요.' },
    ], (d) => d.family.id === 'mom'),
    C('diet', 5, '체중이 조금 늘었대요. 간식을 어떻게 할까요?', [
      { label: '다이어트 시작', effect: { health: 8, life: 0.7, happy: -4, treat: -1 }, text: '간식은 줄고 산책은 늘었어요. 몸이 가벼워졌어요.' },
      { label: '그래도 간식은 행복이야', effect: { happy: 6, health: -6, life: -0.5, treat: 1 }, text: '오늘도 간식 앞에서 꼬리가 프로펠러처럼 돌아가요.' },
    ]),
    C('sibling', 4.5, '보호소에서 외로운 강아지를 데려올까 고민돼요.', [
      { label: '동생을 데려오자', effect: { happy: 5, bond: -1 }, text: '처음엔 질투했지만 이제는 꼭 붙어 자요.' },
      { label: '지금처럼 둘만', effect: { bond: 6 }, text: '가족의 사랑을 독차지하는 중이에요.' },
    ]),
    C('move', 5.5, '이사 갈 집을 골라야 해요.', [
      { label: '공원 가까운 집', effect: { health: 4, happy: 4, walk: 0.3 }, text: '창밖으로 산책길이 보여서 매일 신나요.' },
      { label: '회사 가까운 집', effect: { bond: 5, walk: -0.2 }, text: '가족이 일찍 퇴근해서 같이 있는 시간이 늘었어요.' },
    ], (d) => d.family.id !== 'farm' && d.family.id !== 'grand'),
    C('alone', 4.8, '가족이 바빠져서 혼자 있는 시간이 늘었어요.', [
      { label: '펫시터 선생님 부르기', effect: { happy: 4 }, text: '낮에 놀아 주는 선생님이 생겼어요.' },
      { label: '출근 전 산책을 길게', effect: { health: 4, bond: 4, walk: 0.2 }, text: '아침 산책이 하루 중 제일 긴 데이트가 됐어요.' },
    ]),
    C('toy', 5.2, '장난감이 다 해졌어요. 새로 뭘 사 줄까요?', [
      { label: '삑삑이 인형 세트', effect: { happy: 6 }, text: '새 인형을 하나씩 물고 자랑하러 다녀요.' },
      { label: '머리 쓰는 노즈워크 매트', effect: { health: 3, happy: 3 }, text: '간식 찾느라 코가 바빠졌어요.' },
    ]),
    C('remote', 4.6, '가족이 재택근무를 시작했어요.', [
      { label: '책상 밑을 내 자리로', effect: { bond: 6 }, text: '화상 회의마다 꼬리가 화면에 출연했어요.' },
      { label: '점심시간마다 짧은 산책', effect: { health: 4, happy: 3, walk: 0.2 }, text: '점심 산책 덕분에 동네 가게 사장님들과 다 친해졌어요.' },
    ], (d) => d.family.id !== 'grand' && d.family.id !== 'farm'),
    C('holiday', 5, '휴가를 길게 받았대요. 어디로 갈까요?', [
      { label: '배 타고 섬 여행', effect: { happy: 8, bond: 4 }, text: '배 위에서 바닷바람에 귀가 뒤집혔어요.' },
      { label: '친척네 시골 마당', effect: { happy: 6, health: 2 }, text: '처음 맡는 소 냄새에 코가 바빴어요.' },
      { label: '집에서 푹 쉬기', effect: { bond: 5, health: 2 }, text: '온 가족이 잠옷 차림으로 일주일을 보냈어요.' },
    ], (d) => d.family.id !== 'farm'),
    C('donor', 5.3, '동물병원에서 헌혈견을 찾는대요.', [
      { label: '헌혈에 참여하기', effect: { bond: 3, happy: -1 }, text: '다른 강아지를 살리는 영웅이 됐어요. 간식 선물도 받았어요.' },
      { label: '대신 보호소 봉사 가기', effect: { happy: 2, bond: 2 }, text: '보호소 친구들 사이에서 꼬리 인사를 하고 왔어요.' },
    ], (d) => d.breed.size !== 'small'),
    C('festival', 4.9, '동네 반려견 축제가 열려요.', [
      { label: '코 탐정 대회 나가기', effect: { happy: 5, health: 2 }, text: '숨겨진 간식을 1등으로 찾아 메달을 받았어요.' },
      { label: '강아지 패션쇼 나가기', effect: { happy: 5, bond: 2 }, text: '리본 달고 런웨이를 걷다가 중간에 드러누웠어요.' },
      { label: '구경만 하기', effect: { bond: 3 }, text: '솜사탕 냄새 맡으며 가족 품에서 구경했어요.' },
    ]),
    C('hens', 4.7, '마당에 닭을 키우기 시작했어요.', [
      { label: '닭장 지키는 법 가르치기', effect: { bond: 4, health: 2 }, text: '아침마다 닭장을 한 바퀴 도는 경비원이 됐어요.' },
      { label: '닭이랑 친구 하게 두기', effect: { happy: 5 }, text: '암탉 등에 올라타려다 콕 쪼였어요.' },
    ], (d) => d.family.id === 'farm'),
    C('drawer', 5.1, '간식 서랍을 혼자 여는 법을 터득했어요.', [
      { label: '서랍에 잠금장치 달기', effect: { health: 4, happy: -2 }, text: '잠금장치 앞에서 한참 앉아 있다가 포기했어요.' },
      { label: '하루 한 번은 모른 척하기', effect: { happy: 6, health: -2 }, text: '서랍 앞에서 눈이 마주치면 둘 다 모른 척했어요.' },
    ], (d) => d.personality.id === 'foodie' || d.personality.id === 'rascal'),
  ],
  [
    C('checkup', 7.5, '이제 노견이 될 나이예요. 정기 건강검진을 받을까요?', [
      { label: '해마다 검진할게요', effect: { health: 6, life: 1, happy: -2 }, text: '작은 이상을 일찍 찾아 바로 관리했어요.' },
      { label: '아플 때만 갈게요', effect: { happy: 2 }, text: '병원 냄새는 여전히 싫은가 봐요.' },
    ]),
    C('teeth', 8, '이가 조금 흔들린대요. 어떻게 할까요?', [
      { label: '치과 치료 받기', effect: { health: 6, life: 0.5, happy: -3 }, text: '말랑한 간식으로 바꾸고 다시 잘 먹어요.' },
      { label: '부드러운 사료로 바꾸기', effect: { happy: 3, health: 1 }, text: '불린 사료도 맛있게 먹어요.' },
    ]),
    C('swim', 7, '관절에 좋다는 강아지 수영장이 생겼어요.', [
      { label: '주말마다 수영', effect: { health: 7, life: 0.6, happy: 3 }, text: '물속에서는 다시 어린 강아지 같아요.' },
      { label: '물은 무서워해서 패스', effect: { happy: 1 }, text: '대신 마른 잔디에서 공놀이를 해요.' },
    ]),
    C('weight', 7.2, '요즘 살이 조금 빠졌대요.', [
      { label: '밥 양을 늘리기', effect: { health: 3, happy: 3 }, text: '밥그릇 앞에서 다시 신나 해요.' },
      { label: '검사 먼저 받아 보기', effect: { health: 5, life: 0.4, happy: -2 }, text: '별일 아니라서 모두 한숨 돌렸어요.' },
    ]),
    C('stairs', 8.5, '계단 오르내리기가 힘들어 보여요.', [
      { label: '집에 강아지 계단 놓기', effect: { health: 4, happy: 2 }, text: '소파에 혼자 올라갈 수 있게 됐어요.' },
      { label: '안아서 올려 주기', effect: { bond: 7 }, text: '안길 때마다 가족 어깨에 턱을 괴어요.' },
    ]),
    C('massage', 8, '관절 마사지를 배워 볼까요?', [
      { label: '매일 저녁 마사지', effect: { health: 4, bond: 6 }, text: '마사지 시간만 되면 먼저 와서 누워요.' },
      { label: '따뜻한 찜질 매트', effect: { health: 4, happy: 3 }, text: '찜질 매트 위가 최애 자리가 됐어요.' },
    ]),
    C('market2', 7.4, '빵집 손님들이 노견이 된 나를 보러 와요.', [
      { label: '가게 앞 방석에서 인사하기', effect: { happy: 5, bond: 2 }, text: '단골손님들이 "오늘도 출근했네" 하며 쓰다듬어 줘요.' },
      { label: '조용한 집에서 쉬기', effect: { health: 3 }, text: '사장님이 쉬는 시간마다 올라와서 안아 줘요.' },
    ], (d) => d.family.id === 'shop'),
    C('ondol', 7.6, '추운 겨울이 왔어요. 어디서 지낼까요?', [
      { label: '뜨끈한 아랫목', effect: { health: 4, happy: 3 }, text: '아랫목에 배를 붙이고 노곤노곤 졸았어요.' },
      { label: '햇볕 드는 툇마루', effect: { happy: 4, bond: 2 }, text: '툇마루 볕 아래에서 할머니 무릎을 베고 누웠어요.' },
    ], (d) => placeIs(d, 'hanok', 'farm')),
    C('stairs2', 7.9, '3층 계단이 버거워 보여요.', [
      { label: '매일 안고 오르내리기', effect: { bond: 7 }, text: '계단참마다 쉬면서 같이 숨을 골라요.' },
      { label: '1층 집으로 이사하기', effect: { health: 4, happy: 2 }, text: '현관문을 나서면 바로 풀밭이에요.' },
    ], (d) => homeIs(d, 'villa', 'rooftop')),
    C('hearing', 7.8, '부르는 소리에 반응이 느려졌어요.', [
      { label: '손짓 신호 새로 가르치기', effect: { bond: 6 }, text: '손을 흔들면 귀 대신 눈으로 알아들어요.' },
      { label: '진동 목걸이 써 보기', effect: { health: 2, happy: 2 }, text: '목걸이가 부르르 떨리면 가족을 찾아 고개를 돌려요.' },
    ]),
    C('seniorfood', 7.3, '노견 사료로 바꿀 때가 됐대요.', [
      { label: '수제 노견식 끓여 주기', effect: { health: 5, happy: 4, life: 0.3 }, text: '닭죽 끓이는 냄새에 부엌을 떠나지 않아요.' },
      { label: '노견 사료로 천천히 바꾸기', effect: { health: 4, life: 0.4 }, text: '일주일에 걸쳐 조금씩 섞어 주니 금세 적응했어요.' },
      { label: '좋아하던 사료 그대로', effect: { happy: 4 }, text: '변함없는 그 맛이 제일 좋대요.' },
    ]),
    C('puppyguest', 7.6, '친척이 아기 강아지를 데리고 놀러 왔어요.', [
      { label: '어른답게 놀아 주기', effect: { happy: 5, bond: 2 }, text: '아기 강아지에게 공 물어 오는 법을 가르쳐 줬어요.' },
      { label: '조용한 방에서 쉬게 하기', effect: { health: 2, happy: 1 }, text: '방석 위에서 멀리서만 지켜봤어요. 선배의 여유예요.' },
    ]),
    C('route', 8.2, '예전 산책 코스가 조금 버거워 보여요.', [
      { label: '코스를 반으로 줄이기', effect: { health: 3 }, text: '짧아진 대신 냄새 맡는 시간은 두 배가 됐어요.' },
      { label: '쉬어 갈 벤치 정해 두기', effect: { happy: 3, bond: 4 }, text: '벤치마다 앉아서 동네 강아지들 안부를 물어요.' },
      { label: '그대로, 아주 천천히', effect: { health: 1, happy: 3 }, text: '시간이 두 배 걸려도 끝까지 걸었어요.' },
    ]),
    C('insurance', 7, '아플 때를 대비해 둘까요?', [
      { label: '펫보험 들어 두기', effect: { health: 3, life: 0.3 }, text: '든든한 마음에 병원 가는 발걸음이 가벼워졌어요.' },
      { label: '병원비 적금 따로 모으기', effect: { bond: 3 }, text: '저금통에 내 이름표가 붙었어요.' },
    ]),
  ],
  [
    C('stroller', 11, '다리에 힘이 조금 빠졌어요. 산책은 어떻게 할까요?', [
      { label: '강아지 유모차 사기', effect: { happy: 8, bond: 5 }, text: '유모차를 타고 좋아하던 공원에 다시 갔어요.' },
      { label: '집 앞만 천천히 걷기', effect: { health: 3, happy: 2, walk: -0.4 }, text: '느려도 매일 같은 길을 함께 걸어요.' },
    ]),
    C('bucket', 10.5, '버킷리스트를 하나 이뤄 줄까요?', [
      { label: '처음 가 보는 숲 여행', effect: { happy: 9, bond: 4 }, text: '이름 모를 꽃 냄새를 한참 맡았어요.' },
      { label: '좋아하는 간식으로 생일상', effect: { happy: 7, bond: 6 }, text: '평생 먹은 간식 중 제일 큰 케이크였어요.' },
    ]),
    C('night', 11.5, '밤에 자주 깨서 서성여요.', [
      { label: '가족이 옆에서 같이 자기', effect: { bond: 9, happy: 3 }, text: '손을 얹어 주면 금방 다시 잠들어요.' },
      { label: '은은한 수면등 켜 두기', effect: { health: 2, happy: 2 }, text: '조용한 불빛 아래서 편안히 자요.' },
    ]),
    C('anniversary', 12, '함께한 지 12년 되는 날이에요. 어떻게 보낼까요?', [
      { label: '처음 만났던 곳에 가 보기', effect: { bond: 8, happy: 4 }, text: '처음 만난 그 자리에서 한참 냄새를 맡았어요.' },
      { label: '집에서 조촐한 파티', effect: { happy: 6, bond: 5 }, text: '고깔모자를 쓰고 가족 노래를 들었어요.' },
    ]),
    C('portrait', 10.8, '지금 모습을 오래 남겨 둘까요?', [
      { label: '그림 작가에게 초상화 맡기기', effect: { bond: 5 }, text: '액자 속 내가 거실 한가운데 걸렸어요.' },
      { label: '발도장 찍어 액자 만들기', effect: { bond: 6, happy: 2 }, text: '발바닥 도장이 가족 방에 걸렸어요.' },
    ]),
    C('portrait2', 10.7, '집사가 나를 그린 그림으로 전시를 열고 싶대요.', [
      { label: '전시회에 같이 가기', effect: { happy: 6, bond: 4 }, text: '그림 속 나와 진짜 나를 번갈아 보며 다들 웃었어요.' },
      { label: '집 거실에만 걸어 두기', effect: { bond: 5 }, text: '거실 벽이 온통 내 그림으로 가득해요.' },
    ], (d) => d.family.id === 'artist'),
    C('housewarming', 11, '셰어하우스 친구 한 명이 이사를 간대요.', [
      { label: '새 집에 놀러 가기', effect: { happy: 5, bond: 3 }, text: '새 집 냄새를 다 맡고 나서야 소파에 누웠어요.' },
      { label: '송별회 하기', effect: { bond: 5 }, text: '친구 무릎에서 마지막 저녁을 같이 먹었어요.' },
    ], (d) => d.family.id === 'share'),
    C('seaagain', 10.9, '어릴 때 갔던 바다에 다시 가 볼까요?', [
      { label: '그 바다에 다시 가기', effect: { happy: 7, bond: 5 }, text: '파도 소리를 들으며 모래 위에 한참 누워 있었어요.' },
      { label: '가까운 호숫가로', effect: { happy: 4, health: 1 }, text: '잔잔한 물결을 보며 꾸벅꾸벅 졸았어요.' },
    ]),
    C('diary', 11.2, '하루하루를 남겨 둘까요?', [
      { label: '매일 한 줄 일기 쓰기', effect: { bond: 6 }, text: '"오늘은 밥을 다 먹었다" 한 줄이 가족의 기쁨이 됐어요.' },
      { label: '매일 영상 1초씩 찍기', effect: { bond: 5, happy: 1 }, text: '1초씩 모인 영상이 벌써 몇 분이 됐어요.' },
      { label: '그냥 지금에 집중하기', effect: { happy: 4, bond: 3 }, text: '카메라 대신 손으로 더 많이 쓰다듬었어요.' },
    ]),
    C('oldpal', 11, '오랜 산책 친구네가 놀러 온대요.', [
      { label: '집으로 초대하기', effect: { happy: 6 }, text: '둘이 나란히 엎드려 옛날 얘기를 하는 것 같았어요.' },
      { label: '공원에서 잠깐만', effect: { happy: 4, health: 1 }, text: '짧게 만났지만 꼬리는 오래 흔들었어요.' },
    ]),
    C('appetite', 11.8, '요즘 밥을 잘 안 먹어요.', [
      { label: '손으로 한 알씩 먹여 주기', effect: { bond: 8, health: 2 }, text: '가족 손바닥 위의 밥은 다 먹었어요.' },
      { label: '좋아하는 간식을 토핑으로', effect: { happy: 5, health: 2 }, text: '고구마 토핑을 올리자 그릇을 싹 비웠어요.' },
      { label: '병원에서 상담 받기', effect: { health: 5, life: 0.3, happy: -2 }, text: '입맛 돋우는 약을 받고 다시 기운을 차렸어요.' },
    ]),
    C('holidaygather', 10.6, '온 가족이 모이는 명절이에요.', [
      { label: '한가운데 자리 내주기', effect: { happy: 6, bond: 3 }, text: '손주들 사이에서 쓰다듬어 달라고 배를 내밀었어요.' },
      { label: '조용한 방에서 쉬게 하기', effect: { health: 3 }, text: '문틈으로 모두의 목소리를 들으며 편히 잤어요.' },
    ], (d) => d.family.id === 'grand' || d.family.id === 'farm' || d.family.id === 'kids'),
  ],
];
// 선택이 남기는 흔적. 같은 생의 뒤쪽 사건이 이 흔적을 보고 이어집니다.
const CHOICE_FLAGS: Record<string, string[]> = {
  school: ['kinder', ''], crate: ['bedbuddy', ''], socialize: ['brave', ''], name: ['', 'nickname'],
  weekend: ['hiker', 'couch'], trip: ['traveler', ''], sport: ['athlete', ''], cafe: ['social', ''], hobby: ['runner', 'camper'], photo: ['sns', 'album'],
  diet: ['fit', 'chubby'], sibling: ['sibling', ''], move: ['park', 'homebody'], alone: ['', 'morning'], toy: ['', 'nose'],
  checkup: ['checked', ''], swim: ['swimmer', ''], teeth: ['', ''], massage: ['massage', ''], weight: ['', ''], stairs: ['', 'carried'],
  stroller: ['stroller', ''], bucket: ['forest', 'party'], night: ['', ''], anniversary: ['', ''], portrait: ['portrait', 'paw'],
  bath: ['', ''], bite: ['', '', ''], collar: ['', '', ''], yard: ['', ''], duty: ['', ''], guest: ['', ''],
  snow: ['', ''], clothes: ['', '', ''], trick: ['', '', ''], rain: ['', '', 'swimmer'], exam: ['', ''], market: ['', ''], rival: ['', ''],
  remote: ['', ''], holiday: ['traveler', '', ''], donor: ['donor', ''], festival: ['', '', ''], hens: ['', ''], drawer: ['fit', 'chubby'],
  hearing: ['', ''], seniorfood: ['', '', ''], puppyguest: ['', ''], route: ['', '', ''], insurance: ['checked', ''],
  bakery: ['shopdog', ''], room: ['', ''], canvas: ['painter', ''], beach: ['', ''], elevator: ['', ''], garden: ['', ''], fishing: ['boat', ''], momday: ['', ''],
  market2: ['', ''], ondol: ['', ''], stairs2: ['', ''], portrait2: ['', ''], housewarming: ['', ''],
  seaagain: ['', ''], diary: ['', '', ''], oldpal: ['', ''], appetite: ['', '', ''], holidaygather: ['', ''],
};
/** 가족의 선택을 반영합니다: 효과 + 흔적 + (동생 입양이면) 동생 강아지 */
export function choose(d: Dog, c: Choice, k: number) {
  const o = c.options[k];
  applyEffect(d, o.effect);
  d.joy.base += ((o.effect.happy ?? 0) + (o.effect.bond ?? 0) * 0.5) * 0.6;
  const flag = CHOICE_FLAGS[c.id]?.[k];
  if (flag && !d.flags.includes(flag)) d.flags.push(flag);
  if (flag === 'sibling') adoptSibling(d, c.age);
  if (c.id === 'move') d.home = HOMES[k === 0 ? 'parkapt' : 'nearwork'];
}

/** 강아지 동생을 들여요: 장면에 동생이 함께 나오고, 동생과 이어지는 사건이 열립니다. */
export function adoptSibling(d: Dog, age: number) {
  if (d.sibling) return;
  d.sibling = pickBreed();
  d.siblingAt = age;
  d.friends++;
  if (!d.flags.includes('sibling')) d.flags.push('sibling');
}

/** 선택 후보 전체 (테스트·참고용) */
export const CHOICES: Choice[] = CHOICE_BANDS.flat();

function pickChoices(d: Dog): Choice[] {
  return CHOICE_BANDS.map((band) => {
    const ok = band.filter((c) => !c.when || c.when(d));
    const c = pick(ok);
    // 같은 나이대 안에서 시기를 조금씩 흔들어요
    return { id: c.id, age: Math.max(0.4, c.age + (Math.random() - 0.5) * 0.8), q: c.q, options: c.options };
  });
}

// 같은 사건도 문장을 여러 가지로
// ── 문장을 그 강아지의 가족·장소·계절로 채우기 ──
const hasBatchim = (w: string) => { const c = w.charCodeAt(w.length - 1) - 0xac00; return c >= 0 && c <= 11171 && c % 28 !== 0; };
const ga = (w: string) => w + (hasBatchim(w) ? '이' : '가');
const wa = (w: string) => w + (hasBatchim(w) ? '과' : '와');
const MEMBERS: Record<string, string[]> = {
  single: ['집사'], student: ['집사'], couple: ['엄마', '아빠'], kids: ['엄마', '아빠', '큰아이', '막내'],
  grand: ['할머니', '할아버지'], farm: ['엄마', '아빠', '할머니'],
  shop: ['사장님', '사모님'], mom: ['엄마', '딸'], share: ['첫째 언니', '둘째 형', '막내 언니'], artist: ['집사'],
};
const EXTRA_NAME = { adult: '새 가족', child: '손주', baby: '아기' } as const;
export function whoOf(d: Dog) {
  const list = [...(MEMBERS[d.family.id] ?? ['가족']), ...d.household.extra.filter((k) => k !== 'baby').map((k) => EXTRA_NAME[k])];
  return pick(list);
}
const PLACES: Record<string, string[]> = {
  city: ['한강 공원', '동네 놀이터', '아파트 산책로', '카페 거리', '강아지 운동장', '호수 공원', '뒷산 둘레길'],
  house: ['동네 골목', '뒷산 오솔길', '시장 길', '동네 공원', '개천 산책로'],
  farm: ['마당', '개울가', '논두렁', '과수원', '뒷산', '마을 정자'],
};
const spotOf = (d: Dog) => pick(Math.random() < 0.7 ? d.home.spots : PLACES[d.home.place === 'farm' ? 'farm' : d.home.place === 'city' ? 'city' : 'house']);
const SEASON_WORD = [['봄바람 부는', '벚꽃 날리는', '꽃 피는'], ['한여름', '매미 우는', '소나기 그친'], ['단풍 든', '선선한', '낙엽 쌓인'], ['눈 쌓인', '찬바람 부는', '하얀 입김 나는']];
const seasonOf = (age: number) => Math.floor((age % 1) * 4) % 4;
/** {이름} {이름이} {누구} {누구가} {누구와} {장소} {계절} 를 채워 넣어요 */
const fill = (t: string, d: Dog, age: number) => {
  const who = whoOf(d);
  return t
    .replaceAll('{이름이}', nameGa(d.name)).replaceAll('{이름}', d.name)
    .replaceAll('{누구가}', ga(who)).replaceAll('{누구와}', wa(who)).replaceAll('{누구를}', who + (hasBatchim(who) ? '을' : '를')).replaceAll('{누구}', who)
    .replaceAll('{장소}', spotOf(d)).replaceAll('{계절}', pick(SEASON_WORD[seasonOf(age)]));
};
const V = (...lines: string[]) => (d: Dog, age = 0) => fill(pick(lines), d, age);

// ── 그날그날의 작은 순간: 조각을 섞어 매번 다른 문장을 만들어요 ──
const OUTINGS: [string, string][] = [
  ['🎾', '공놀이를 했어요'], ['🥏', '원반던지기를 했어요'], ['🏃', '신나게 달리기 시합을 했어요'], ['🌼', '꽃 냄새를 하나하나 맡았어요'],
  ['🐾', '처음 보는 친구와 인사했어요'], ['🍦', '{누구가} 아이스크림 먹는 걸 구경했어요'], ['📸', '{누구가} 사진을 백 장 찍었어요'],
  ['🧺', '돗자리 위에서 낮잠을 잤어요'], ['💧', '물웅덩이를 다 밟고 다녔어요'], ['🪁', '연 날리는 아이들을 따라 뛰었어요'],
  ['🦆', '오리 가족을 한참 구경했어요'], ['🚲', '자전거 타는 {누구} 옆에서 같이 달렸어요'], ['🪵', '마음에 드는 나뭇가지를 주워 왔어요'],
  ['🐈', '담벼락 위 고양이와 눈싸움을 했어요'], ['🌳', '나무 밑 그늘에서 쉬었어요'], ['🐦', '참새 떼를 쫓다가 다 놓쳤어요'],
  ['🎈', '풍선 든 아이를 따라가다 붙잡혔어요'], ['🧃', '벤치에서 나눠 준 물을 꿀꺽꿀꺽 마셨어요'],
  ['🪨', '돌멩이 하나를 보물처럼 물고 다녔어요'], ['🎶', '버스킹 노래 앞에서 꼬리를 박자에 맞춰 흔들었어요'], ['🌾', '풀숲에 코를 박고 냄새 탐정 놀이를 했어요'],
  ['🥾', '평소보다 두 배 긴 산책을 했어요'], ['🍞', '빵집 앞에서 발이 떨어지지 않았어요'], ['🐶', '단골 산책 친구 강아지를 만나 엉덩이 냄새 인사를 했어요'],
];
const REACTIONS: Record<string, string[]> = {
  sweet: ['돌아오는 길 내내 {누구} 다리에 몸을 비볐어요.', '모르는 사람에게도 배를 보여 줬어요.', '집에 와서 {누구} 얼굴을 한참 핥았어요.', '지나가는 아이에게 꼬리 인사를 했어요.'],
  shy: ['오토바이 소리에 놀라 {누구} 품에 안겨 왔어요.', '처음엔 쭈뼛거렸지만 금방 꼬리를 흔들었어요.', '큰 개를 보고 {누구} 다리 뒤에 숨었어요.', '돌아오는 길엔 조금 더 용감해졌어요.'],
  foodie: ['집에 오자마자 밥그릇 앞에 앉아 기다렸어요.', '산책보다 간식 주머니에 더 관심이 많았어요.', '떨어진 과자 부스러기를 귀신같이 찾아냈어요.', '돌아와서 물을 한 그릇 다 비웠어요.'],
  rascal: ['목줄을 물고 {누구를} 끌고 다녔어요.', '흙투성이가 돼서 결국 목욕행.', '돌아오는 길에 일부러 웅덩이로 뛰어들었어요.', '{누구} 신발 끈을 풀어 놓고 시치미를 뗐어요.'],
  calm: ['{누구} 옆에서 의젓하게 발맞춰 걸었어요.', '벤치에 앉은 {누구} 발밑에 조용히 엎드렸어요.', '지나가던 어르신이 점잖다고 칭찬해 줬어요.', '집에 와서 제자리에 가서 조용히 누웠어요.'],
  curious: ['가는 길마다 냄새 맡느라 한 시간이 걸렸어요.', '처음 보는 골목으로 자꾸 고개를 돌렸어요.', '맨홀 뚜껑 냄새까지 꼼꼼히 확인했어요.', '집에 와서도 창밖을 한참 내다봤어요.'],
  sleepy: ['집에 오자마자 곯아떨어졌어요.', '돌아오는 길에 안아 달라고 주저앉았어요.', '그날 밤 꿈속에서도 다리를 버둥거렸어요.', '{누구} 무릎 위에서 꾸벅꾸벅 졸았어요.'],
};
const HOME_MOMENTS: [string, string][] = [
  ['👜', '퇴근한 {누구}의 가방 냄새를 꼼꼼히 검사했어요.'], ['📦', '택배 상자가 오자 {누구}보다 먼저 뜯으러 달려갔어요.'],
  ['🎵', '{누구가} 노래를 부르자 같이 하울링했어요.'], ['🍳', '{누구가} 요리하는 동안 부엌 바닥을 지켰어요.'],
  ['🧹', '청소기를 돌리는 {누구를} 따라다니며 짖었어요.'], ['🛏️', '{누구} 베개를 몰래 차지하고 잤어요.'],
  ['📖', '책 읽는 {누구} 무릎에 턱을 괴고 있었어요.'], ['🧦', '{누구} 양말 한 짝을 소파 밑에 숨겼어요.'],
  ['🌙', '잠든 {누구} 옆에서 같이 코를 골았어요.'], ['🎮', '게임하는 {누구} 옆에서 화면 속 공을 쫓았어요.'],
  ['☕', '{누구}의 주말 아침 커피 시간에 꼭 옆자리를 지켰어요.'], ['🧸', '{누구가} 사 온 새 인형을 하루 만에 해체했어요.'],
  ['📞', '{누구가} 영상통화를 하자 화면에 얼굴을 들이밀었어요.'], ['🪴', '{누구가} 아끼는 화분 흙을 살짝 파 봤어요.'],
  ['🧺', '빨래 개는 {누구} 옆에서 수건 더미에 파묻혔어요.'], ['🛁', '{누구가} 목욕하는 동안 욕실 문 앞을 지켰어요.'],
  ['🎂', '{누구} 생일 케이크 앞에서 제일 먼저 자리를 잡았어요.'], ['💻', '{누구} 노트북 키보드 위에 앉아 ㅋㅋㅋㅋㅋ를 입력했어요.'],
  ['📺', '{누구와} 같이 드라마를 보다가 같이 잠들었어요.'], ['🧊', '{누구가} 준 얼음 한 조각을 와그작와그작 씹었어요.'],
  ['🪟', '창가에 앉아 {누구가} 돌아올 골목만 바라봤어요.'], ['🎁', '선물 포장지를 뜯는 소리에 귀가 쫑긋했어요.'],
  ['🧤', '{누구} 장갑 한 짝을 물고 온 집을 자랑하며 돌아다녔어요.'], ['🎧', '{누구} 이어폰 줄을 장난감인 줄 알고 물었어요.'],
  ['🍙', '{누구가} 김밥 싸는 걸 보며 꼬리를 쉬지 않고 흔들었어요.'], ['🕯️', '정전된 밤, {누구} 품에서 촛불을 같이 바라봤어요.'],
];
// 계절마다 그때만 할 수 있는 나들이
const SEASON_OUT: [string, string][][] = [
  [['🌸', '{누구와} 꽃놀이를 가서 벚꽃 아래 사진을 찍었어요.'], ['🍓', '딸기 농장 체험에 따라가서 꼭지만 얻어먹었어요.'], ['🌱', '{누구가} 화단에 씨앗 심는 걸 옆에서 거들었어요.']],
  [['🏞️', '{누구와} 계곡에 가서 발만 살짝 담갔어요.'], ['🛟', '물놀이 튜브 위에 올라타 둥둥 떠 있었어요.'], ['🍉', '평상에 누워 {누구와} 수박 먹는 저녁을 보냈어요.']],
  [['🌾', '억새 밭 사이를 {누구와} 걸었어요. 키보다 큰 억새에 신났어요.'], ['🌰', '밤 줍는 {누구} 옆에서 밤송이에 코를 찔렸어요.'], ['🍁', '단풍길 산책에 {누구가} 단풍잎 왕관을 씌워 줬어요.']],
  [['🛷', '{누구가} 끄는 썰매를 타고 눈밭을 달렸어요.'], ['⛄', '{누구와} 만든 눈사람 옆에서 기념사진을 찍었어요.'], ['🍊', '난로 앞에서 {누구와} 귤 까먹는 밤을 보냈어요.']],
];
// 나이대마다 다른 일상
const STAGE_MOMENTS: [string, string][][] = [
  [['🦷', '이갈이 중이라 {누구} 손가락을 살짝 깨물었어요.'], ['🍼', '처음 먹는 간식에 눈이 동그래졌어요.'], ['🌀', '자기 꼬리를 잡으려고 빙글빙글 돌았어요.'], ['😪', '놀다가 갑자기 그 자리에서 잠들었어요.'],
   ['👟', '{누구} 운동화 끈을 처음으로 끝까지 풀어냈어요.'], ['🔔', '초인종 소리에 처음으로 멍! 하고 짖었어요. 본인도 놀랐어요.'], ['🪜', '처음으로 계단 한 칸을 혼자 올라갔어요.']],
  [['💪', '소파 위로 한 번에 점프해 올라갔어요.'], ['🏆', '공을 물고 오는 속도가 동네에서 제일 빨라요.'], ['🎒', '{누구} 가방을 보면 산책인 줄 알고 현관에 먼저 가 있어요.'],
   ['🔑', '열쇠 소리만 들려도 {누구가} 오는 걸 알아요.'], ['🗣️', '산책이라는 단어를 알아들어서 {누구가} 철자로 말하기 시작했어요.'], ['🧠', '간식 숨긴 손을 맞히는 게임에서 열 번 연속 성공했어요.'],
   ['🚪', '{누구가} 외출 준비를 하면 현관 앞에 드러누워 시위했어요.'], ['🎯', '새 묘기 "빵!"을 배웠어요. 쓰러지는 연기가 일품이에요.'], ['🐕', '동네 강아지들 사이에서 대장 노릇을 했어요.'],
   ['🌧️', '비 오는 날엔 {누구와} 창밖 빗소리를 들으며 뒹굴었어요.'], ['🍖', '생일도 아닌데 {누구가} 특별식을 만들어 줬어요.']],
  [['🐢', '{누구가} 내 걸음에 맞춰 천천히 걸어 줬어요.'], ['🛋️', '햇볕 드는 쿠션 위에서 하루를 보냈어요.'], ['👃', '눈은 흐려도 {누구} 냄새는 멀리서도 알아챘어요.'], ['🫶', '{누구가} 쓰다듬어 줄 때마다 눈을 지그시 감았어요.'],
   ['🧶', '{누구가} 뜨개질하는 옆에서 털실 공을 굴려 봤어요.'], ['🎼', '{누구가} 틀어 준 잔잔한 음악을 들으며 낮잠을 잤어요.'], ['🍲', '밥을 남기던 날, {누구가} 손으로 한 알씩 먹여 줬어요.'],
   ['🌤️', '오랜만에 컨디션이 좋아서 {장소}까지 걸어갔어요.'], ['💤', '꿈을 꾸는지 자다가 꼬리를 살랑살랑 흔들었어요.'], ['🧣', '{누구가} 둘러 준 담요를 덮고 창가에 앉아 있었어요.'],
   ['👴', '주둥이 털이 하얗게 셌어요. {누구가} "멋있게 늙었네" 했어요.'], ['🦶', '자다가 일어날 때 {누구가} 엉덩이를 살짝 받쳐 줬어요.'],
   ['🪟', '하루 대부분을 창가에서 바깥 구경을 하며 보냈어요.'], ['🫖', '{누구가} 차 마시는 시간이면 꼭 옆에 와서 엎드려요.'],
   ['🧸', '새 인형 대신 낡은 인형을 끝까지 품고 자요.'], ['🍯', '{누구가} 영양제를 꿀에 섞어 줬더니 핥아 먹었어요.'],
   ['🕰️', '밥 시간은 시계처럼 정확하게 기억해요. 일 분만 늦어도 쳐다봐요.'], ['🎞️', '{누구가} 어릴 적 영상을 틀어 주자 화면 속 나를 보고 고개를 갸웃했어요.'],
   ['🤲', '{누구} 손바닥에 턱을 올려놓고 잠드는 게 습관이 됐어요.'], ['🐕', '꼬리 흔드는 속도는 느려졌지만 횟수는 그대로예요.'],
   ['🛋️', '소파 위로 못 올라가서 {누구가} 바닥에 내려와 같이 누웠어요.'], ['💌', '{누구가} 내 사진을 보며 편지를 쓰는 걸 옆에서 지켜봤어요.']],
];

// 노견의 나들이 (천천히, 짧게)
const SENIOR_OUT: [string, string][] = [
  ['🪑', '벤치에 앉은 {누구} 발밑에서 지나가는 사람들을 구경했어요'], ['🌿', '{누구와} 풀 냄새를 하나하나 오래오래 맡았어요'],
  ['🐌', '{누구와} 평소 반만 걸었지만 꼬리는 두 배로 흔들었어요'], ['☀️', '{누구와} 양지바른 자리에 앉아 햇볕을 쬐었어요'],
  ['🛒', '{누구가} 밀어 주는 유모차를 타고 예전에 뛰던 길을 지나갔어요'], ['🍃', '바람에 날리는 나뭇잎을 눈으로만 쫓았어요'],
  ['🐶', '산책 친구 강아지와 코 인사만 하고 나란히 앉아 있었어요'], ['💧', '{누구가} 챙겨 온 물을 천천히 마셨어요'],
  ['🪵', '늘 쉬던 나무 그루터기에 턱을 괴고 쉬었어요'], ['🐦', '참새 소리에 귀만 쫑긋 세웠어요'],
  ['🌷', '처음 보는 꽃 앞에서 한참 멈춰 섰어요. {누구가} 옆에서 같이 기다려 줬어요'], ['🧺', '돗자리 위에서 {누구와} 나란히 누워 하늘을 봤어요'],
];
const SENIOR_REACT = [
  '돌아와서 {누구} 무릎에 머리를 얹고 잠들었어요.', '집에 오는 길엔 {누구가} 안아 줬어요.', '느려도 끝까지 자기 발로 걸었어요.',
  '{누구가} "오늘 잘 걸었네" 하고 칭찬해 줬어요.', '집에 와서 물을 한참 마시고 곯아떨어졌어요.', '오는 길에 몇 번이나 뒤돌아 {누구를} 확인했어요.',
];
// 노견의 계절
const SENIOR_SEASON: [string, string][][] = [
  [['🌸', '{누구가} 벚꽃 잎 하나를 내 머리에 얹어 줬어요.'], ['🌤️', '봄볕이 좋아 창문을 열어 두고 낮잠을 잤어요.'], ['🌱', '새싹 냄새를 맡으며 마당을 천천히 한 바퀴 돌았어요.'], ['🦋', '나비가 코끝에 앉았다 갔어요. 쫓지는 않고 눈으로만 배웅했어요.']],
  [['🍉', '{누구가} 시원한 수박 한 조각을 잘게 잘라 줬어요.'], ['🌬️', '선풍기 바람 앞에 자리를 잡고 귀를 펄럭였어요.'], ['🧊', '쿨매트 위에서 대자로 뻗어 여름 오후를 보냈어요.'], ['🌧️', '소나기 소리를 들으며 {누구} 옆에서 꾸벅꾸벅 졸았어요.']],
  [['🍁', '바스락거리는 낙엽 길을 {누구와} 아주 천천히 걸었어요.'], ['🍠', '군고구마 냄새에 아픈 다리도 잊고 부엌으로 갔어요.'], ['🌕', '추석 보름달 아래서 가족 사진을 찍었어요.'], ['🧥', '{누구가} 사 준 얇은 니트를 입고 가을 산책을 나갔어요.']],
  [['🧣', '목도리를 두르고 눈 내리는 창밖을 구경했어요.'], ['🔥', '난로 앞 제일 따뜻한 자리는 이제 내 차지예요.'], ['❄️', '첫눈을 코끝으로만 살짝 맛봤어요.'], ['🛏️', '{누구} 이불 속에 쏙 들어가 겨울밤을 보냈어요.']],
];
const reaction = (d: Dog) => pick(REACTIONS[d.personality.id] ?? ['']);
function dailyEvent(d: Dog, age: number): LifeEvent {
  const month = Math.floor((age % 1) * 12);
  const stage = age < 1.5 ? 0 : age < d.lifespan * 0.65 ? 1 : 2;
  const r = Math.random();
  if (stage === 2) {
    // 노견: 천천히 나들이 30% · 계절 20% · 노견 일상 30% · 집 20%
    if (r < 0.3) {
      const [icon, act] = pick(SENIOR_OUT);
      return { age, month, icon, text: fill(`{계절} {장소} 나들이. ${act}. ${pick(SENIOR_REACT)}`, d, age), effect: { happy: 3 } };
    }
    if (r < 0.5) {
      const [icon, t] = pick(SENIOR_SEASON[seasonOf(age)]);
      return { age, month, icon, text: fill(t, d, age), effect: { happy: 2, bond: 1 } };
    }
    if (r < 0.8) {
      const [icon, t] = pick(STAGE_MOMENTS[2]);
      return { age, month, icon, text: fill(t, d, age), effect: { bond: 2 } };
    }
    const [icon, t] = pick(HOME_MOMENTS);
    return { age, month, icon, text: fill(t, d, age), effect: { bond: 2 } };
  }
  if (r < 0.35) {
    const [icon, act] = pick(OUTINGS);
    return { age, month, icon, text: fill(`{계절} {장소}에서 {누구와} ${act}. ${reaction(d)}`, d, age), effect: { happy: 2, health: 1 } };
  }
  if (r < 0.55) {
    const [icon, t] = pick(SEASON_OUT[seasonOf(age)]);
    return { age, month, icon, text: fill(t, d, age), effect: { happy: 3 } };
  }
  if (r < 0.75) {
    const [icon, t] = pick(STAGE_MOMENTS[stage]);
    return { age, month, icon, text: fill(t, d, age), effect: { bond: 2 } };
  }
  const [icon, t] = pick(HOME_MOMENTS);
  return { age, month, icon, text: fill(t, d, age), effect: { bond: 2 } };
}


type Pool = {
  min: number; max: number; icon: string; text: (d: Dog, age: number) => string; effect?: Partial<Stats>; friend?: boolean; memory?: boolean; key?: string;
  when?: (d: Dog) => boolean;
  need?: string; // 이 흔적(선택)이 있을 때만
  rare?: boolean;
  apply?: (d: Dog, age: number) => void;
  once?: string; // 같은 묶음 안에서는 한 번만 (가족 변화 등)
  late?: boolean; // 노견 시기(수명의 62% 이후)에만
}[];

const POOL: Pool = [
  { min: 0, max: 0.4, icon: '🏠', text: (d) => `${d.family.name}에 입양됐어요. 오늘부터 이름은 '${d.name}'!`, effect: { bond: 10 }, memory: true, key: 'adopt' },
  { min: 0.1, max: 0.5, icon: '💉', text: V('예방접종을 무사히 마쳤어요. 용감했어요!', '주사 맞고 {누구} 품에 얼굴을 파묻었어요.', '동물병원 선생님이 간식을 줘서 주사도 참았어요.'), effect: { health: 4 } },
  { min: 0.2, max: 0.9, icon: '🧻', text: V('배변 패드를 드디어 정확히 맞혔어요. 온 가족이 박수!', '산책 나가서 볼일 보는 법을 배웠어요. {누구가} 폭풍 칭찬!', '실수한 날 {누구가} 혼내지 않고 다시 가르쳐 줬어요.'), effect: { bond: 4 } },
  { min: 0.3, max: 1, icon: '🌸', text: () => '첫 산책! 세상이 이렇게 냄새로 가득한 줄 몰랐어요.', effect: { happy: 6 }, memory: true, key: 'firstwalk' },
  { min: 0.3, max: 1.5, icon: '🧦', text: () => '양말 한 짝이 사라졌어요. 범인은 꼬리를 흔들고 있어요.', effect: { happy: 3 }, when: (d) => d.personality.id === 'rascal' || Math.random() < 0.4 },
  { min: 1, max: 9, icon: '🐾', text: V('공원에서 단짝 친구를 사귀었어요.', '산책길에 매일 만나는 친구가 생겼어요. 서로 엉덩이 냄새로 인사해요.', '옆집 강아지랑 담장 너머로 친구가 됐어요.', '애견카페에서 처음 본 친구와 한참을 뛰어놀았어요.'), effect: { happy: 5 }, friend: true },
  { min: 1, max: 10, icon: '🎂', text: (d) => `생일 파티! 강아지 케이크에 ${d.name}의 이름이 적혀 있었어요.`, effect: { happy: 5, bond: 3 }, memory: true, key: 'birthday' },
  { min: 1, max: 12, icon: '🍗', text: V('식탁 위 닭가슴살을 몰래 먹다 딱 걸렸어요.', '{누구가} 떨어뜨린 치즈 한 조각을 0.1초 만에 먹어 치웠어요.', '{누구} 도시락 가방에 머리를 넣었다가 들켰어요.'), effect: { happy: 4, bond: -1 }, when: (d) => d.personality.id === 'foodie' || Math.random() < 0.4 },
  { min: 1, max: 9, icon: '✂️', text: V('미용실에서 돌아왔더니 다른 강아지 같대요. 본인도 당황.', '{누구가} 집에서 털을 잘라 줬어요. 한쪽이 짝짝이가 됐어요.', '미용 끝나고 리본을 달았더니 하루 종일 으쓱했어요.'), effect: { happy: -2 } },
  { min: 1, max: 9, icon: '🌊', text: V('처음으로 바다에 갔어요. 파도한테 짖었어요.', '{누구와} 바닷가 모래사장에 구덩이를 팠어요.', '바다에 발을 담갔다가 짠맛에 깜짝 놀랐어요.'), effect: { happy: 7 }, memory: true, key: 'sea' },
  { min: 1.5, max: 8, icon: '⛺', text: V('가족과 캠핑을 떠났어요. 텐트 안이 제일 좋았대요.', '{누구가} 피운 모닥불 앞에서 별을 보며 졸았어요.', '캠핑장에서 옆 텐트 강아지와 친구가 됐어요.'), effect: { happy: 6, bond: 5 }, memory: true, key: 'camping' },
  { min: 2, max: 10, icon: '🐱', text: V('집에 고양이 동생이 왔어요. 아직은 서로 눈치 보는 중.', '{누구가} 길에서 구조한 고양이가 가족이 됐어요. 첫날은 서로 하악질.', '고양이 동생이 내 방석을 빼앗았어요. 그래도 같이 쓰기로 했어요.'), effect: { happy: -2 }, friend: true },
  { min: 2, max: 11, icon: '📦', text: V('이사를 했어요. 새 집 구석구석 냄새 확인 완료.', '집 가구 배치가 바뀌었어요. 소파 자리가 바뀌어서 한참 헤맸어요.', '새 방석이 생겼는데 결국 {누구} 이불이 더 좋대요.'), effect: { happy: -1, bond: 2 } },
  { min: 2, max: 12, icon: '❄️', text: V('첫눈이 왔어요. 눈밭에서 미친 듯이 뛰어다녔어요.', '{누구와} 눈사람을 만들었어요. 코는 내가 먹어 버렸어요.', '눈 쌓인 {장소}에 내 발자국을 잔뜩 찍었어요.'), effect: { happy: 6 }, memory: true, key: 'snow' },
  { min: 1, max: 12, icon: '😴', text: V('햇볕 드는 창가에서 낮잠. 오늘도 평화로운 하루.', '빨래 바구니 속에서 잠든 채 발견됐어요.', '가족 발밑에서 코를 골며 낮잠을 잤어요.', '비 오는 날, 하루 종일 이불 속에서 뒹굴었어요.'), effect: { happy: 3 }, when: (d) => d.personality.id === 'sleepy' || Math.random() < 0.5 },
  { min: 3, max: 12, icon: '🩺', text: () => '슬개골이 살짝 약하대요. 미끄럼 방지 매트를 깔았어요.', effect: { health: -5 }, when: (d) => d.breed.size === 'small' },
  { min: 4, max: 10, icon: '🩺', text: () => '고관절 관리를 시작했어요. 수영 재활도 같이 해요.', effect: { health: -5 }, when: (d) => d.breed.size === 'large' },
  { min: 3, max: 12, icon: '🦷', text: V('스케일링을 받았어요. 입냄새가 사라졌대요.', '{누구가} 매일 밤 양치를 시켜 줘요. 처음엔 싫었는데 이제 치약 맛이 좋아요.', '덴탈껌을 씹다가 이빨 하나가 반짝반짝해졌어요.'), effect: { health: 3 } },
  { min: 4, max: 12, icon: '🏆', text: V('동네 강아지 운동회 달리기에서 1등!', '동네 운동회 공 물어오기 종목에서 우승했어요.', '운동회 장애물 경주에서 {누구가} 목이 쉬도록 응원했어요. 결과는 1등!'), effect: { happy: 6 }, memory: true, key: 'race', when: (d) => d.stats.health > 70 },
  { min: 6, max: 20, icon: '🤍', text: V('주둥이에 흰 털이 하나둘 생겼어요.', '{누구가} 내 눈썹에 난 흰 털을 보고 멋있게 늙었다고 했어요.', '거울 속 내 얼굴이 조금 하얘졌어요.'), effect: {} , when: () => Math.random() < 0.5 },
  { min: 8, max: 20, icon: '💊', text: V('관절 영양제를 먹기 시작했어요. 맛있는 츄르에 섞어서.', '{누구가} 영양제를 고기 사이에 숨겨 줬어요. 사실 다 알고 먹었어요.', '아침마다 영양제 먹는 시간이 간식 시간이 됐어요.'), effect: { health: 2 } , when: () => Math.random() < 0.5 },
  { min: 8, max: 20, icon: '🛋️', text: V('계단 대신 강아지 계단을 놓았어요. 소파는 포기 못 해요.', '{누구가} 침대 옆에 작은 계단을 놓아 줬어요.', '소파 높이를 낮췄어요. 덕분에 다시 혼자 올라가요.'), effect: { happy: 2 } , when: () => Math.random() < 0.5 },
  { min: 9, max: 20, icon: '👂', text: V('귀가 조금 어두워졌어요. 대신 손짓을 더 잘 봐요.', '{누구가} 손짓으로 앉아를 가르쳐 줬어요. 금방 배웠어요.', '초인종 소리는 못 들어도 {누구} 발소리 진동은 느껴요.'), effect: { bond: 3 } , when: () => Math.random() < 0.5 },
  { min: 9, max: 20, icon: '🌅', text: (d) => `오늘은 ${nameGa(d.name)} 좋아하던 길을 아주 천천히 걸었어요.`, effect: { bond: 5, happy: 3 , when: () => Math.random() < 0.5 }, memory: true, key: 'slowwalk' },
  { min: 1, max: 6, icon: '🎾', text: () => '공을 백 번 던져 줘도 백한 번째를 기다려요.', effect: { happy: 4 }, memory: true, key: 'ball', when: (d) => d.personality.id !== 'sleepy' },
  { min: 1, max: 10, icon: '🌧️', text: V('천둥 치는 밤, {누구} 품에 파고들어 겨우 잠들었어요.', '태풍이 오던 날, {누구가} 이불로 동굴을 만들어 줬어요.', '번개가 칠 때마다 {누구가} 귀를 막아 줬어요.'), effect: { bond: 5, happy: -1 }, memory: true, key: 'thunder', when: (d) => d.personality.id === 'shy' || Math.random() < 0.3 },
  { min: 1, max: 10, icon: '🍉', text: V('여름날 수박 한 조각을 얻어먹고 세상을 다 가진 표정이었어요.', '{누구가} 깎아 준 사과를 아삭아삭 먹었어요.', '{계절} 날, {누구가} 얼려 준 강아지 아이스크림을 핥았어요.'), effect: { happy: 5 }, memory: true, key: 'watermelon' },
  { min: 1, max: 9, icon: '🎒', text: V('아이 등굣길을 매일 현관에서 배웅해요.', '막내 학교 앞까지 따라갔다가 교문에서 돌아왔어요.', '큰아이 시험 기간에 책상 밑에서 밤새 같이 있었어요.'), effect: { bond: 5 }, memory: true, key: 'school', when: (d) => d.family.id === 'kids' },
  { min: 2, max: 12, icon: '🧶', text: () => '할머니가 떠 준 목도리를 겨울 내내 둘렀어요.', effect: { happy: 4, bond: 4 }, memory: true, key: 'scarf', when: (d) => d.family.id === 'grand' },
  { min: 1, max: 12, icon: '🐓', text: () => '마당 닭들한테 쫓겨 다니다 결국 친구가 됐어요.', effect: { happy: 5 }, friend: true, memory: true, key: 'chicken', when: (d) => d.family.id === 'farm' },
  { min: 1, max: 9, icon: '🌙', text: () => '야근하고 돌아온 집사를 현관에서 꼬리로 맞았어요.', effect: { bond: 6 }, memory: true, key: 'latework', when: (d) => d.family.id === 'single' || d.family.id === 'student' },
  { min: 2, max: 9, icon: '🎓', text: () => '집사의 졸업식에 따라가서 사진을 찍었어요.', effect: { bond: 5, happy: 3 }, memory: true, key: 'graduate', when: (d) => d.family.id === 'student' },
  { min: 1, max: 10, icon: '🧺', text: V('{장소} 피크닉, 돗자리 한가운데를 차지했어요.', '{누구가} 싸 온 도시락 냄새에 피크닉 내내 앉아 있었어요.'), effect: { happy: 5, bond: 3 }, memory: true, key: 'picnic', when: (d) => d.family.id !== 'farm' },
  { min: 1, max: 12, icon: '🍂', text: V('낙엽 더미에 뛰어들어 온몸에 나뭇잎을 붙이고 왔어요.', '{누구가} 모아 둔 낙엽을 다 흩뜨려 놨어요.', '{장소}에서 도토리를 주워 와 {누구}한테 자랑했어요.'), effect: { happy: 4 }, memory: true, key: 'leaves' },
  { min: 3, max: 12, icon: '🚗', text: V('창문 열린 차 안에서 귀를 휘날리며 드라이브했어요.', '{누구와} 바닷가 드라이브를 갔어요. 창밖 냄새가 다 짭짤했어요.', '휴게소에서 {누구가} 사 준 소시지를 나눠 먹었어요.'), effect: { happy: 5 }, memory: true, key: 'drive' },
  { min: 5, max: 14, icon: '🐶', text: V('아기 강아지가 동생으로 들어왔어요. 산책 길을 하나하나 가르쳐 줬어요.', '{누구가} 보호소에서 아기 강아지를 데려왔어요. 첫날부터 졸졸 따라다녀요.', '꼬물꼬물 아기 동생이 생겼어요. 내 방석 반쪽을 내줬어요.'), effect: { happy: 3, bond: 2 }, memory: true, key: 'teacher', when: (d) => !d.sibling && (d.personality.id === 'calm' || d.personality.id === 'sweet' || Math.random() < 0.3), apply: (d, age) => adoptSibling(d, age) },
  // ── 선택이 이어지는 사건 ──
  { min: 1, max: 4, icon: '🎓', text: () => '강아지 유치원 졸업식에서 "모범견상"을 받았어요.', effect: { happy: 5, bond: 3 }, memory: true, key: 'kgrad', need: 'kinder' },
  { min: 1, max: 8, icon: '🛌', text: () => '오늘도 이불 속 제일 따뜻한 자리를 먼저 차지했어요.', effect: { bond: 3 }, need: 'bedbuddy' },
  { min: 2, max: 9, icon: '🚇', text: () => '처음 타 본 지하철에서도 의젓하게 앉아 있었어요. 사회화의 힘!', effect: { happy: 3 }, need: 'brave' },
  { min: 3, max: 10, icon: '⛰️', text: () => '주말 등산 백 번째! 산 정상에서 기념사진을 찍었어요.', effect: { health: 4, happy: 4 }, memory: true, key: 'hike100', need: 'hiker' },
  { min: 3, max: 10, icon: '🛋️', text: () => '소파에 내 엉덩이 모양 자국이 생겼어요. 우리 둘만의 명당.', effect: { bond: 4 }, need: 'couch' },
  { min: 3, max: 10, icon: '✈️', text: () => '제주도 여행! 비행기는 무서웠지만 바다는 최고였어요.', effect: { happy: 7 }, memory: true, key: 'jeju', need: 'traveler' },
  { min: 3, max: 9, icon: '🥈', text: V('어질리티 대회 은메달! 터널 앞에서 잠깐 망설인 게 아쉬웠어요.', '어질리티 대회 금메달! 관중석에서 가족이 제일 크게 소리쳤어요.'), effect: { happy: 7 }, memory: true, key: 'medal', need: 'athlete' },
  { min: 3, max: 10, icon: '🏃', text: () => '가족과 5km 마라톤을 끝까지 완주했어요.', effect: { health: 5, happy: 5 }, memory: true, key: 'marathon', need: 'runner' },
  { min: 3, max: 10, icon: '🔥', text: () => '단골 캠핑장 사장님이 이름을 외워 간식을 챙겨 줘요.', effect: { happy: 4 }, friend: true, need: 'camper' },
  { min: 3, max: 10, icon: '📱', text: V('사진 한 장이 인기 게시물에 올라갔어요. 팔로워 1만 돌파!', '팬이 손편지와 간식을 보내왔어요.'), effect: { happy: 5 }, memory: true, key: 'famous', need: 'sns' },
  { min: 5, max: 12, icon: '🏋️', text: () => '동물병원에서 "몸매 관리 모범견"이라고 칭찬받았어요.', effect: { health: 3 }, need: 'fit' },
  { min: 5, max: 12, icon: '⚖️', text: () => '체중계에 올라간 순간 가족이 웃음을 참지 못했어요.', effect: { happy: 2, health: -2 }, need: 'chubby' },
  { min: 5, max: 12, icon: '🐕', text: (d) => `동생 ${d.sibling?.name ?? '강아지'}랑 산책하다 줄이 서로 꼬였어요.`, effect: { happy: 4 }, need: 'sibling' },
  { min: 6, max: 14, icon: '🍚', text: () => '동생에게 밥그릇을 한 입 양보했어요. 형·언니가 다 됐어요.', effect: { bond: 4 }, memory: true, key: 'sibshare', need: 'sibling' },
  { min: 6, max: 14, icon: '🌳', text: () => '창밖 공원 벤치가 우리 가족의 아침 산책 출발점이에요.', effect: { health: 3 }, need: 'park' },
  { min: 8, max: 15, icon: '🩺', text: () => '정기 검진에서 작은 혹을 일찍 발견해 바로 치료했어요. 금방 회복!', effect: { health: 6, bond: 3 }, memory: true, key: 'earlycatch', need: 'checked' },
  { min: 8, max: 16, icon: '🏊', text: () => '수영장 선생님이 "제일 오래 다닌 학생"이라며 메달을 걸어 줬어요.', effect: { happy: 5 }, need: 'swimmer' },
  { min: 8, max: 16, icon: '💆', text: () => '마사지 시간만 되면 먼저 와서 배를 보이고 누워요.', effect: { bond: 4 }, need: 'massage' },
  // ── 가족의 변화 (장면 속 가족도 바뀌어요) ──
  { min: 2, max: 9, icon: '💒', text: () => '집사가 결혼했어요. 새 가족이 생겼어요!', effect: { bond: 3, happy: 3 }, memory: true, key: 'newfamily', once: 'family', when: (d) => (d.family.id === 'single' || d.family.id === 'student') && Math.random() < 0.6, apply: (d) => { d.household.extra.push('adult'); d.flags.push('once:wed'); } },
  { min: 2, max: 9, icon: '👶', text: () => '사람 아기가 태어났어요. 아기 침대 옆을 지키는 경비원이 됐어요.', effect: { bond: 6 }, memory: true, key: 'baby', once: 'baby', when: (d) => (d.family.id === 'couple' || d.flags.includes('once:wed')) && Math.random() < 0.6, apply: (d) => d.household.extra.push('baby') },
  { min: 5, max: 12, icon: '🎒', text: () => '큰아이가 대학에 가서 집을 떠났어요. 주말에 돌아오면 제일 먼저 달려가요.', effect: { happy: -2, bond: 3 }, memory: true, key: 'leave', once: 'family', when: (d) => d.family.id === 'kids' && Math.random() < 0.6, apply: (d) => { d.household.away = 1; } },
  { min: 2, max: 10, icon: '👧', text: () => '손주가 여름방학 내내 놀러 와서 매일 같이 뛰어놀았어요.', effect: { happy: 6 }, memory: true, key: 'grandkid', once: 'family', when: (d) => d.family.id === 'grand' && Math.random() < 0.6, apply: (d) => d.household.extra.push('child') },
  { min: 2, max: 10, icon: '👵', text: () => '이웃 할머니가 자주 놀러 와서 누룽지를 챙겨 줘요.', effect: { happy: 4 }, friend: true, once: 'family', when: (d) => d.family.id === 'farm' && Math.random() < 0.6, apply: (d) => d.household.extra.push('adult') },
  // ── 아주 드문 순간 ✨ ──
  { min: 2, max: 12, icon: '📺', text: () => 'TV 동물 프로그램에 출연했어요! 방송 다음 날 동네 스타가 됐어요.', effect: { happy: 8 }, memory: true, key: 'tv', rare: true, when: () => Math.random() < 0.03 },
  { min: 2, max: 12, icon: '🦸', text: () => '길 잃은 아이 옆을 지키며 짖어서 엄마를 찾게 도왔어요.', effect: { bond: 8, happy: 5 }, memory: true, key: 'hero', rare: true, when: () => Math.random() < 0.025 },
  { min: 3, max: 12, icon: '🏅', text: () => '치료견 자격증을 땄어요. 병원 어르신들을 만나러 다녀요.', effect: { happy: 6, bond: 5 }, memory: true, key: 'therapy', rare: true, when: (d) => (d.personality.id === 'calm' || d.personality.id === 'sweet') && Math.random() < 0.05 },
  { min: 2, max: 10, icon: '👑', text: () => '도그쇼에서 "베스트 인 쇼"를 받았어요!', effect: { happy: 8 }, memory: true, key: 'bestshow', rare: true, when: () => Math.random() < 0.02 },
  { min: 2, max: 12, icon: '🗓️', text: () => '사진이 반려견 달력 표지에 실렸어요.', effect: { happy: 6 }, memory: true, key: 'calendar', rare: true, when: () => Math.random() < 0.03 },
  { min: 2, max: 14, icon: '🚨', text: () => '한밤중 이상한 타는 냄새를 먼저 알아채고 짖어서 가족을 깨웠어요.', effect: { bond: 10 }, memory: true, key: 'alarm', rare: true, when: () => Math.random() < 0.02 },
  { min: 1, max: 10, icon: '🍀', text: () => '산책길 풀숲에서 네잎클로버를 물고 왔어요.', effect: { happy: 5 }, memory: true, key: 'clover', rare: true, when: () => Math.random() < 0.03 },
  // ── 아기 시절 ──
  { min: 0.1, max: 1, icon: '🦴', text: V('처음 받은 개껌을 하루 종일 지켰어요.', '이가 간지러워 의자 다리를 살짝 갉았어요.'), effect: { happy: 3 } },
  { min: 0.1, max: 1, icon: '🪞', text: () => '거울 속 강아지에게 한참을 짖었어요. 범인은 자기 자신.', effect: { happy: 3 } },
  { min: 0.2, max: 1.2, icon: '🎀', text: () => '이름표 달린 첫 목걸이를 선물받았어요.', effect: { bond: 4 }, memory: true, key: 'collar' },
  { min: 0.2, max: 1.2, icon: '🧸', text: V('삑삑이 인형을 처음 만나고 세상을 다 가진 표정이었어요.', '인형 솜을 다 꺼내 놓고 뿌듯해했어요.'), effect: { happy: 4 } },
  { min: 0.3, max: 1.5, icon: '🙋', text: V('"앉아"를 처음 성공했어요. 간식은 두 배!', '"손"을 배웠어요. 이제 아무나 손을 내밀어요.', '"기다려"를 배우다 침을 한 바가지 흘렸어요.'), effect: { bond: 5 }, memory: true, key: 'trick' },
  // ── 어른 강아지 ──
  { min: 1, max: 9, icon: '🛁', text: V('목욕하다 탈출해서 온 집을 젖은 채 뛰어다녔어요.', '목욕 후 드라이기 바람을 맞으며 눈을 지그시 감았어요.'), effect: { happy: 1 } },
  { min: 1, max: 9, icon: '🦋', text: V('나비를 쫓다가 꽃밭에 코를 박았어요.', '{장소}에서 잠자리를 쫓다가 {누구}한테 안겼어요.', '벌을 보고 짖다가 {누구가} 얼른 데리고 도망쳤어요.'), effect: { happy: 4 } },
  { min: 1, max: 10, icon: '📮', text: () => '택배 아저씨를 경계하다 결국 간식을 얻어먹는 사이가 됐어요.', effect: { happy: 3 }, friend: true, when: (d) => d.family.id !== 'farm' },
  { min: 1, max: 10, icon: '🎃', text: V('핼러윈에 호박 옷을 입고 동네 인기 스타가 됐어요.', '핼러윈에 {누구가} 유령 옷을 입혀 줬어요. 거울 보고 놀랐어요.', '핼러윈 사탕 바구니를 물고 {누구} 뒤를 따라다녔어요.'), effect: { happy: 4 }, memory: true, key: 'costume' },
  { min: 1, max: 10, icon: '🎄', text: V('크리스마스 트리 밑 선물 상자를 먼저 뜯었어요.', '산타 모자를 쓰고 가족사진 한가운데 앉았어요.'), effect: { happy: 4, bond: 3 }, memory: true, key: 'xmas' },
  { min: 1, max: 10, icon: '🥮', text: () => '명절에 친척들이 다 모였어요. 전 부치는 냄새에 정신이 없었어요.', effect: { happy: 3 }, when: (d) => d.family.id !== 'single' && d.family.id !== 'student' },
  { min: 1, max: 9, icon: '☔', text: V('장마철, 우비를 입고 첫 비 산책을 했어요.', '물웅덩이를 첨벙첨벙 다 밟고 다녔어요.'), effect: { happy: 4 }, memory: true, key: 'rain' },
  { min: 1, max: 10, icon: '🌻', text: V('해바라기 밭에서 가족이 인생 사진을 건졌어요.', '{계절} {장소}에서 {누구가} 찍어 준 사진이 가족 단톡방 프로필이 됐어요.', '{누구가} 꽃밭 한가운데서 나를 안고 사진을 찍었어요.'), effect: { happy: 3, bond: 3 }, memory: true, key: 'sunflower' },
  { min: 1, max: 9, icon: '🐿️', text: V('산에서 다람쥐를 보고 얼어붙었어요. 다람쥐도 얼어붙었어요.', '{장소}에서 청설모를 쫓아 나무 밑을 빙빙 돌았어요.', '처음 본 고슴도치에게 코를 대 봤다가 깜짝 놀랐어요.'), effect: { happy: 4 } },
  { min: 1, max: 10, icon: '🍠', text: () => '군고구마 굽는 냄새에 오븐 앞을 떠나지 않았어요.', effect: { happy: 4 }, when: (d) => d.personality.id === 'foodie' || Math.random() < 0.4 },
  { min: 1, max: 10, icon: '🧦', text: () => '현관 신발을 한 짝씩 물어다 침대에 모아 뒀어요.', effect: { happy: 3, bond: -1 }, when: (d) => d.personality.id === 'rascal' },
  { min: 1, max: 10, icon: '🫣', text: () => '청소기 소리에 숨었다가, 꺼지자마자 청소기에게 짖었어요.', effect: { happy: 1 }, when: (d) => d.personality.id === 'shy' || Math.random() < 0.3 },
  { min: 1, max: 10, icon: '🧭', text: () => '산책길에 처음 가 보는 골목을 발견했어요. 오늘은 탐험의 날.', effect: { happy: 5 }, when: (d) => d.personality.id === 'curious' },
  { min: 1, max: 10, icon: '💞', text: () => '가족이 울던 날, 말없이 옆에 앉아 꼬리를 기대 줬어요.', effect: { bond: 8 }, memory: true, key: 'comfort', when: (d) => d.personality.id === 'calm' || d.personality.id === 'sweet' },
  { min: 2, max: 10, icon: '💼', text: V('{누구가} 재택근무를 시작했어요. 화상회의에 깜짝 출연!'), effect: { bond: 5, happy: 3 }, memory: true, key: 'wfh', when: (d) => d.family.id === 'single' || d.family.id === 'couple' },
  { min: 2, max: 10, icon: '🏕️', text: () => '마당에 텐트를 치고 별을 보며 잤어요.', effect: { happy: 5, bond: 4 }, when: (d) => d.family.id === 'farm' },
  { min: 2, max: 10, icon: '🌽', text: () => '옥수수 수확 날, 밭고랑 사이를 신나게 달렸어요.', effect: { happy: 5 }, when: (d) => d.family.id === 'farm' },
  { min: 2, max: 10, icon: '📺', text: () => '할아버지랑 TV 동물 프로그램을 같이 봤어요. 화면 속 강아지에게 짖었어요.', effect: { bond: 4 }, when: (d) => d.family.id === 'grand' },
  { min: 2, max: 10, icon: '🧒', text: () => '아이들이 숨바꼭질에 끼워 줬어요. 술래는 항상 나.', effect: { happy: 5, bond: 3 }, when: (d) => d.family.id === 'kids' },
  { min: 2, max: 10, icon: '💍', text: () => '가족의 결혼식에 반지를 들고 입장했어요.', effect: { bond: 6, happy: 4 }, memory: true, key: 'wedding', when: (d) => d.family.id === 'couple' || d.family.id === 'single' },
  { min: 2, max: 10, icon: '🍜', text: () => '자취방 야식 시간, 라면 냄새에 같이 깨어 있었어요.', effect: { bond: 3 }, when: (d) => d.family.id === 'student' },
  { min: 2, max: 9, icon: '🏔️', text: () => '처음으로 산 정상에 올라갔어요. 바람 냄새가 달랐어요.', effect: { health: 4, happy: 5 }, memory: true, key: 'mountain', when: (d) => d.stats.health > 60 && d.breed.size !== 'small' },
  { min: 2, max: 9, icon: '🌭', text: () => '좁은 틈에 들어간 공을 긴 허리로 꺼내 왔어요.', effect: { happy: 4 }, when: (d) => d.breed.id === 'dachshund' || d.breed.id === 'corgi' },
  { min: 2, max: 10, icon: '🏊', text: () => '호숫가에서 혼자 뛰어들어 헤엄쳐 나왔어요. 리트리버의 피!', effect: { happy: 6, health: 3 }, memory: true, key: 'lake', when: (d) => d.breed.size === 'large' },
  { min: 2, max: 10, icon: '💇', text: () => '미용사 선생님이 곰돌이 컷을 해 줬어요. 동네 사진 모델이 됐어요.', effect: { happy: 3 }, when: (d) => ['poodle', 'bichon', 'maltese', 'pomeranian', 'shihtzu'].includes(d.breed.id) },
  { min: 2, max: 10, icon: '🛡️', text: () => '밤에 수상한 소리가 나자 가족 앞을 막아섰어요. 고양이였어요.', effect: { bond: 4 }, when: (d) => d.breed.id === 'jindo' || d.breed.id === 'shiba' || d.personality.id === 'calm' },
  { min: 3, max: 11, icon: '🤒', text: V('배탈이 나서 하루 종일 기운이 없었어요. 다음 날 금방 회복!', '감기에 걸려 콧물이 났어요. 가족이 밤새 지켜 줬어요.'), effect: { health: -4, bond: 3 } },
  { min: 3, max: 11, icon: '🏃', text: () => '목줄이 풀려 동네를 한 바퀴 돌았어요. 가족 얼굴이 하얗게 질렸어요.', effect: { happy: 2, bond: 2 }, when: (d) => d.personality.id === 'curious' || d.personality.id === 'rascal' || Math.random() < 0.2 },
  // ── 노견 ──
  { min: 7, max: 20, icon: '🧣', text: V('겨울이면 니트 옷을 입어야 산책을 나가요.', '털이 얇아져서 패딩 조끼를 새로 샀어요.'), effect: { health: 1 }, when: () => Math.random() < 0.5 },
  { min: 8, max: 20, icon: '🍲', text: V('가족이 노견용 수제 영양식을 만들어 줬어요.', '{누구가} 닭죽을 끓여 줬어요. 그릇까지 핥았어요.', '{누구가} 단호박 찐 걸 으깨 줬어요. 노란 수염이 됐어요.'), effect: { health: 4, bond: 3 }, memory: true, key: 'homefood', when: () => Math.random() < 0.5 },
  { min: 8, max: 20, icon: '🧩', text: V('노즈워크 장난감으로 간식 찾기 놀이를 했어요. 아직 코는 최고!', '{누구가} 집 안 곳곳에 숨긴 간식을 다 찾아냈어요.', '이불 속에 숨긴 간식도 코로 금방 찾았어요.'), effect: { happy: 4 }, when: () => Math.random() < 0.5 },
  { min: 8, max: 20, icon: '🌷', text: V('봄볕 드는 {장소}에서 꽃냄새를 맡으며 한참 앉아 있었어요.', '{계절} 오후, {누구} 옆에 앉아 바람 냄새를 맡았어요.', '햇살 좋은 날 {누구가} 창문을 열어 줬어요. 한참 밖을 바라봤어요.'), effect: { happy: 4 }, when: () => Math.random() < 0.5 },
  { min: 9, max: 20, icon: '👀', text: V('눈이 조금 흐려졌대요. 대신 가족 발소리는 더 잘 알아들어요.', '눈이 흐려져서 {누구가} 집 모서리에 쿠션을 붙여 줬어요.', '앞이 잘 안 보여도 {누구} 목소리만 들리면 꼬리를 흔들어요.'), effect: { bond: 3 }, when: () => Math.random() < 0.5 },
  { min: 9, max: 20, icon: '🐕', text: () => '어릴 적 친구를 산책길에서 다시 만났어요. 둘 다 흰 털이 났어요.', effect: { happy: 5 }, memory: true, key: 'oldfriend', when: (d) => d.friends > 0 && Math.random() < 0.5 },
  { min: 9, max: 20, icon: '🛏️', text: V('푹신한 노견 방석을 선물받고 그 위에서만 지내요.', '{누구가} 온열 방석을 깔아 줬어요. 거기가 제일 따뜻한 자리예요.', '{누구} 침대 옆에 내 자리가 새로 생겼어요.'), effect: { happy: 3 }, when: () => Math.random() < 0.5 },
  { min: 9, max: 20, icon: '🎞️', text: V('가족이 어릴 적 사진첩을 꺼내 보며 웃었어요. 나도 옆에서 꼬리를 쳤어요.', '{누구가} 내 아기 때 영상을 틀어 놓고 한참 웃었어요.', '{누구가} 휴대폰 속 내 사진을 넘기며 이때 기억나냐고 물었어요.'), effect: { bond: 5 }, memory: true, key: 'album', when: () => Math.random() < 0.5 },
  { min: 10, max: 20, icon: '🌕', text: () => '보름달이 뜬 밤, 가족과 밖에 나와 소원을 빌었어요.', effect: { bond: 4 }, memory: true, key: 'moon', when: () => Math.random() < 0.4 },
  { min: 10, max: 20, icon: '📷', text: V('가족이 함께 사진관에서 가족사진을 찍었어요.', '{누구가} 만든 가족 앨범 첫 장에 내 사진이 들어갔어요.', '{계절} {장소}에서 온 가족이 기념사진을 찍었어요.'), effect: { bond: 6 , when: () => Math.random() < 0.5 }, memory: true, key: 'photo' },
];

/** 한 해 동안 일어날 사건 1~3개 (월 순서대로) */

// 노견 시기에만 나오는 일들 (나이 대신 그 강아지 수명에 맞춰서)
const LATE: Pool = [
  { min: 6, max: 20, icon: '🌅', text: V('해 질 녘 산책을 좋아하게 됐어요. 덜 덥고, 그림자가 길어서요.', '{누구와} 노을 지는 {장소}에서 천천히 산책했어요.', '노을빛에 흰 털이 주황색으로 반짝였어요.'), effect: { happy: 4, bond: 2 } },
  { min: 6, max: 20, icon: '🐾', text: V('발바닥 털을 다듬었더니 미끄러지지 않고 잘 걸어요.', '미끄럼 방지 매트를 깔았더니 거실이 다시 운동장이 됐어요.', '{누구가} 발바닥에 크림을 발라 줬어요. 말랑말랑해졌어요.'), effect: { health: 3 } },
  { min: 6, max: 20, icon: '🦴', text: V('오래된 뼈다귀 장난감을 다시 꺼내 물고 다녔어요.', '어릴 때 갖고 놀던 인형을 찾아내 한참 핥았어요.', '구석에서 찾은 낡은 공을 {누구} 발밑에 툭 놓았어요.'), effect: { happy: 4 } },
  { min: 6, max: 20, icon: '🚗', text: V('창문을 내린 차 안에서 코를 내밀었어요. 걷지 않아도 바람 냄새는 그대로예요.', '{누구가} 드라이브를 시켜 줬어요. 예전 산책길을 차로 한 바퀴 돌았어요.'), effect: { happy: 5 } },
  { min: 6, max: 20, icon: '🌡️', text: V('하루 종일 기운이 없어서 {누구가} 밤새 곁을 지켰어요. 다음 날 아침엔 꼬리를 흔들었어요.', '열이 나서 병원에 다녀왔어요. {누구} 품에 안겨 돌아오는 길이 제일 편했어요.'), effect: { health: -3, bond: 6 } },
  { min: 6, max: 20, icon: '🧓', text: V('동네 어르신이 "우리 집 녀석도 이만할 때 그랬지" 하며 쓰다듬어 주셨어요.', '산책길 할머니가 "너도 나이 먹었구나" 하며 웃으셨어요.'), effect: { happy: 3 } },
  { min: 6, max: 20, icon: '🎂', text: V('생일 케이크에 초를 하나 더 꽂았어요. {누구가} 몰래 눈물을 닦았대요.', '노견 생일상으로 고기 미역국을 받았어요. 국물까지 싹 비웠어요.'), effect: { happy: 5, bond: 4 }, memory: true, key: 'seniorbday' },
  { min: 6, max: 20, icon: '🧴', text: V('피부가 약해져서 {누구가} 보습 크림을 발라 줘요. 그 시간을 제일 좋아해요.', '{누구가} 매일 저녁 빗질을 해 줘요. 빗질만 하면 스르르 눈이 감겨요.'), effect: { bond: 5 } },
  { min: 6, max: 20, icon: '🩴', text: V('현관에서 {누구} 신발 냄새를 맡으며 기다리는 게 하루 일과예요.', '문소리가 나면 일어나진 못해도 꼬리로 바닥을 탁탁 쳐요.'), effect: { bond: 4 } },
  { min: 6, max: 20, icon: '🧊', text: V('여름엔 쿨매트, 겨울엔 전기방석. 계절마다 {누구가} 자리를 바꿔 줘요.', '{누구가} 제일 따뜻한 창가로 방석을 옮겨 줬어요.'), effect: { health: 2, happy: 2 } },
  { min: 6, max: 20, icon: '🪑', text: V('눈이 침침해져서 {누구가} 가구 모서리마다 쿠션을 붙였어요.', '밤에 부딪히지 않게 복도에 작은 불을 켜 두기 시작했어요.'), effect: { health: 2, bond: 3 } },
  { min: 6, max: 20, icon: '🎵', text: V('좋아하던 노래가 나오면 아직도 귀가 쫑긋 서요.', '{누구가} 어릴 때 불러 주던 자장가를 다시 불러 줬어요.'), effect: { happy: 3, bond: 2 } },
  { min: 6, max: 20, icon: '🌼', text: V('어린 강아지들이 지나가면 꼬리를 한 번 흔들어 줘요. 선배의 여유예요.', '공원 벤치 옆에 엎드려 뛰어노는 강아지들을 흐뭇하게 구경했어요.'), effect: { happy: 3 } },
  { min: 6, max: 20, icon: '🛁', text: V('목욕이 힘들어져서 따뜻한 수건으로 닦아 줘요. 다 닦으면 꾸벅 졸아요.', '반신욕처럼 미지근한 물에 발만 담가 줬더니 표정이 노곤해졌어요.'), effect: { health: 2, happy: 2 } },
  { min: 6, max: 20, icon: '🍠', text: V('고구마를 잘게 잘라 줘야 먹지만, 먹는 속도는 여전히 일등이에요.', '이가 약해져서 간식을 물에 불려 줘요. 그래도 맛은 그대로래요.'), effect: { happy: 4 } },
  { min: 6, max: 20, icon: '🫂', text: V('{누구가} 나가기 전에 꼭 안아 주고 가요. 문이 닫혀도 한참 그 자리에 있어요.', '{누구가} 소파에 누우면 다리 사이로 파고들어 같이 낮잠을 자요.'), effect: { bond: 6 } },
  { min: 6, max: 20, icon: '🌙', text: V('밤 산책에서 별을 봤어요. {누구가} "저기가 강아지별이래" 하고 알려 줬어요.', '달 밝은 밤, {누구} 무릎에 기대 오래 하늘을 봤어요.'), effect: { bond: 5 }, memory: true, key: 'starwalk' },
  { min: 6, max: 20, icon: '🐕', text: () => '동생 강아지가 내 밥그릇 앞에서 기다려 줘요. 내가 다 먹을 때까지.', effect: { happy: 4, bond: 2 }, need: 'sibling' },
  { min: 6, max: 20, icon: '🎾', text: () => '공을 던져 주니 세 걸음 뛰고 돌아왔어요. 그래도 표정은 대회 때 그대로예요.', effect: { happy: 5 }, need: 'athlete' },
  { min: 6, max: 20, icon: '⛺', text: () => '오랜만의 캠핑. 모닥불 앞에서 가족 무릎을 베고 잤어요.', effect: { happy: 5, bond: 4 }, need: 'camper', memory: true, key: 'lastcamp' },
  { min: 6, max: 20, icon: '⛰️', text: () => '예전에 오르던 산 입구까지만 갔어요. 거기서 냄새로 정상까지 다녀왔대요.', effect: { happy: 4 }, need: 'hiker' },
  { min: 6, max: 20, icon: '📱', text: () => '팔로워들이 "노견 화이팅!" 댓글을 수백 개 달아 줬어요.', effect: { happy: 3 }, need: 'sns' },
  { min: 6, max: 20, icon: '🏊', text: () => '수영장 선생님이 물에 떠 있게 몸을 받쳐 줬어요. 둥둥 떠서 눈을 감았어요.', effect: { health: 4 }, need: 'swimmer' },
  { min: 6, max: 20, icon: '🩸', text: () => '예전에 헌혈한 병원에서 "그때 고마웠어" 하고 간식 꾸러미를 보내왔어요.', effect: { happy: 4 }, need: 'donor' },
  { min: 6, max: 20, icon: '🎒', text: () => '집을 떠난 큰아이가 주말마다 꼭 들러요. 오면 한참 무릎에 기대 있어요.', effect: { bond: 5, happy: 3 }, when: (d) => d.family.id === 'kids' },
  { min: 6, max: 20, icon: '🐓', text: () => '마당 평상에 누워 닭들이 노는 걸 하루 종일 지켜봤어요.', effect: { happy: 3 }, when: (d) => d.family.id === 'farm' },
  { min: 6, max: 20, icon: '📻', text: () => '할아버지와 나란히 앉아 라디오 트로트를 들었어요. 둘 다 꾸벅꾸벅.', effect: { bond: 4 }, when: (d) => d.family.id === 'grand' },
  { min: 6, max: 20, icon: '💼', text: () => '집사가 퇴근하자마자 "오늘 괜찮았어?" 하고 제일 먼저 나를 찾아요.', effect: { bond: 5 }, when: (d) => d.family.id === 'single' || d.family.id === 'student' },
].map((p) => ({ ...p, late: true }));


// 사는 집·새 가족과 이어지는 일들
const PLACE_POOL: Pool = [
  // 아파트·오피스텔·빌라
  { min: 1, max: 12, icon: '🛗', text: V('엘리베이터 문이 열리자 옆집 강아지와 딱 마주쳤어요. 둘 다 얼음.', '엘리베이터 거울에 비친 나를 보고 짖었어요.', '경비 아저씨가 엘리베이터 앞에서 간식을 하나 주셨어요.'), effect: { happy: 3 }, when: (d) => homeIs(d, 'apt', 'officetel', 'parkapt', 'nearwork') },
  { min: 1, max: 12, icon: '🔔', text: V('택배 기사님 발소리를 3층 아래에서부터 알아챘어요.', '아랫집 아이가 "멍멍아 안녕!" 하고 창문 너머로 손을 흔들었어요.', '층간소음 걱정에 {누구가} 거실에 폭신한 매트를 깔았어요.'), effect: { bond: 2 }, when: (d) => homeIs(d, 'apt', 'villa', 'officetel') },
  { min: 1, max: 10, icon: '🏢', text: V('단지 안 강아지 모임에 처음 나갔어요. 친구가 다섯이나 생겼어요.', '아파트 산책로 벤치마다 내 단골 냄새 자리가 생겼어요.'), effect: { happy: 4 }, friend: true, when: (d) => homeIs(d, 'apt', 'parkapt') },
  // 원룸·옥탑방
  { min: 1, max: 10, icon: '🏙️', text: V('옥상에서 {누구와} 도시 야경을 봤어요. 바람이 시원했어요.', '옥상 텃밭 상추를 몰래 뜯어 먹다 들켰어요.', '옥탑 평상 위에서 별을 세다 잠들었어요.'), effect: { happy: 4, bond: 3 }, when: (d) => homeIs(d, 'rooftop') },
  { min: 1, max: 8, icon: '🛏️', text: V('좁은 원룸이지만 침대 반쪽은 확실히 내 자리예요.', '{누구가} 라면 끓이는 냄새에 침대 위에서 고개를 들었어요.', '책상 밑 작은 방석이 나만의 아지트예요.'), effect: { bond: 3 }, when: (d) => homeIs(d, 'oneroom') },
  // 주택·골목
  { min: 1, max: 12, icon: '🚪', text: V('대문 틈으로 지나가는 사람마다 냄새로 인사했어요.', '골목 할머니들이 대문 앞에 앉은 나를 "우리 동네 문지기"라고 불러요.', '담장 위 고양이와 오늘도 대치 중이에요.'), effect: { happy: 3 }, when: (d) => homeIs(d, 'house', 'alley', 'shopfront', 'atelier') },
  { min: 1, max: 10, icon: '🌱', text: V('마당 텃밭에서 {누구가} 딴 방울토마토를 하나 얻어먹었어요.', '마당 잔디에 배를 깔고 낮잠을 잤어요.', '마당 구석에 몰래 판 구덩이가 들켰어요.'), effect: { happy: 4 }, when: (d) => homeIs(d, 'house', 'atelier') },
  // 한옥
  { min: 1, max: 14, icon: '🏯', text: V('대청마루에 배를 대고 누우면 여름에도 시원해요.', '처마 끝에서 떨어지는 빗방울을 한참 구경했어요.', '돌담길 산책 중에 관광객들이 사진을 찍어 갔어요.'), effect: { happy: 4, bond: 2 }, when: (d) => homeIs(d, 'hanok') },
  { min: 2, max: 14, icon: '🪵', text: V('툇마루에 앉아 {누구와} 마당에 내리는 눈을 봤어요.', '{누구가} 장독대 옆에 내 방석을 깔아 줬어요.'), effect: { bond: 4 }, when: (d) => homeIs(d, 'hanok') },
  // 바닷가
  { min: 1, max: 12, icon: '🦀', text: V('모래사장에서 게를 쫓다가 집게에 코를 물렸어요.', '썰물 때 갯벌에서 조개 냄새를 실컷 맡았어요.', '방파제 낚시꾼 아저씨들이 멸치를 하나씩 던져 줘요.'), effect: { happy: 5 }, when: (d) => d.home.place === 'sea' },
  { min: 1, max: 12, icon: '🌊', text: V('태풍 오는 밤, {누구} 품에 꼭 안겨 파도 소리를 들었어요.', '아침마다 해변을 한 바퀴 도는 게 우리 집 산책 코스예요.', '바닷바람에 털이 소금기로 뻣뻣해졌어요. {누구가} 빗질을 해 줬어요.'), effect: { bond: 3, happy: 2 }, when: (d) => d.home.place === 'sea' },
  { min: 2, max: 12, icon: '⛵', text: () => '배를 탔던 동네 어르신이 항구에서 나를 보면 꼭 이름을 불러 주세요.', effect: { happy: 4 }, need: 'boat' },
  // 과수원·산자락
  { min: 1, max: 12, icon: '🍎', text: V('떨어진 사과를 하나 물고 와서 {누구} 발밑에 놓았어요.', '사과 따는 날, 바구니 옆을 지키는 게 내 일이에요.', '과수원 원두막 그늘이 여름 낮잠 명당이에요.'), effect: { happy: 4 }, when: (d) => homeIs(d, 'orchard') },
  { min: 1, max: 12, icon: '🌲', text: V('숲길에서 도토리 줍는 다람쥐를 한참 지켜봤어요.', '계곡물에 발을 담그고 {누구} 옆에 앉아 있었어요.', '산새 소리에 귀를 쫑긋 세우고 아침을 맞았어요.'), effect: { happy: 4, health: 1 }, when: (d) => homeIs(d, 'mountain') },
  // 빵집 사장님 부부
  { min: 1, max: 14, icon: '🥐', text: V('새벽 빵 굽는 냄새에 제일 먼저 일어나요.', '단골손님 꼬마가 크루아상 대신 나를 보러 왔대요.', '{누구가} 남은 식빵 테두리를 잘게 잘라 줬어요.'), effect: { happy: 4 }, when: (d) => d.family.id === 'shop' },
  { min: 2, max: 14, icon: '🔔', text: V('가게 종이 딸랑 울리면 "어서 오세요" 대신 꼬리를 흔들어요.', '가게 SNS에 내 사진이 올라가자 손님이 두 배가 됐대요.'), effect: { happy: 3, bond: 2 }, memory: true, key: 'shopdog', need: 'shopdog' },
  // 엄마와 딸
  { min: 1, max: 14, icon: '🎒', text: V('딸이 학교에서 돌아오면 현관까지 마중 나가요.', '엄마가 늦는 날엔 딸 옆에 붙어 숙제를 지켜봐요.', '{누구가} 학교 발표 숙제로 내 이야기를 썼대요.'), effect: { bond: 4 }, when: (d) => d.family.id === 'mom' },
  { min: 5, max: 16, icon: '🎓', text: () => '딸이 졸업했어요. 졸업 사진 한가운데에 내가 앉아 있어요.', effect: { happy: 5, bond: 4 }, memory: true, key: 'daughtergrad', when: (d) => d.family.id === 'mom', once: 'family' },
  // 셰어하우스
  { min: 1, max: 12, icon: '🍕', text: V('셋이 야식을 시키는 날엔 내 몫의 닭가슴살도 꼭 있어요.', '거실에서 셋이 게임하는 동안 소파 한가운데를 차지했어요.', '셋 중 누가 산책시킬지 가위바위보를 했어요. 결국 셋이 다 나왔어요.'), effect: { happy: 4, bond: 2 }, when: (d) => d.family.id === 'share' },
  // 작가 집사
  { min: 1, max: 14, icon: '🎨', text: V('{누구} 스케치북에 오늘도 내 얼굴이 그려졌어요.', '물감 통을 엎질러서 발바닥이 무지개색이 됐어요.', '모델처럼 가만히 앉아 있었더니 간식을 두 개 받았어요.'), effect: { bond: 4 }, when: (d) => d.family.id === 'artist' },
  { min: 3, max: 14, icon: '🖼️', text: () => '내 발도장이 찍힌 그림이 작은 전시회에 걸렸어요.', effect: { happy: 5 }, memory: true, key: 'painted', need: 'painter' },
  // 이사
  { min: 5, max: 12, icon: '🌳', text: () => '이사 온 공원 앞 아파트, 창문만 열면 산책 친구들이 보여요.', effect: { happy: 4 }, when: (d) => homeIs(d, 'parkapt') },
  { min: 5, max: 12, icon: '🏬', text: V('회사 근처로 이사 온 뒤로 점심마다 {누구가} 잠깐씩 들러요.'), effect: { bond: 4 }, when: (d) => homeIs(d, 'nearwork') },
];
const LATE_PLACE: Pool = [
  { min: 6, max: 20, icon: '🛗', text: () => '엘리베이터에서 만나는 이웃마다 "많이 컸네, 아니 많이 늙었네" 하며 웃어요.', effect: { happy: 3 }, when: (d) => homeIs(d, 'apt', 'officetel', 'parkapt') },
  { min: 6, max: 20, icon: '🏯', text: () => '대청마루 햇볕 자리를 따라 하루에 세 번 자리를 옮겨요.', effect: { happy: 3 }, when: (d) => homeIs(d, 'hanok') },
  { min: 6, max: 20, icon: '🌅', text: V('방파제 끝에 앉아 {누구와} 고깃배가 돌아오는 걸 기다렸어요.'), effect: { bond: 4 }, when: (d) => d.home.place === 'sea' },
  { min: 6, max: 20, icon: '🍎', text: () => '사과꽃 날리는 과수원 길을 아주 천천히 걸었어요.', effect: { happy: 4 }, when: (d) => homeIs(d, 'orchard') },
  { min: 6, max: 20, icon: '🥖', text: () => '가게 앞 방석이 내 지정석이에요. 단골손님들이 출석 체크하듯 쓰다듬어 줘요.', effect: { happy: 4, bond: 2 }, when: (d) => d.family.id === 'shop' },
  { min: 6, max: 20, icon: '🖌️', text: () => '집사가 늙은 내 모습을 그리다가 붓을 내려놓고 한참 안아 줬어요.', effect: { bond: 6 }, when: (d) => d.family.id === 'artist' },
  { min: 6, max: 20, icon: '👩‍👧', text: () => '다 큰 딸이 엄마 대신 나를 업고 병원에 다녀왔어요.', effect: { bond: 5 }, when: (d) => d.family.id === 'mom' },
  { min: 6, max: 20, icon: '🏠', text: () => '셰어하우스를 떠난 친구가 주말마다 나를 보러 와요.', effect: { happy: 4 }, when: (d) => d.family.id === 'share' },
].map((p) => ({ ...p, late: true }));
const ALL: Pool = [...POOL, ...LATE, ...PLACE_POOL, ...LATE_PLACE];
export function eventsForYear(d: Dog, year: number, used: Set<number>): LifeEvent[] {
  const count = year === 0 ? 3 : 1 + Math.floor(Math.random() * 2) + (Math.random() < 0.3 ? 1 : 0);
  const out: LifeEvent[] = [];
  const cands = ALL.map((p, i) => ({ p, i })).filter(({ p, i }) => {
    if (used.has(i) && !(p.icon === '🐾' || p.icon === '😴')) return false;
    if (p.need && !d.flags.includes(p.need)) return false;
    if (p.once && d.flags.includes(`once:${p.once}`)) return false;
    const lo = Math.max(p.min, year, p.late ? d.lifespan * 0.62 : 0);
    const hi = Math.min(p.max, year + 1, d.lifespan);
    return lo < hi && (!p.when || p.when(d));
  });
  // 0살은 입양을 반드시 먼저
  if (year === 0) cands.sort((a, b) => a.p.min - b.p.min);
  for (let k = 0; k < count && cands.length; k++) {
    // 선택이 이어지는 사건·가족 변화는 3배 잘 뽑히게
    const w = cands.map(({ p }) => (p.need || p.once ? 3 : 1));
    let r = Math.random() * w.reduce((a, b) => a + b, 0);
    let wi = 0;
    while (wi < w.length - 1 && (r -= w[wi]) > 0) wi++;
    const idx = year === 0 && k === 0 ? 0 : wi;
    const { p, i } = cands.splice(idx, 1)[0];
    used.add(i);
    if (p.once) d.flags.push(`once:${p.once}`);
    const lo = Math.max(p.min, year, p.late ? d.lifespan * 0.62 : 0);
    const hi = Math.min(p.max, year + 1, d.lifespan);
    const age = year === 0 ? lo + (hi - lo) * (k / 3 + Math.random() * 0.2) : rand(lo, hi);
    out.push({ age, month: Math.floor((age % 1) * 12), icon: p.icon, text: p.text(d, age), effect: p.effect, memory: p.memory, key: p.key, rare: p.rare, apply: p.apply });
    if (p.friend) d.friends++;
  }
  // 1살부터는 해마다 대개 한두 번, 그날그날의 작은 순간이 끼어들어요
  if (year >= 1) {
    const n = Math.random() < 0.75 ? 1 + (Math.random() < 0.35 ? 1 : 0) : 0;
    for (let k = 0; k < n; k++) {
      const a = rand(year, Math.min(year + 1, d.lifespan));
      if (a < d.lifespan) out.push(dailyEvent(d, a));
    }
  }
  return out.sort((a, b) => a.age - b.age);
}

const gain = (v: number, now: number) => (v > 0 ? v * Math.max(0.12, 1 - now / 105) : v);

export function applyEffect(d: Dog, e: Partial<Stats> & { life?: number; walk?: number; treat?: number } = {}) {
  if (e.health) d.stats.health = clamp(d.stats.health + e.health);
  // 좋은 일은 이미 행복할수록 덜 올라가고(포화), 나쁜 일은 그대로 깎여요
  if (e.happy) d.stats.happy = clamp(d.stats.happy + gain(e.happy, d.stats.happy));
  if (e.bond) d.stats.bond = clamp(d.stats.bond + gain(e.bond, d.stats.bond));
  if (e.life) d.lifespan += e.life;
  if (e.walk) d.walkRate = Math.max(0.5, d.walkRate + e.walk);
  if (e.treat) d.treatRate = Math.max(0.5, d.treatRate + e.treat);
}

export const HAPPY_PULL = 0.3;
/** 평생 행복 점수: 살아온 동안의 행복(60%)과 유대(40%)를 시간에 따라 평균 낸 값 */
export const lifeScore = (d: Dog) => {
  const avg = d.joy.t ? d.joy.sum / d.joy.t : (d.stats.happy + d.stats.bond) / 2;
  // 평균은 좁게 모이니 0~100 점수로 넓혀요 (보통의 한평생 ≈ 70점)
  return Math.max(0, Math.min(100, Math.round(70 + (avg - 59) * 2.3)));
};

/** 시간이 dt년 흐를 때: 산책·간식 누적, 나이에 따른 건강 변화 */
export function tick(d: Dog, age: number, dt: number) {
  d.walks += d.walkRate * 365 * dt;
  d.treats += d.treatRate * 365 * dt;
  const senior = age > d.lifespan * 0.65;
  d.stats.health = clamp(d.stats.health + (senior ? -6 : 0.5) * dt);
  d.stats.bond = clamp(d.stats.bond + gain(1.2, d.stats.bond) * dt);
  // 행복은 아무 일 없으면 천천히 평소 기분(joy.base)으로 돌아가고, 노견이 되면 몸이 힘들어 조금 더 내려가요
  d.stats.happy = clamp(d.stats.happy + ((d.joy.base - d.stats.happy) * HAPPY_PULL - (senior ? 2 : 0)) * dt);
  d.joy.sum += (0.6 * d.stats.happy + 0.4 * d.stats.bond) * dt;
  d.joy.t += dt;
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

// ── 견생 칭호: 살아온 기록으로 붙는 별명 (최대 3개) ──
export function titlesOf(d: Dog, memories: number): string[] {
  const t: [boolean, string][] = [ // 드문 칭호부터
    [d.rare >= 2, '✨ 전설의 강아지'],
    [d.rare === 1, '✨ 특별한 순간을 가진 강아지'],
    [d.flags.includes('sns') || d.flags.includes('athlete'), '🌟 동네 스타'],
    [d.friends >= 4, '🐾 동네 인싸'],
    [!!d.sibling, '🐕 든든한 형·언니'],
    [d.lifespan > d.breed.life[1], '🎖️ 장수견'],
    [d.walks > 10000, '👟 산책왕'],
    [d.treats > 13000, '🍖 간식 감별사'],
    [d.personality.id === 'shy' && d.flags.includes('brave'), '🦁 용감해진 겁쟁이'],
    [d.stats.health >= 60 && d.lifespan > (d.breed.life[0] + d.breed.life[1]) / 2, '💪 건강 지킴이'],
    // 흔한 칭호는 뒤에: 다른 칭호가 적을 때만 보여요
    [memories >= 13, '📔 추억 부자'],
    [d.stats.bond >= 80, '💞 가족 바라기'],
  ];
  const out = t.filter(([ok]) => ok).map(([, s]) => s);
  return (out.length ? out : ['🏡 우리 집 막내']).slice(0, 3);
}

// ── 강아지별로 가기 전, 가족에게 남기는 말 ──
// 살아온 기록(가족·기억·선택·성격·숫자)에서 서로 다른 이야기를 골라 4~5문장으로 엮습니다.
// 같은 끝말("고마워" 등)이 두 번 넘게 나오지 않게 고릅니다.
const OPEN_BY_FAMILY: Record<string, string[]> = {
  single: ['혼자 퇴근하던 너의 저녁, 문 앞에서 기다리는 게 내 하루의 제일 큰 일이었어.', '불 꺼진 집에 네가 돌아오면 세상이 다시 환해졌어.', '우리 둘뿐이었지만 한 번도 외롭지 않았어.'],
  couple: ['둘이서 나를 부르던 목소리가 세상에서 제일 좋은 소리였어.', '너희 둘 사이에 끼어 자던 밤이 제일 포근했어.', '싸우다가도 나를 보면 웃던 너희가 참 좋았어.'],
  kids: ['꼬마들이 자라는 걸 옆에서 다 봤어. 내가 다 키운 거나 마찬가지야.', '시끌벅적한 우리 집이 세상에서 제일 재밌는 곳이었어.', '아이들 숙제할 때 발밑에서 자던 시간, 나도 같이 공부한 거야.'],
  grand: ['할머니 할아버지 무릎이 세상에서 제일 따뜻한 자리였어.', '느린 걸음으로 같이 걷던 동네 한 바퀴가 나는 제일 좋았어.', '마루에 나란히 앉아 해 지는 걸 보던 오후들, 다 기억해.'],
  student: ['좁은 방이었지만, 너랑 있어서 하나도 좁지 않았어.', '라면 끓이던 냄새 속에서 같이 밤새던 날들이 그리울 거야.', '시험 기간에 네 무릎 위가 내 자리였던 거 알지?'],
  shop: ['빵 굽는 새벽 냄새로 하루를 시작하던 우리 집, 정말 좋았어.', '손님들이 다 가고 셋이 나눠 먹던 빵 부스러기, 최고였어.', '가게 종소리가 울릴 때마다 꼬리가 먼저 반응했어.'],
  mom: ['엄마랑 딸, 그리고 나. 우리 셋이면 충분했어.', '둘이 나를 사이에 두고 웃던 밤들이 제일 행복했어.', '딸이 자라는 걸 옆에서 다 봤어. 엄마만큼 나도 뿌듯해.'],
  share: ['집사가 셋이라 사랑도 세 배였어.', '거실에 모여 야식 먹던 밤, 내 몫도 꼭 챙겨 줘서 고마웠어.', '서로 다른 셋을 이어 준 게 나였다는 거, 알지?'],
  artist: ['네 그림 속에 내가 있어서, 나는 영원히 거기 살아 있을 거야.', '물감 냄새 나는 작업실이 내 놀이터였어.', '붓 소리를 자장가 삼아 자던 오후들, 다 기억해.'],
  farm: ['마당을 달리던 날들, 바람 냄새까지 다 기억할게.', '흙냄새, 풀냄새, 그리고 네 손 냄새. 그게 내 세상 전부였어.', '마당 끝까지 달려가도 돌아보면 늘 네가 있었어.'],
};
const BY_MEMORY: Record<string, string[]> = {
  adopt: ['처음 너희 집에 온 날, 사실 조금 떨렸어. 이렇게 좋은 집인 줄 몰랐거든.', '처음 안아 줬을 때 그 냄새가 아직도 기억나.'],
  firstwalk: ['처음 산책하던 날, 세상이 이렇게 좋은 냄새로 가득한 줄 몰랐어.', '목줄 처음 했을 때 버둥거린 거, 이제 와서 미안해.'],
  birthday: ['내 이름 적힌 케이크, 내년 몫까지 먹은 걸로 할게.', '생일마다 고깔모자 씌운 거, 사실 은근히 좋았어.'],
  sea: ['바다에서 파도한테 짖던 날 기억나? 사실 좀 무서웠는데 네가 웃어서 괜찮았어.', '모래사장에 찍힌 내 발자국, 아직 거기 있을까?'],
  camping: ['텐트 안에서 같이 별 보던 밤이 자꾸 생각나.', '캠핑장에서 구워 먹던 고기 냄새, 평생 못 잊어.'],
  baby: ['아기 침대 옆을 지키는 일, 나 꽤 잘했지?', '아기가 처음 내 이름 부른 날, 나 진짜 신났었어.'],
  snow: ['첫눈 오던 날, 우리 둘 다 바보처럼 뛰어다녔잖아.', '눈밭에 코 박고 놀다 콧물 났던 거 기억나?'],
  race: ['운동회 1등 한 거, 동네방네 자랑해도 돼.', '그날 받은 메달, 내 보물 상자에 넣어 둬.'],
  slowwalk: ['느려진 나랑 끝까지 같은 길을 걸어 준 거, 다 알아.', '마지막 산책길 햇살이 참 따뜻했어.'],
  photo: ['가족사진에서 나 제일 잘 나왔지?', '사진관 아저씨가 나보고 모델이래. 기억해 둬.'],
  ball: ['공은 백 번 던져 줘도 좋았어. 백한 번째도 기다렸을 거야.', '소파 밑에 숨겨 둔 공 세 개, 이제 네가 찾아도 돼.'],
  thunder: ['천둥 치던 밤에 꼭 안아 준 거, 그 품이 내 피난처였어.'],
  watermelon: ['여름에 얻어먹던 수박 한 조각, 그게 내 여름이었어.'],
  school: ['아침마다 현관에서 아이들 배웅하던 일, 내가 제일 좋아하던 일이었어.'],
  scarf: ['할머니가 떠 준 목도리, 강아지별에도 하고 갈게.'],
  chicken: ['마당 닭들한테 내가 먼저 갔다고 전해 줘. 걔네도 친구였어.'],
  latework: ['늦게 와도 괜찮았어. 현관 앞에서 기다리는 시간도 좋았거든.'],
  graduate: ['네 졸업식 날, 나도 학사모 쓴 기분이었어.'],
  picnic: ['돗자리 한가운데 내가 누웠던 피크닉, 그날 하늘 진짜 파랬지.'],
  leaves: ['낙엽 더미에 뛰어들던 가을이 그리울 거야.'],
  drive: ['창문 열린 차에서 귀 휘날리던 드라이브, 그게 나한텐 비행기였어.'],
  collar: ['처음 받은 이름표 목걸이, 강아지별에서도 하고 있을게.'],
  trick: ['"앉아" 처음 성공했을 때 네가 더 신났던 거 기억나.'],
  costume: ['호박 옷 입었던 핼러윈, 사실 좀 부끄러웠어. 그래도 네가 웃어서 좋았어.'],
  xmas: ['크리스마스마다 선물 상자 먼저 뜯은 거, 산타한테는 비밀이야.'],
  rain: ['우비 입고 물웅덩이 밟던 장마철, 그게 제일 신나는 산책이었어.'],
  sunflower: ['해바라기 밭에서 찍은 사진, 거기 나 진짜 웃고 있지?'],
  comfort: ['네가 울던 날 옆에 있어 준 거, 그건 내가 할 수 있는 전부였어.'],
  wfh: ['네가 집에서 일하던 날들, 하루 종일 같이 있어서 꿈같았어.'],
  wedding: ['반지 들고 입장한 날, 나 하나도 안 떨었어. 진짜야.'],
  mountain: ['산꼭대기 바람 냄새, 강아지별에도 그런 바람이 불까?'],
  lake: ['호수에 뛰어들던 날, 젖은 채로 너한테 안긴 거 미안해.'],
  homefood: ['네가 만들어 준 영양식, 세상에서 제일 맛있는 밥이었어.'],
  oldfriend: ['산책길에서 다시 만난 친구한테, 내가 먼저 갔다고 전해 줘.'],
  album: ['사진첩 넘기며 웃던 너를 보는 게 좋았어. 가끔 그 사진첩 꺼내 봐.'],
  moon: ['보름달 뜬 밤에 빈 소원, 사실 너랑 오래오래 있게 해 달라는 거였어.'],
  kgrad: ['유치원 모범견상, 그거 사실 간식 때문에 받은 거야.'],
  hike100: ['백 번 오른 산, 정상에서 맡던 바람 냄새 아직 코끝에 있어.'],
  jeju: ['제주도 바다, 비행기는 무서웠지만 너랑 가서 괜찮았어.'],
  medal: ['어질리티 메달, 사실 네 응원 소리 듣고 달린 거야.'],
  marathon: ['5km 완주한 날, 너랑 나 둘 다 헥헥거렸잖아.'],
  famous: ['팔로워 1만 명보다 네 한 명이 더 좋았어.'],
  sibshare: ['동생한테 밥 양보한 거, 다음엔 걔가 너한테 양보할 거야.'],
  earlycatch: ['검진 덕분에 아픈 걸 일찍 찾았잖아. 네가 날 지켜 준 거야.'],
  newfamily: ['새 가족이 생긴 날, 나도 가족이 하나 더 생겼어.'],
  shopdog: ['가게 SNS 속 나, 단골손님들한테 고마웠다고 전해 줘.'],
  daughtergrad: ['졸업 사진 한가운데 앉혀 줘서 고마워. 우리 딸, 다 컸다.'],
  painted: ['전시회에 걸린 내 발도장, 그게 내 이름이야.'],
  leave: ['주말마다 돌아오는 발소리, 나는 멀리서도 다 알아들었어.'],
  grandkid: ['손주랑 뛰어놀던 여름방학, 그해 여름이 제일 짧았어.'],
  tv: ['TV에 나왔던 거, 강아지별 친구들한테 자랑할 거야.'],
  hero: ['길 잃은 아이 지켜 준 날, 너한테 배운 대로 한 거야.'],
  therapy: ['병원 어르신들 손 잡아 드리던 일, 너 닮아서 잘했던 거야.'],
  bestshow: ['베스트 인 쇼 트로피, 거실 제일 잘 보이는 데 놔 줘.'],
  calendar: ['달력 표지의 나, 일 년 내내 너를 지켜보고 있었어.'],
  alarm: ['그날 밤 짖은 거, 너를 지키는 게 내 일이었으니까.'],
  clover: ['네잎클로버, 사실 너한테 행운 주려고 물어 온 거야.'],
  teacher: ['동생 강아지한테 산책길 다 가르쳐 줬어. 이제 걔가 너를 지켜 줄 거야.'],
};
const BY_PERSONALITY: Record<string, string[]> = {
  sweet: ['배 만져 줄 때가 제일 행복했어. 그 손 잊지 않을게.', '애교는 너한테만 부렸던 거, 알지?'],
  shy: ['겁 많은 나를 늘 먼저 안아 줬지. 너 덕분에 용감했어.', '낯선 소리가 나면 네 뒤에 숨었어. 거기가 제일 안전했거든.'],
  foodie: ['간식은… 솔직히 조금 더 먹고 싶었어.', '네가 부스럭거리면 자다가도 달려간 거, 다 사랑이었어.'],
  rascal: ['양말 숨긴 거 미안해. 사실 네 냄새가 좋아서 그랬어.', '휴지 뜯어 놓은 날 크게 혼내지 않아 줘서 다행이었어.'],
  calm: ['말은 못 했지만 나는 늘 네 옆에 있었어.', '조용히 네 발밑에 누워 있던 시간이 나한텐 전부였어.'],
  curious: ['산책길 냄새를 다 맡을 때까지 기다려 준 거, 나 다 알아.', '세상 구경 실컷 시켜 줘서 하나도 아쉽지 않아.'],
  sleepy: ['꿈속에서도 맨날 너랑 산책했어. 거기서도 계속할게.', '네 옆에서 자던 낮잠이 세상에서 제일 달았어.'],
};
// 가족이 고른 선택 [첫 번째 선택지, 두 번째 선택지]
const BY_PICK: Record<string, string[]> = {
  neuter: ['넥카라 쓰고 부딪히던 거, 이제 생각하면 웃겨.', ''],
  school: ['유치원 친구들한테 나 먼저 간다고 전해 줘.', '거실 놀이터가 세상에서 제일 넓은 운동장이었어.'],
  crate: ['이불 속에서 같이 자던 밤들, 그게 내 집이었어.', '나만의 작은 집도 좋았지만, 네 방 문 앞이 더 좋았어.'],
  weekend: ['주말마다 새 냄새 맡으러 데려가 준 거, 정말 신났어.', '소파에서 같이 뒹굴던 주말이 제일 좋았어.'],
  trip: ['같이 본 바닷가 노을, 강아지별에서도 보일까?', '호텔에서 기다리던 날, 네가 데리러 온 순간을 잊지 못해.'],
  sport: ['장애물 터널 통과할 때 네 박수 소리가 제일 컸어.', '놀이터 미끄럼틀은 우리 둘만의 경기장이었지.'],
  diet: ['다이어트할 때 서운했던 거, 이제 다 이해해.', '간식 더 줘서 행복했어. 진짜로.'],
  sibling: ['동생한테 내 자리 물려줄게. 소파 왼쪽 끝이야.', '사랑을 독차지해서 미안. 사실 좀 좋았어.'],
  move: ['창밖으로 보이던 공원, 거기서 제일 많이 뛰었어.', '일찍 퇴근해 줘서 같이 있는 시간이 늘었잖아. 그게 제일 좋았어.'],
  checkup: ['병원은 싫었지만, 덕분에 너랑 더 오래 있을 수 있었어.', ''],
  teeth: ['이 아파도 말랑한 간식 덕분에 끝까지 맛있게 먹었어.', '불린 사료도 네가 주니까 맛있었어.'],
  swim: ['물속에서 다시 어린 강아지가 된 것 같았어.', ''],
  stroller: ['유모차 덕분에 다리가 아파도 좋아하던 공원 바람을 맞을 수 있었어.', '느려진 걸음에 맞춰 천천히 걸어 준 거, 다 느꼈어.'],
  bucket: ['처음 가 본 숲, 그 꽃냄새 아직도 코끝에 있어.', '마지막 생일상, 평생 먹은 것 중에 제일 맛있었어.'],
  name: ['네가 이름 불러 줄 때마다 세상에서 제일 소중한 강아지가 된 기분이었어.', '"우리 강아지 왔쪄요" 그 목소리, 강아지별에서도 들릴 거야.'],
  food: ['꼼꼼하게 골라 준 밥 덕분에 이만큼 건강했어.', '밥그릇 반짝반짝하게 핥던 거, 그게 내 감사 인사였어.'],
  socialize: ['네 덕분에 세상이 하나도 안 무서웠어.', '우리 동네 냄새, 하나하나 다 기억해.'],
  cafe: ['애견카페 친구들한테 안부 전해 줘.', '운동장 잔디밭을 혼자 달리던 기분, 최고였어.'],
  hobby: ['새벽 러닝 같이 뛴 거, 나 꽤 빨랐지?', '캠핑장마다 따라다니던 날들, 내 여행이었어.'],
  photo: ['팔로워들한테 내가 고마워했다고 전해 줘.', '우리끼리만 아는 사진들, 가끔 꺼내 봐.'],
  alone: ['낮에 놀아 준 선생님한테도 인사 전해 줘.', '출근 전 아침 산책, 그게 하루 중 제일 좋았어.'],
  toy: ['새 인형들, 동생한테 물려줘도 돼. 하나만 빼고.', '노즈워크 매트에서 간식 찾던 거, 내 코 실력 봤지?'],
  weight: ['밥 더 챙겨 줘서 끝까지 든든했어.', '병원 가서 별일 없다고 했을 때 네 얼굴, 나도 안심했어.'],
  stairs: ['강아지 계단 덕분에 끝까지 소파는 내 자리였어.', '안아서 올려 줄 때마다 네 어깨에 턱 괴는 게 좋았어.'],
  massage: ['저녁마다 해 준 마사지, 그 손길이 제일 편안했어.', '찜질 매트 위에서 졸던 겨울밤이 그리울 거야.'],
  anniversary: ['처음 만난 그 자리, 나도 다 기억하고 있었어.', '12주년 파티 고깔모자, 사실 마음에 들었어.'],
  portrait: ['거실에 걸린 내 초상화 보면서 가끔 웃어 줘.', '발도장 액자 볼 때마다 내가 옆에 있다고 생각해.'],
  night: ['밤에 깰 때마다 얹어 주던 손, 그거면 다시 잠들 수 있었어.', '수면등 불빛 아래서 꾼 꿈은 다 너였어.'],
  bath: ['처음 목욕하던 날 거품 모자, 사실 꽤 마음에 들었어.', ''],
  bite: ['어릴 때 손 깨문 거 미안해. 다 좋아서 그랬어.', '치발기 보물창고는 소파 밑에 아직 있을 거야.', ''],
  collar: ['', '', '짤랑거리던 내 이름표, 가끔 흔들어 봐. 내가 달려갈게.'],
  yard: ['마당 구석구석 내 냄새가 남아 있을 거야.', '아랫목 방석, 거기가 세상에서 제일 따뜻했어.'],
  duty: ['산책 당번표에 찍은 내 발도장, 떼지 말아 줘.', ''],
  guest: ['숨어 있어도 기다려 준 거, 그래서 용기를 낼 수 있었어.', ''],
  snow: ['첫눈 오던 날 코에 쌓인 눈, 차갑고 신났어.', '창문에 남긴 코 자국, 닦지 말고 조금만 둬.'],
  clothes: ['공룡 옷 입은 내 사진 보면 웃어 줘.', '', '단톡방 프로필 속 나, 오래오래 걸어 둬.'],
  trick: ['하이파이브는 언제든 받아 줄게. 손 내밀어 봐.', '"빵!" 하면 쓰러지던 거, 이제 진짜 연기 은퇴야.', '"먹어" 소리 기다리던 그 간식 맛, 최고였어.'],
  rain: ['노란 우비 입고 웅덩이 밟던 날, 정말 신났어.', '이불 속 숨바꼭질, 내가 매번 이겼지?', ''],
  exam: ['도서관 앞 잔디에서 기다리던 시간도 좋았어. 시험 잘 봤지?', ''],
  market: ['시장 간식 냄새, 강아지별에서도 생각날 거야.', '라디오 들으며 기다리던 할아버지 무릎, 따뜻했어.'],
  rival: ['옆집 친구한테 이제 안 짖는다고 전해 줘.', ''],
  remote: ['화상 회의에 출연하던 내 꼬리, 인기 많았지?', '점심 산책 덕분에 동네 사장님들 다 내 친구야.'],
  holiday: ['배 위에서 뒤집히던 내 귀, 기억하지?', '', '잠옷 바람으로 보낸 휴가, 제일 편안했어.'],
  donor: ['내 피로 살아난 친구가 어딘가에서 뛰어놀고 있을 거야.', ''],
  festival: ['코 탐정 메달은 네가 대신 걸고 다녀 줘.', '런웨이에서 드러누운 거, 그게 내 포즈였어.', ''],
  hens: ['닭장 경비원 일, 이제 네가 맡아 줘.', '닭한테 쪼인 거, 아직도 조금 억울해.'],
  drawer: ['', '간식 서랍 앞에서 모른 척해 준 거, 다 알아. 고마워.'],
  hearing: ['네 손짓, 귀가 안 들려도 다 알아들었어.', ''],
  seniorfood: ['네가 끓여 준 닭죽, 세상에서 제일 맛있었어.', '', '끝까지 좋아하던 밥 줘서 고마워.'],
  puppyguest: ['아기 강아지한테 공 물어 오는 법 가르쳐 준 거, 나 꽤 괜찮은 선배였지?', ''],
  route: ['', '벤치마다 쉬어 가던 산책, 그 길이 제일 예뻤어.', '느려도 끝까지 같이 걸어 줘서 고마워.'],
  insurance: ['', '저금통에 붙은 내 이름표, 이제 다른 데 써도 돼.'],
  seaagain: ['다시 간 그 바다, 처음처럼 파도 소리가 좋았어.', ''],
  diary: ['네 한 줄 일기 속에 내가 다 있어. 가끔 읽어 줘.', '1초씩 모은 영상, 보고 싶을 때 틀어 봐.', '카메라 대신 쓰다듬어 준 손, 그게 다 기억으로 남았어.'],
  oldpal: ['오랜 친구한테 내가 먼저 간다고, 천천히 오라고 전해 줘.', ''],
  appetite: ['네 손바닥 위에서 먹던 밥이 제일 맛있었어.', '고구마 토핑, 마지막까지 내 최애였어.', ''],
  holidaygather: ['명절마다 한가운데 자리 내줘서 고마워. 다들 따뜻했어.', ''],
  bakery: ['빵 냄새 나는 가게 마스코트, 내 평생 직업이었어.', ''],
  room: ['요일마다 바뀌던 이불 냄새, 셋 다 좋았어.', '거실 한가운데 내 방석, 이제 모두의 자리로 써 줘.'],
  canvas: ['캔버스에 찍은 내 발도장, 그게 내 첫 작품이야.', ''],
  beach: ['처음 본 파도, 무서웠지만 네가 있어서 괜찮았어.', ''],
  fishing: ['뱃머리에서 본 바다, 강아지별에서도 보일까?', '방파제에서 기다리던 시간도 좋았어.'],
  momday: ['딸이랑 걷던 하굣길, 우리 셋의 비밀 산책로였어.', ''],
  ondol: ['아랫목의 따뜻함, 강아지별엔 없을 것 같아.', '툇마루 볕, 그 자리에 가끔 나 대신 앉아 줘.'],
  stairs2: ['계단참마다 같이 숨 고르던 거, 그게 제일 좋았어.', ''],
  portrait2: ['그림 속의 나, 오래오래 걸어 둬.', '거실 가득한 내 그림들, 보면서 웃어 줘.'],
};
const CLOSINGS = [
  '먼저 강아지별에 가서 기다릴게. 천천히, 아주 천천히 와. 사랑해.',
  '너무 오래 울지 말고, 맛있는 거 먹고 산책 많이 해. 사랑해.',
  '나는 강아지별에서 꼬리 흔들면서 기다릴게.',
  '다음에 또 만나면, 그때도 내가 먼저 달려갈게.',
  '하늘에 무지개 뜨면 나 생각해 줘. 그게 나야.',
  '내 몫까지 오래오래 행복해야 해. 약속이야.',
];

const shuffle = <T,>(a: T[]) => a.map((v) => [Math.random(), v] as const).sort((x, y) => x[0] - y[0]).map((x) => x[1]);

export function lastWords(d: Dog, memories: { icon?: string; key?: string }[], picks: Record<string, number>): string[] {
  const body: string[] = [];
  // 기억: 이번 생에 실제로 있었던 일 중에서 무작위로 최대 2개
  const keys = [...new Set(memories.map((m) => m.key).filter((k): k is string => !!k && !!BY_MEMORY[k]))];
  for (const k of shuffle(keys).slice(0, 2)) body.push(pick(BY_MEMORY[k]));
  // 선택: 고른 것 중 하나
  const pickLines = shuffle(Object.entries(picks)).map(([id, k]) => BY_PICK[id]?.[k] ?? '').filter(Boolean);
  if (pickLines.length) body.push(pickLines[0]);
  // 성격·숫자 이야기 후보
  const extra = [pick(BY_PERSONALITY[d.personality.id] ?? [''])];
  if (d.friends >= 3) extra.push(`친구 ${d.friends}마리한테 인사 다 하고 갈게.`);
  if (d.walks > 3000) extra.push(`같이 걸은 ${Math.round(d.walks).toLocaleString('ko-KR')}번의 산책, 하나도 안 잊을게.`);
  if (d.lifespan > d.breed.life[1]) extra.push('다들 내가 오래 살았대. 네가 잘 돌봐 줘서야.');
  if (d.treats > 12000) extra.push(`간식 ${Math.round(d.treats).toLocaleString('ko-KR')}개, 하나하나 다 맛있었어.`);
  body.push(...shuffle(extra.filter(Boolean)));

  // 같은 끝말이 겹치지 않게: '고마워'는 한 번만, 같은 문장 반복 없음
  const out: string[] = [pick(OPEN_BY_FAMILY[d.family.id] ?? ['너희 집에 와서 정말 행복했어.'])];
  let thanks = /고마워/.test(out[0]) ? 1 : 0;
  for (const line of body) {
    if (out.length >= 4) break;
    if (out.includes(line)) continue;
    if (/고마워/.test(line)) {
      if (thanks >= 1) continue;
      thanks++;
    }
    out.push(line);
  }
  const closing = shuffle(CLOSINGS).find((c) => !(thanks && /고마워/.test(c))) ?? CLOSINGS[0];
  out.push(closing);
  return out;
}
