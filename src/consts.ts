// ✏️ 사이트 정보는 대부분 이 파일에서 수정합니다.
export const SITE = {
  title: 'mogu',
  description: '모구(mogu)의 홈페이지와 블로그',
  lang: 'ko',
  author: 'mogu',
  // 검색 엔진 소유 확인 코드. 구글 Search Console / 네이버 서치어드바이저에서 받은
  // "HTML 태그" 방식의 content 값을 넣으세요. 비워 두면 태그를 넣지 않습니다.
  verification: {
    google: '',
    naver: '',
  },
};

export const PROFILE = {
  name: '모구 (mogu)',
  tagline: '배운 것을 기록하는 DB 노트',
  about: [
    '구축에서 운영까지, Oracle을 중심으로 DB·EAI·백업 솔루션을 아우르며 데이터가 멈추지 않는 환경을 만드는 DBA입니다.',
    '내가 다시 찾아보는 메모가, 같은 문제를 만난 누군가에게는 지름길이 되길 바라며 씁니다.',
    '설치, RAC, 백업·복구, 튜닝, 장애 대응까지 직접 해 본 것만 담고, 앞으로는 오픈소스 DB 이야기도 함께 담습니다.',
  ],
  interests: ['성능 튜닝', '고가용성 (RAC·ASM)', '마이그레이션·오픈소스 DB', '운영 자동화·AI'],
  stack: ['Oracle', 'RAC · ASM', 'Data Pump', 'Tibero', 'MySQL · MariaDB', 'PostgreSQL', 'IBM MQ', 'NetBackup', 'Linux', 'Shell', 'SQL · PL/SQL'],
  // 비어 있으면 소개 페이지에 프로젝트 섹션을 표시하지 않습니다.
  projects: [] as { name: string; description: string; url?: string }[],
  links: [
    { label: 'GitHub', url: 'https://github.com/wyszkd93' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/%EC%A7%80%EC%97%B0-%EA%B0%95-1a068a264/' },
    { label: 'Email', url: 'mailto:minggaeng12@gmail.com' },
  ],
};
