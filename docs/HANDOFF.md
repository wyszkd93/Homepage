# 작업 기록 (2026-10-29 기준)

다음에 작업을 이어갈 때 이 문서부터 읽으면 됩니다.

- 사이트: https://wyszkd93.github.io/Homepage/
- 저장소: `wyszkd93/Homepage` (main 브랜치에 push되면 GitHub Actions가 자동 배포)
- 백업 시점 커밋: `c985751` (2026-10-29 main) — 이 시점으로 되돌릴 때 기준

## 지금까지 한 것

- **사이트 기본**: Astro, 밝은 톤 디자인, 다크 모드, 모구(mogu) 캐릭터, 검색(Ctrl+K 또는 `/`), 코드 복사 버튼, 이메일 안내창
- **티스토리 이전**: study-storage93.tistory.com 글 77개를 이전했습니다. 이미지와 첨부파일도 함께 옮겼습니다.
  - 첨부파일은 `public/files/tistory/`에 있습니다. 반드시 유지합니다.
  - 72·73번 글은 목차를 직접 손봤기 때문에 `--force`로 다시 가져오면 수정 내용이 사라집니다.
- **카테고리**: 분야(platform) › 주제(topic) 2단 구조입니다. `src/categories.ts`에 정의되어 있습니다.
  - 분야: Oracle, MySQL·MariaDB, PostgreSQL, Tibero, IBM MQ, OS. 글이 없는 분야는 화면에 나오지 않습니다.
  - 블로그 사이드바는 분야별로 접고 펼치는 방식입니다.
- **직접 쓴 글**: IBM MQ runmqsc 명령어 모음 (`src/content/blog/ibm-mq-runmqsc.md`)
- **스니펫 페이지**: Oracle 11개, IBM MQ 4개 (`src/data/snippets.ts`)
- **유용한 기능 (홈 카드)**: SQL 포매터, Cron 해석기, 퇴근·주말 타이머 (`/tools/...`)
  - 카드 목록은 `src/data/tools.ts`에 있습니다. 도구를 추가할 때는 `src/pages/tools/<slug>.astro` 파일을 만들고 이 목록에 한 줄을 넣습니다.
  - 모두 브라우저에서만 동작하며, 설정값은 그 브라우저에만 저장됩니다.
- **소개 페이지**: `src/consts.ts`의 `PROFILE`
  - 회사명, 재직 기간 같은 회사 관련 내용은 넣지 않기로 했습니다.
  - 프로젝트 섹션은 내용이 비어 있어서 숨겨 두었습니다.
- **RSS**: 화면 링크만 숨겼습니다. 주소(`/rss.xml`)는 그대로 살아 있습니다.

## 다음에 할 수 있는 것

- [ ] 프로젝트 섹션 내용 넣기: `src/consts.ts`의 `PROFILE.projects`를 채우면 섹션이 자동으로 나타납니다.
- [ ] 검색엔진 등록
  1. Google Search Console과 네이버 서치어드바이저에서 받은 인증 meta 값을 `SITE.verification`에 넣습니다.
  2. 인증 후 `sitemap-index.xml`과 `rss.xml`을 제출합니다.
- [ ] 새 글 추가
  - `src/content/blog/`에 `.md` 파일을 만들고 `platform`, `topic`을 지정합니다.
  - 티스토리 글은 `npm run import:tistory -- study-storage93`로 가져옵니다.
- [ ] 오픈소스 DB(MySQL·MariaDB, PostgreSQL) 글이 생기면 해당 분야가 자동으로 표시됩니다.

## 작업 방식 메모

- 작업 브랜치에서 수정 → PR → CI 빌드 통과 후 merge → main 배포를 확인합니다.
- GitHub 사용자명(wyszkd93)과 저장소 이름(Homepage)은 바꾸지 않습니다. 주소는 `/Homepage/`로 유지합니다.
- 로컬 확인 순서:
  1. `npm install`
  2. `npm run build`
  3. `npx astro preview`
