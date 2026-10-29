// ✏️ SQL 스니펫 모음 설정.
// 쿼리는 원본 글(post)의 n번째 코드 블록(block, 0부터)에서 빌드 때 그대로 읽어 옵니다.
// clean: true 이면 "SQL> " 프롬프트, SQL*Plus 줄 번호, ';' 뒤의 실행 결과를 떼어 냅니다.
export interface Snippet {
  title: string;
  description: string;
  post: string;
  block: number;
  clean?: boolean;
}

export interface SnippetGroup {
  name: string;
  items: Snippet[];
}

export const SNIPPET_GROUPS: SnippetGroup[] = [
  {
    name: '용량·스토리지',
    items: [
      { title: 'Tablespace별 사용량', description: '사용·여유·전체 용량(GB)과 사용률', post: 'tistory/38', block: 0 },
      { title: 'ASM 디스크 그룹 사용량', description: 'v$asm_diskgroup 기준 전체·사용·여유 용량', post: 'tistory/37', block: 0 },
      { title: '데이터파일 목록과 상태', description: 'Tablespace별 데이터파일 경로와 ONLINE 상태', post: 'tistory/21', block: 0, clean: true },
    ],
  },
  {
    name: '세션·진행 상황',
    items: [
      { title: '진행 중인 SQL 진행률', description: '남은 시간이 있는 long operation과 SQL 텍스트', post: 'tistory/57', block: 0 },
      { title: '특정 유저의 long operation', description: '유저 세션의 v$session_longops 전체 조회', post: 'tistory/43', block: 0 },
      { title: '작업별 진행률(%)', description: 'opname 기준 진행률 계산', post: 'tistory/43', block: 1 },
    ],
  },
  {
    name: '실행 계획',
    items: [
      { title: 'SQL 플랜 변경 여부 확인', description: 'sql_id의 PLAN_HASH_VALUE, 로드·무효화 횟수', post: 'tistory/84', block: 0 },
    ],
  },
  {
    name: '오브젝트·딕셔너리',
    items: [
      { title: '테이블별 인덱스·컬럼·파티션 한눈에', description: '인덱스 컬럼 목록, 파티션 여부, LOCAL 인덱스 여부', post: 'tistory/90', block: 0 },
      { title: '컬럼 목록을 한 줄로', description: 'LISTAGG로 column_id 순서대로 이어 붙이기', post: 'tistory/55', block: 2, clean: true },
    ],
  },
  {
    name: '로그·자동 작업',
    items: [
      { title: 'Redo log 그룹·멤버 조회', description: '그룹별 멤버 파일, 크기, 상태, 시퀀스', post: 'tistory/16', block: 0, clean: true },
      { title: 'AutoTask 상태', description: '옵티마이저 통계 수집 등 자동 작업 사용 여부', post: 'tistory/70', block: 1, clean: true },
    ],
  },
];
