// ✏️ 블로그 분류(목차) 설정: 분야(플랫폼) › 주제 2단계.
// 글의 frontmatter `platform`, `topic`이 우선이고, 없으면 제목으로 추정합니다.
// 사이드바에는 글이 있는 분야·주제만 이 순서대로 나옵니다.

export interface Platform {
  slug: string;
  name: string;
  description: string;
  color: string;
  /** 이 분야에서 쓰는 주제 묶음 */
  topics: 'db' | 'os';
  /** 제목에 이 단어가 있으면 이 분야로 추정 (소문자) */
  keywords: string[];
}

export interface Topic {
  slug: string;
  name: string;
  description: string;
  /** 자동 분류용 제목 말머리 (소문자, 띄어쓰기 없이) */
  prefixes: string[];
}

export const PLATFORMS: Platform[] = [
  { slug: 'oracle', name: 'Oracle', description: 'Oracle Database', color: '#c0632f', topics: 'db', keywords: ['oracle', '오라클'] },
  { slug: 'mysql', name: 'MySQL·MariaDB', description: 'MySQL, MariaDB', color: '#2f6f9f', topics: 'db', keywords: ['mysql', 'mariadb', 'maria'] },
  { slug: 'postgresql', name: 'PostgreSQL', description: 'PostgreSQL', color: '#3b5f9e', topics: 'db', keywords: ['postgres', 'postgresql'] },
  { slug: 'tibero', name: 'Tibero', description: 'TmaxTibero', color: '#2f8f83', topics: 'db', keywords: ['tibero', '티베로'] },
  { slug: 'os', name: 'OS', description: '리눅스·윈도우 서버', color: '#6a7480', topics: 'os', keywords: [] },
];

export const DB_TOPICS: Topic[] = [
  { slug: 'concepts', name: '아키텍처·개념', description: '구조와 핵심 개념', prefixes: ['doc'] },
  { slug: 'install', name: '설치', description: '설치와 초기 구성', prefixes: ['install'] },
  { slug: 'ha', name: 'RAC·고가용성', description: 'RAC, 복제, 이중화', prefixes: ['rac'] },
  { slug: 'ops', name: '운영·관리', description: '로그, 데이터파일, 리스너, DB 링크 등 일상 운영', prefixes: ['admin'] },
  { slug: 'backup', name: '백업·복구·이관', description: '백업·복구, 덤프, 마이그레이션', prefixes: ['backup&recovery', 'datapump', 'migration', 'mig'] },
  { slug: 'tuning', name: '성능·튜닝', description: '실행 계획, 옵티마이저, 힌트', prefixes: ['tuning'] },
  { slug: 'monitoring', name: '모니터링·진단', description: '성능 리포트, 대기 이벤트, 트레이스, 세션', prefixes: ['tool'] },
  { slug: 'troubleshooting', name: '트러블슈팅', description: '에러와 장애 대응', prefixes: ['ts'] },
  { slug: 'sql', name: 'SQL·딕셔너리', description: '자주 쓰는 쿼리, PL/SQL, 딕셔너리 뷰', prefixes: ['sql', 'pl/sql', 'view'] },
  { slug: 'script', name: '스크립트·자동화', description: '쉘·배치 스크립트, 스케줄러', prefixes: ['shell', 'shellscript', 'scheduler'] },
  { slug: 'etc', name: '기타', description: '그 밖의 글', prefixes: ['etc'] },
];

export const OS_TOPICS: Topic[] = [
  { slug: 'linux', name: 'Linux', description: '리눅스 서버 설정', prefixes: ['os'] },
  { slug: 'windows', name: 'Windows', description: '윈도우 서버·배치', prefixes: ['netsh'] },
];

export const DEFAULT_PLATFORM = 'oracle';

export const topicsOf = (p: Platform) => (p.topics === 'os' ? OS_TOPICS : DB_TOPICS);
