// ✏️ 블로그 카테고리(목차) 설정.
// 글 제목 앞의 말머리 "[ADMIN]" 등을 보고 카테고리를 정합니다(대소문자·띄어쓰기 무시).
// 글의 frontmatter에 `category: 슬러그`를 적으면 그 값이 우선합니다.
export interface Category {
  slug: string;
  name: string;
  description: string;
  color: string;
  prefixes: string[];
}

export const CATEGORIES: Category[] = [
  { slug: 'admin', name: '관리', description: 'DB 운영·관리, 트러블슈팅', color: '#c0632f', prefixes: ['admin', 'ts'] },
  { slug: 'sql', name: 'SQL·뷰', description: 'SQL, PL/SQL, 딕셔너리 뷰', color: '#2f7d8c', prefixes: ['sql', 'pl/sql', 'view'] },
  { slug: 'tuning', name: '튜닝', description: '실행 계획, 옵티마이저, 성능 분석', color: '#8a5cc2', prefixes: ['tuning'] },
  { slug: 'rac', name: 'RAC', description: 'Oracle RAC 구축과 운영', color: '#c98a12', prefixes: ['rac'] },
  { slug: 'install', name: '설치', description: 'Oracle·Tibero 설치', color: '#3b78c4', prefixes: ['install'] },
  { slug: 'backup', name: '백업·이관', description: '백업·복구, Data Pump, 마이그레이션', color: '#4f8a4a', prefixes: ['backup&recovery', 'datapump', 'migration', 'mig'] },
  { slug: 'script', name: '스크립트·OS', description: '쉘 스크립트, 스케줄러, OS 설정', color: '#6a7480', prefixes: ['shell', 'shellscript', 'scheduler', 'os', 'netsh'] },
  { slug: 'etc', name: '기타', description: '문서, 도구, 그 밖의 글', color: '#9a7b5f', prefixes: ['etc', 'doc', 'tool'] },
];

export const DEFAULT_CATEGORY = 'etc';
