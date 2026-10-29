// ✏️ 블로그 카테고리(목차) 설정. 사이드바에 이 순서대로 나옵니다.
// 글의 frontmatter `category: 슬러그`가 우선이고, 없으면 제목 말머리("[ADMIN]" 등)로 자동 분류합니다.
export interface Category {
  slug: string;
  name: string;
  description: string;
  color: string;
  /** 자동 분류에 쓰는 제목 말머리 (소문자, 띄어쓰기 없이) */
  prefixes: string[];
}

export const CATEGORIES: Category[] = [
  { slug: 'concepts', name: '아키텍처·개념', description: '오라클 구조와 핵심 개념', color: '#3b78c4', prefixes: ['doc'] },
  { slug: 'install', name: '설치', description: 'Oracle·Tibero 설치', color: '#2f8f83', prefixes: ['install'] },
  { slug: 'rac', name: 'RAC', description: 'Oracle RAC 구축과 운영', color: '#c98a12', prefixes: ['rac'] },
  { slug: 'ops', name: '운영·관리', description: '로그, 데이터파일, 리스너, DB 링크 등 일상 운영', color: '#c0632f', prefixes: ['admin'] },
  { slug: 'backup', name: '백업·복구·이관', description: '백업·복구, Data Pump, 마이그레이션', color: '#4f8a4a', prefixes: ['backup&recovery', 'datapump', 'migration', 'mig'] },
  { slug: 'tuning', name: '성능·튜닝', description: '실행 계획, 옵티마이저, 힌트', color: '#8a5cc2', prefixes: ['tuning'] },
  { slug: 'monitoring', name: '모니터링·진단', description: 'AWR, 대기 이벤트, 트레이스, 모니터링 도구', color: '#2a7fa8', prefixes: ['tool'] },
  { slug: 'troubleshooting', name: '트러블슈팅', description: 'ORA 에러와 장애 대응', color: '#c2414b', prefixes: ['ts'] },
  { slug: 'sql', name: 'SQL·딕셔너리', description: '자주 쓰는 쿼리, PL/SQL, 딕셔너리 뷰', color: '#2f7d8c', prefixes: ['sql', 'pl/sql', 'view'] },
  { slug: 'os', name: '리눅스·OS', description: '리눅스·윈도우 서버 설정', color: '#6a7480', prefixes: ['os', 'netsh'] },
  { slug: 'script', name: '스크립트·자동화', description: '쉘·배치 스크립트, crontab', color: '#9a6b3f', prefixes: ['shell', 'shellscript', 'scheduler'] },
  { slug: 'etc', name: '기타', description: '그 밖의 글', color: '#9a8f85', prefixes: ['etc'] },
];

export const DEFAULT_CATEGORY = 'etc';
