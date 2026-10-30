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
    slug: 'mogu-jump',
    title: '모구 점프',
    description: '버그와 락을 뛰어넘으며 최대한 멀리 달려요.',
    color: '#d9822b',
    icon: '<path d="M4 20h16"/><path d="M8 16c0-4 2-7 4-9"/><circle cx="14" cy="5" r="2"/><path d="m6 12 3-2 3 3"/>',
    badge: 'NEW',
  },
  {
    kind: 'game',
    slug: 'sql-typing',
    title: 'SQL 타자 연습',
    description: '자주 쓰는 SQL·명령어를 빠르고 정확하게 쳐 봐요.',
    color: '#8a5cc2',
    icon: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
    badge: 'NEW',
  },
];

export const toolHref = (t: Tool) => `/${t.kind === 'game' ? 'games' : 'tools'}/${t.slug}/`;
