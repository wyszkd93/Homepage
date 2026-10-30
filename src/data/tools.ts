// 홈 카드 목록. kind 'tool' → '유용한 기능' 섹션, src/pages/tools/<slug>.astro
//               kind 'game' → '쉬어가기' 섹션, src/pages/games/<slug>.astro
// icon: 24x24 viewBox 안의 SVG 요소 (stroke 아이콘)
export interface Tool {
  kind: 'tool' | 'game';
  slug: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  badge?: 'NEW' | 'HOT';
}

export const TOOLS: Tool[] = [
  {
    kind: 'tool',
    slug: 'sql-format',
    title: 'SQL 포매터',
    description: '한 줄로 뭉친 SQL을 보기 좋게 정리해요.',
    color: '#3b78c4',
    icon: '<path d="M8 6 3 12l5 6"/><path d="m16 6 5 6-5 6"/><path d="m13.5 4-3 16"/>',
    badge: 'NEW',
  },
  {
    kind: 'tool',
    slug: 'cron',
    title: 'Cron 해석기',
    description: '크론식을 우리말로 풀고 다음 실행 시각을 알려줘요.',
    color: '#2f8f83',
    icon: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    badge: 'NEW',
  },
  {
    kind: 'tool',
    slug: 'countdown',
    title: '퇴근·주말 타이머',
    description: '퇴근까지, 주말까지 남은 시간을 세어 줘요.',
    color: '#c0632f',
    icon: '<path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.2a2 2 0 0 0-.6-1.4L12 12l-4.4 4.4a2 2 0 0 0-.6 1.4V22"/><path d="M7 2v4.2a2 2 0 0 0 .6 1.4L12 12l4.4-4.4a2 2 0 0 0 .6-1.4V2"/>',
    badge: 'NEW',
  },
  {
    kind: 'game',
    slug: 'fruit-merge',
    title: '과일 합치기',
    description: '같은 과일을 부딪혀 키워요. 목표는 수박!',
    color: '#d9534f',
    icon: '<path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/>',
    badge: 'NEW',
  },
  {
    kind: 'game',
    slug: '2048',
    title: '2048',
    description: '숫자 타일을 밀어 합쳐요. 천천히 생각해도 괜찮아요.',
    color: '#d99a1e',
    icon: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>',
    badge: 'NEW',
  },
  {
    kind: 'game',
    slug: 'bubble-wrap',
    title: '뽁뽁이',
    description: '아무 생각 없이 톡톡 터뜨려요.',
    color: '#3d9ad1',
    icon: '<circle cx="7" cy="7" r="4"/><circle cx="17" cy="7.5" r="3.5"/><circle cx="7.5" cy="17" r="3.5"/><circle cx="17" cy="17" r="4"/>',
    badge: 'NEW',
  },
];

export const toolHref = (t: Tool) => `/${t.kind === 'game' ? 'games' : 'tools'}/${t.slug}/`;
