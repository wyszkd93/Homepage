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

export interface LifeEvent {
  age: number; month: number; icon: string; text: string; effect?: Partial<Stats>; memory?: boolean; key?: string;
  rare?: boolean; // 아주 드물게 일어나는 일
  apply?: (d: Dog) => void; // 가족 구성 변화 같은 추가 효과
}

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
  choices: Choice[]; // 이번 생에 마주칠 가족의 선택 (생마다 다르게 뽑음)
  flags: string[]; // 선택이 남긴 흔적 → 나중에 이어지는 사건
  household: { extra: ('adult' | 'child' | 'baby')[]; away: number }; // 가족 구성 변화 (장면에 반영)
  sibling: Breed | null; // 함께 사는 강아지 동생
  rare: number; // 희귀한 일을 겪은 횟수
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
    rare: 0,
  };
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
  ],
  [
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
  ],
];
// 선택이 남기는 흔적. 같은 생의 뒤쪽 사건이 이 흔적을 보고 이어집니다.
const CHOICE_FLAGS: Record<string, [string, string]> = {
  school: ['kinder', ''], crate: ['bedbuddy', ''], socialize: ['brave', ''], name: ['', 'nickname'],
  weekend: ['hiker', 'couch'], trip: ['traveler', ''], sport: ['athlete', ''], cafe: ['social', ''], hobby: ['runner', 'camper'], photo: ['sns', 'album'],
  diet: ['fit', 'chubby'], sibling: ['sibling', ''], move: ['park', 'homebody'], alone: ['', 'morning'], toy: ['', 'nose'],
  checkup: ['checked', ''], swim: ['swimmer', ''], teeth: ['', ''], massage: ['massage', ''], weight: ['', ''], stairs: ['', 'carried'],
  stroller: ['stroller', ''], bucket: ['forest', 'party'], night: ['', ''], anniversary: ['', ''], portrait: ['portrait', 'paw'],
};
/** 가족의 선택을 반영합니다: 효과 + 흔적 + (동생 입양이면) 동생 강아지 */
export function choose(d: Dog, c: Choice, k: number) {
  const o = c.options[k];
  applyEffect(d, o.effect);
  const flag = CHOICE_FLAGS[c.id]?.[k];
  if (flag && !d.flags.includes(flag)) d.flags.push(flag);
  if (flag === 'sibling') {
    d.sibling = pickBreed();
    d.friends++;
  }
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
const placeKind = (d: Dog) => (d.family.id === 'farm' ? 'farm' : d.family.id === 'grand' ? 'house' : 'city');
const SEASON_WORD = [['봄바람 부는', '벚꽃 날리는', '꽃 피는'], ['한여름', '매미 우는', '소나기 그친'], ['단풍 든', '선선한', '낙엽 쌓인'], ['눈 쌓인', '찬바람 부는', '하얀 입김 나는']];
const seasonOf = (age: number) => Math.floor((age % 1) * 4) % 4;
/** {이름} {이름이} {누구} {누구가} {누구와} {장소} {계절} 를 채워 넣어요 */
const fill = (t: string, d: Dog, age: number) => {
  const who = whoOf(d);
  return t
    .replaceAll('{이름이}', nameGa(d.name)).replaceAll('{이름}', d.name)
    .replaceAll('{누구가}', ga(who)).replaceAll('{누구와}', wa(who)).replaceAll('{누구를}', who + (hasBatchim(who) ? '을' : '를')).replaceAll('{누구}', who)
    .replaceAll('{장소}', pick(PLACES[placeKind(d)])).replaceAll('{계절}', pick(SEASON_WORD[seasonOf(age)]));
};
const V = (...lines: string[]) => (d: Dog, age = 0) => fill(pick(lines), d, age);

// ── 그날그날의 작은 순간: 조각을 섞어 매번 다른 문장을 만들어요 ──
const OUTINGS: [string, string][] = [
  ['🎾', '공놀이를 했어요'], ['🥏', '원반던지기를 했어요'], ['🏃', '신나게 달리기 시합을 했어요'], ['🌼', '꽃 냄새를 하나하나 맡았어요'],
  ['🐾', '처음 보는 친구와 인사했어요'], ['🍦', '{누구가} 아이스크림 먹는 걸 구경했어요'], ['📸', '{누구가} 사진을 백 장 찍었어요'],
  ['🧺', '돗자리 위에서 낮잠을 잤어요'], ['💧', '물웅덩이를 다 밟고 다녔어요'], ['🪁', '연 날리는 아이들을 따라 뛰었어요'],
];
const REACTIONS: Record<string, string[]> = {
  sweet: ['돌아오는 길 내내 {누구} 다리에 몸을 비볐어요.', '모르는 사람에게도 배를 보여 줬어요.'],
  shy: ['오토바이 소리에 놀라 {누구} 품에 안겨 왔어요.', '처음엔 쭈뼛거렸지만 금방 꼬리를 흔들었어요.'],
  foodie: ['집에 오자마자 밥그릇 앞에 앉아 기다렸어요.', '산책보다 간식 주머니에 더 관심이 많았어요.'],
  rascal: ['목줄을 물고 {누구를} 끌고 다녔어요.', '흙투성이가 돼서 결국 목욕행.'],
  calm: ['{누구} 옆에서 의젓하게 발맞춰 걸었어요.', '벤치에 앉은 {누구} 발밑에 조용히 엎드렸어요.'],
  curious: ['가는 길마다 냄새 맡느라 한 시간이 걸렸어요.', '처음 보는 골목으로 자꾸 고개를 돌렸어요.'],
  sleepy: ['집에 오자마자 곯아떨어졌어요.', '돌아오는 길에 안아 달라고 주저앉았어요.'],
};
const HOME_MOMENTS = [
  ['👜', '퇴근한 {누구}의 가방 냄새를 꼼꼼히 검사했어요.'], ['📦', '택배 상자가 오자 {누구}보다 먼저 뜯으러 달려갔어요.'],
  ['🎵', '{누구가} 노래를 부르자 같이 하울링했어요.'], ['🍳', '{누구가} 요리하는 동안 부엌 바닥을 지켰어요.'],
  ['🧹', '청소기를 돌리는 {누구를} 따라다니며 짖었어요.'], ['🛏️', '{누구} 베개를 몰래 차지하고 잤어요.'],
  ['📖', '책 읽는 {누구} 무릎에 턱을 괴고 있었어요.'], ['🧦', '{누구} 양말 한 짝을 소파 밑에 숨겼어요.'],
  ['🌙', '잠든 {누구} 옆에서 같이 코를 골았어요.'], ['🎮', '게임하는 {누구} 옆에서 화면 속 공을 쫓았어요.'],
  ['☕', '{누구}의 주말 아침 커피 시간에 꼭 옆자리를 지켰어요.'], ['🧸', '{누구가} 사 온 새 인형을 하루 만에 해체했어요.'],
];
function dailyEvent(d: Dog, age: number): LifeEvent {
  if (Math.random() < 0.55) {
    const [icon, act] = pick(OUTINGS);
    const text = fill(`{계절} {장소}에서 {누구와} ${act}. ${pick(REACTIONS[d.personality.id] ?? [''])}`, d, age);
    return { age, month: Math.floor((age % 1) * 12), icon, text, effect: { happy: 2, health: 1 } };
  }
  const [icon, t] = pick(HOME_MOMENTS);
  return { age, month: Math.floor((age % 1) * 12), icon, text: fill(t, d, age), effect: { bond: 2 } };
}


type Pool = {
  min: number; max: number; icon: string; text: (d: Dog, age: number) => string; effect?: Partial<Stats>; friend?: boolean; memory?: boolean; key?: string;
  when?: (d: Dog) => boolean;
  need?: string; // 이 흔적(선택)이 있을 때만
  rare?: boolean;
  apply?: (d: Dog) => void;
  once?: string; // 같은 묶음 안에서는 한 번만 (가족 변화 등)
}[];

const POOL: Pool = [
  { min: 0, max: 0.4, icon: '🏠', text: (d) => `${d.family.name}에 입양됐어요. 오늘부터 이름은 '${d.name}'!`, effect: { bond: 10 }, memory: true, key: 'adopt' },
  { min: 0.1, max: 0.5, icon: '💉', text: () => '예방접종을 무사히 마쳤어요. 용감했어요!', effect: { health: 4 } },
  { min: 0.2, max: 0.9, icon: '🧻', text: () => '배변 패드를 드디어 정확히 맞혔어요. 온 가족이 박수!', effect: { bond: 4 } },
  { min: 0.3, max: 1, icon: '🌸', text: () => '첫 산책! 세상이 이렇게 냄새로 가득한 줄 몰랐어요.', effect: { happy: 6 }, memory: true, key: 'firstwalk' },
  { min: 0.3, max: 1.5, icon: '🧦', text: () => '양말 한 짝이 사라졌어요. 범인은 꼬리를 흔들고 있어요.', effect: { happy: 3 }, when: (d) => d.personality.id === 'rascal' || Math.random() < 0.4 },
  { min: 1, max: 9, icon: '🐾', text: V('공원에서 단짝 친구를 사귀었어요.', '산책길에 매일 만나는 친구가 생겼어요. 서로 엉덩이 냄새로 인사해요.', '옆집 강아지랑 담장 너머로 친구가 됐어요.', '애견카페에서 처음 본 친구와 한참을 뛰어놀았어요.'), effect: { happy: 5 }, friend: true },
  { min: 1, max: 10, icon: '🎂', text: (d) => `생일 파티! 강아지 케이크에 ${d.name}의 이름이 적혀 있었어요.`, effect: { happy: 5, bond: 3 }, memory: true, key: 'birthday' },
  { min: 1, max: 12, icon: '🍗', text: V('식탁 위 닭가슴살을 몰래 먹다 딱 걸렸어요.', '{누구가} 떨어뜨린 치즈 한 조각을 0.1초 만에 먹어 치웠어요.', '{누구} 도시락 가방에 머리를 넣었다가 들켰어요.'), effect: { happy: 4, bond: -1 }, when: (d) => d.personality.id === 'foodie' || Math.random() < 0.4 },
  { min: 1, max: 9, icon: '✂️', text: V('미용실에서 돌아왔더니 다른 강아지 같대요. 본인도 당황.', '{누구가} 집에서 털을 잘라 줬어요. 한쪽이 짝짝이가 됐어요.', '미용 끝나고 리본을 달았더니 하루 종일 으쓱했어요.'), effect: { happy: -2 } },
  { min: 1, max: 9, icon: '🌊', text: () => '처음으로 바다에 갔어요. 파도한테 짖었어요.', effect: { happy: 7 }, memory: true, key: 'sea' },
  { min: 1.5, max: 8, icon: '⛺', text: () => '가족과 캠핑을 떠났어요. 텐트 안이 제일 좋았대요.', effect: { happy: 6, bond: 5 }, memory: true, key: 'camping' },
  { min: 2, max: 10, icon: '🐱', text: () => '집에 고양이 동생이 왔어요. 아직은 서로 눈치 보는 중.', effect: { happy: -2 }, friend: true },
  { min: 2, max: 11, icon: '📦', text: V('이사를 했어요. 새 집 구석구석 냄새 확인 완료.', '집 가구 배치가 바뀌었어요. 소파 자리가 바뀌어서 한참 헤맸어요.', '새 방석이 생겼는데 결국 {누구} 이불이 더 좋대요.'), effect: { happy: -1, bond: 2 } },
  { min: 2, max: 12, icon: '❄️', text: V('첫눈이 왔어요. 눈밭에서 미친 듯이 뛰어다녔어요.', '{누구와} 눈사람을 만들었어요. 코는 내가 먹어 버렸어요.', '눈 쌓인 {장소}에 내 발자국을 잔뜩 찍었어요.'), effect: { happy: 6 }, memory: true, key: 'snow' },
  { min: 1, max: 12, icon: '😴', text: V('햇볕 드는 창가에서 낮잠. 오늘도 평화로운 하루.', '빨래 바구니 속에서 잠든 채 발견됐어요.', '가족 발밑에서 코를 골며 낮잠을 잤어요.', '비 오는 날, 하루 종일 이불 속에서 뒹굴었어요.'), effect: { happy: 3 }, when: (d) => d.personality.id === 'sleepy' || Math.random() < 0.5 },
  { min: 3, max: 12, icon: '🩺', text: () => '슬개골이 살짝 약하대요. 미끄럼 방지 매트를 깔았어요.', effect: { health: -5 }, when: (d) => d.breed.size === 'small' },
  { min: 4, max: 10, icon: '🩺', text: () => '고관절 관리를 시작했어요. 수영 재활도 같이 해요.', effect: { health: -5 }, when: (d) => d.breed.size === 'large' },
  { min: 3, max: 12, icon: '🦷', text: V('스케일링을 받았어요. 입냄새가 사라졌대요.', '{누구가} 매일 밤 양치를 시켜 줘요. 처음엔 싫었는데 이제 치약 맛이 좋아요.', '덴탈껌을 씹다가 이빨 하나가 반짝반짝해졌어요.'), effect: { health: 3 } },
  { min: 4, max: 12, icon: '🏆', text: () => '동네 강아지 운동회 달리기에서 1등!', effect: { happy: 6 }, memory: true, key: 'race', when: (d) => d.stats.health > 70 },
  { min: 6, max: 20, icon: '🤍', text: () => '주둥이에 흰 털이 하나둘 생겼어요.', effect: {} , when: () => Math.random() < 0.5 },
  { min: 8, max: 20, icon: '💊', text: () => '관절 영양제를 먹기 시작했어요. 맛있는 츄르에 섞어서.', effect: { health: 2 } , when: () => Math.random() < 0.5 },
  { min: 8, max: 20, icon: '🛋️', text: () => '계단 대신 강아지 계단을 놓았어요. 소파는 포기 못 해요.', effect: { happy: 2 } , when: () => Math.random() < 0.5 },
  { min: 9, max: 20, icon: '👂', text: () => '귀가 조금 어두워졌어요. 대신 손짓을 더 잘 봐요.', effect: { bond: 3 } , when: () => Math.random() < 0.5 },
  { min: 9, max: 20, icon: '🌅', text: (d) => `오늘은 ${nameGa(d.name)} 좋아하던 길을 아주 천천히 걸었어요.`, effect: { bond: 5, happy: 3 , when: () => Math.random() < 0.5 }, memory: true, key: 'slowwalk' },
  { min: 1, max: 6, icon: '🎾', text: () => '공을 백 번 던져 줘도 백한 번째를 기다려요.', effect: { happy: 4 }, memory: true, key: 'ball', when: (d) => d.personality.id !== 'sleepy' },
  { min: 1, max: 10, icon: '🌧️', text: () => '천둥 치는 밤, 가족 품에 파고들어 겨우 잠들었어요.', effect: { bond: 5, happy: -1 }, memory: true, key: 'thunder', when: (d) => d.personality.id === 'shy' || Math.random() < 0.3 },
  { min: 1, max: 10, icon: '🍉', text: V('여름날 수박 한 조각을 얻어먹고 세상을 다 가진 표정이었어요.', '{누구가} 깎아 준 사과를 아삭아삭 먹었어요.', '{계절} 날, {누구가} 얼려 준 강아지 아이스크림을 핥았어요.'), effect: { happy: 5 }, memory: true, key: 'watermelon' },
  { min: 1, max: 9, icon: '🎒', text: V('아이 등굣길을 매일 현관에서 배웅해요.', '막내 학교 앞까지 따라갔다가 교문에서 돌아왔어요.', '큰아이 시험 기간에 책상 밑에서 밤새 같이 있었어요.'), effect: { bond: 5 }, memory: true, key: 'school', when: (d) => d.family.id === 'kids' },
  { min: 2, max: 12, icon: '🧶', text: () => '할머니가 떠 준 목도리를 겨울 내내 둘렀어요.', effect: { happy: 4, bond: 4 }, memory: true, key: 'scarf', when: (d) => d.family.id === 'grand' },
  { min: 1, max: 12, icon: '🐓', text: () => '마당 닭들한테 쫓겨 다니다 결국 친구가 됐어요.', effect: { happy: 5 }, friend: true, memory: true, key: 'chicken', when: (d) => d.family.id === 'farm' },
  { min: 1, max: 9, icon: '🌙', text: () => '야근하고 돌아온 집사를 현관에서 꼬리로 맞았어요.', effect: { bond: 6 }, memory: true, key: 'latework', when: (d) => d.family.id === 'single' || d.family.id === 'student' },
  { min: 2, max: 9, icon: '🎓', text: () => '집사의 졸업식에 따라가서 사진을 찍었어요.', effect: { bond: 5, happy: 3 }, memory: true, key: 'graduate', when: (d) => d.family.id === 'student' },
  { min: 1, max: 10, icon: '🧺', text: V('{장소} 피크닉, 돗자리 한가운데를 차지했어요.', '{누구가} 싸 온 도시락 냄새에 피크닉 내내 앉아 있었어요.'), effect: { happy: 5, bond: 3 }, memory: true, key: 'picnic', when: (d) => d.family.id !== 'farm' },
  { min: 1, max: 12, icon: '🍂', text: V('낙엽 더미에 뛰어들어 온몸에 나뭇잎을 붙이고 왔어요.', '{누구가} 모아 둔 낙엽을 다 흩뜨려 놨어요.', '{장소}에서 도토리를 주워 와 {누구}한테 자랑했어요.'), effect: { happy: 4 }, memory: true, key: 'leaves' },
  { min: 3, max: 12, icon: '🚗', text: V('창문 열린 차 안에서 귀를 휘날리며 드라이브했어요.', '{누구와} 바닷가 드라이브를 갔어요. 창밖 냄새가 다 짭짤했어요.', '휴게소에서 {누구가} 사 준 소시지를 나눠 먹었어요.'), effect: { happy: 5 }, memory: true, key: 'drive' },
  { min: 5, max: 14, icon: '🐶', text: () => '새로 온 아기 강아지에게 산책 길을 가르쳐 줬어요.', effect: { happy: 3, bond: 2 }, friend: true, memory: true, key: 'teacher', when: (d) => d.personality.id === 'calm' || Math.random() < 0.3 },
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
  { min: 2, max: 10, icon: '👵', text: () => '시골집에 이웃 할머니가 자주 놀러 와서 누룽지를 챙겨 줘요.', effect: { happy: 4 }, friend: true, once: 'family', when: (d) => d.family.id === 'farm' && Math.random() < 0.6, apply: (d) => d.household.extra.push('adult') },
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
  { min: 1, max: 9, icon: '🦋', text: () => '나비를 쫓다가 꽃밭에 코를 박았어요.', effect: { happy: 4 } },
  { min: 1, max: 10, icon: '📮', text: () => '택배 아저씨를 경계하다 결국 간식을 얻어먹는 사이가 됐어요.', effect: { happy: 3 }, friend: true, when: (d) => d.family.id !== 'farm' },
  { min: 1, max: 10, icon: '🎃', text: () => '핼러윈에 호박 옷을 입고 동네 인기 스타가 됐어요.', effect: { happy: 4 }, memory: true, key: 'costume' },
  { min: 1, max: 10, icon: '🎄', text: V('크리스마스 트리 밑 선물 상자를 먼저 뜯었어요.', '산타 모자를 쓰고 가족사진 한가운데 앉았어요.'), effect: { happy: 4, bond: 3 }, memory: true, key: 'xmas' },
  { min: 1, max: 10, icon: '🥮', text: () => '명절에 친척들이 다 모였어요. 전 부치는 냄새에 정신이 없었어요.', effect: { happy: 3 }, when: (d) => d.family.id !== 'single' && d.family.id !== 'student' },
  { min: 1, max: 9, icon: '☔', text: V('장마철, 우비를 입고 첫 비 산책을 했어요.', '물웅덩이를 첨벙첨벙 다 밟고 다녔어요.'), effect: { happy: 4 }, memory: true, key: 'rain' },
  { min: 1, max: 10, icon: '🌻', text: () => '해바라기 밭에서 가족이 인생 사진을 건졌어요.', effect: { happy: 3, bond: 3 }, memory: true, key: 'sunflower' },
  { min: 1, max: 9, icon: '🐿️', text: () => '산에서 다람쥐를 보고 얼어붙었어요. 다람쥐도 얼어붙었어요.', effect: { happy: 4 } },
  { min: 1, max: 10, icon: '🍠', text: () => '군고구마 굽는 냄새에 오븐 앞을 떠나지 않았어요.', effect: { happy: 4 }, when: (d) => d.personality.id === 'foodie' || Math.random() < 0.4 },
  { min: 1, max: 10, icon: '🧦', text: () => '현관 신발을 한 짝씩 물어다 침대에 모아 뒀어요.', effect: { happy: 3, bond: -1 }, when: (d) => d.personality.id === 'rascal' },
  { min: 1, max: 10, icon: '🫣', text: () => '청소기 소리에 숨었다가, 꺼지자마자 청소기에게 짖었어요.', effect: { happy: 1 }, when: (d) => d.personality.id === 'shy' || Math.random() < 0.3 },
  { min: 1, max: 10, icon: '🧭', text: () => '산책길에 처음 가 보는 골목을 발견했어요. 오늘은 탐험의 날.', effect: { happy: 5 }, when: (d) => d.personality.id === 'curious' },
  { min: 1, max: 10, icon: '💞', text: () => '가족이 울던 날, 말없이 옆에 앉아 꼬리를 기대 줬어요.', effect: { bond: 8 }, memory: true, key: 'comfort', when: (d) => d.personality.id === 'calm' || d.personality.id === 'sweet' },
  { min: 2, max: 10, icon: '💼', text: () => '집사가 재택근무를 시작했어요. 화상회의에 깜짝 출연!', effect: { bond: 5, happy: 3 }, memory: true, key: 'wfh', when: (d) => d.family.id === 'single' || d.family.id === 'couple' },
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
  { min: 8, max: 20, icon: '🍲', text: () => '가족이 노견용 수제 영양식을 만들어 줬어요.', effect: { health: 4, bond: 3 }, memory: true, key: 'homefood', when: () => Math.random() < 0.5 },
  { min: 8, max: 20, icon: '🧩', text: () => '노즈워크 장난감으로 간식 찾기 놀이를 했어요. 아직 코는 최고!', effect: { happy: 4 }, when: () => Math.random() < 0.5 },
  { min: 8, max: 20, icon: '🌷', text: () => '봄볕 드는 마당에서 꽃냄새를 맡으며 한참 앉아 있었어요.', effect: { happy: 4 }, when: () => Math.random() < 0.5 },
  { min: 9, max: 20, icon: '👀', text: () => '눈이 조금 흐려졌대요. 대신 가족 발소리는 더 잘 알아들어요.', effect: { bond: 3 }, when: () => Math.random() < 0.5 },
  { min: 9, max: 20, icon: '🐕‍🦺', text: () => '어릴 적 친구를 산책길에서 다시 만났어요. 둘 다 흰 털이 났어요.', effect: { happy: 5 }, memory: true, key: 'oldfriend', when: (d) => d.friends > 0 && Math.random() < 0.5 },
  { min: 9, max: 20, icon: '🛏️', text: () => '푹신한 노견 방석을 선물받고 그 위에서만 지내요.', effect: { happy: 3 }, when: () => Math.random() < 0.5 },
  { min: 9, max: 20, icon: '🎞️', text: () => '가족이 어릴 적 사진첩을 꺼내 보며 웃었어요. 나도 옆에서 꼬리를 쳤어요.', effect: { bond: 5 }, memory: true, key: 'album', when: () => Math.random() < 0.5 },
  { min: 10, max: 20, icon: '🌕', text: () => '보름달이 뜬 밤, 가족과 마당에 나와 소원을 빌었어요.', effect: { bond: 4 }, memory: true, key: 'moon', when: () => Math.random() < 0.4 },
  { min: 10, max: 20, icon: '📷', text: V('가족이 함께 사진관에서 가족사진을 찍었어요.', '{누구가} 만든 가족 앨범 첫 장에 내 사진이 들어갔어요.', '{계절} {장소}에서 온 가족이 기념사진을 찍었어요.'), effect: { bond: 6 , when: () => Math.random() < 0.5 }, memory: true, key: 'photo' },
];

/** 한 해 동안 일어날 사건 1~3개 (월 순서대로) */
export function eventsForYear(d: Dog, year: number, used: Set<number>): LifeEvent[] {
  const count = year === 0 ? 3 : 1 + Math.floor(Math.random() * 2) + (Math.random() < 0.3 ? 1 : 0);
  const out: LifeEvent[] = [];
  const cands = POOL.map((p, i) => ({ p, i })).filter(({ p, i }) => {
    if (used.has(i) && !(p.icon === '🐾' || p.icon === '😴')) return false;
    if (p.need && !d.flags.includes(p.need)) return false;
    if (p.once && d.flags.includes(`once:${p.once}`)) return false;
    const lo = Math.max(p.min, year);
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
    const lo = Math.max(p.min, year);
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
    [d.stats.bond >= 99, '💞 가족 바라기'],
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
const BY_PICK: Record<string, [string, string]> = {
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
