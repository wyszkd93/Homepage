---
name: ai-pick
description: 사용자가 링크(GitHub 저장소, AI 뉴스, 블로그, 논문)를 주며 "AI 픽에 올려줘/정리해줘"라고 할 때, 사이트의 AI 픽(/picks/) 항목을 만든다.
---

# AI 픽 올리기

링크 하나를 `src/content/picks/<slug>.md` 하나로 만든다. 예시: `src/content/picks/anthropic-sandbox-runtime.md`.

## 자동 수집 출처 (2026-11-03 접속 확인)
| 출처 | 읽을 주소 | 상태 |
|---|---|---|
| AI 타임스 | https://www.aitimes.com/rss/allArticle.xml , https://www.aitimes.com/news/articleList.html?sc_section_code=S1N24&view_type=sm | ✅ (robots: /admin/만 금지) |
| Anthropic | https://www.anthropic.com/news | ✅ |
| OpenAI | https://openai.com/news/rss.xml (웹 페이지는 봇 차단 403 → 본문을 못 읽으면 올리지 않음) | ✅ RSS |
| Google DeepMind | https://deepmind.google/blog/rss.xml (gzip으로 와요: `curl --compressed`), https://deepmind.google/blog/ | ✅ |
| Meta AI | https://ai.meta.com/blog/ | ✅ |
| ZDNet Korea | https://zdnet.co.kr/feed/article_list.xml (RSS가 아니라 sitemap 형식: `<url><loc>`) | ✅ (robots: /Include2/user/, /Contents/ 금지) |
| PostgreSQL | https://www.postgresql.org/news.rss | ✅ |
| GitHub 새 인기 저장소 | `https://api.github.com/search/repositories?q=topic:<주제>+created:>YYYY-MM-DD+stars:>=200&sort=stars&order=desc&per_page=10` (주제: llm, ai-agent, mcp, claude, rag, vector-database, text-to-sql / 최근 7일) — trending 웹은 403 | ✅ API (비로그인 분당 10회 제한) |
| GeekNews | https://news.hada.io/rss/news → https://feeds.feedburner.com/geeknews-feed (웹 페이지는 403) | ✅ RSS (Atom) |
| Oracle 블로그 | blogs.oracle.com (Akamai 403) | ❌ 사이트가 봇 차단 |

## DB 탭 (2026-11-09 추가)
피드는 AI 탭과 DB 탭 두 개예요. frontmatter `topic: ai | db`로 나누고, 빠뜨리면 ai예요.
- **DB 탭에 올릴 것**: AI와 상관없어도 DBA 실무에 바로 쓸 만한 DB 도구·확장·운영 소식 (마스킹, 모니터링, 백업, 마이그레이션, 성능 도구, 새 버전의 운영 영향 등). 홍보성 유료 제품 소개는 제외
- **DB 출처**
  | 출처 | 읽을 주소 | 상태 |
  |---|---|---|
  | PostgreSQL 뉴스 | https://www.postgresql.org/news.rss (AI가 아니어도 됨) | ✅ |
  | GitHub | 검색 API `topic:<주제>+created:>YYYY-MM-DD+stars:>=100` (주제: database, postgresql, mysql, oracle-database, sql, dba / 최근 14일) | ✅ API |
  | GeekNews, AI 타임스 | DB 관련 글만 (원문을 읽을 수 있을 때) | ✅ |
  | Planet PostgreSQL, MySQL, MariaDB, Percona, DuckDB 블로그 | 이 세션 네트워크에서 막힘 (2026-11-09 확인) | ❌ |
- **개수**: AI 1~3개와 별도로 DB 0~2개. 볼 만한 게 없으면 0개
- **GitHub 기준**: DB 도구는 별이 적은 경우가 많아, 공식 뉴스(PostgreSQL 뉴스 등)에 소개된 저장소는 별 수와 관계없이 후보. 그 밖에는 별 100개 이상, LICENSE 필수
- 요약 3단 구성과 저작권 규칙은 AI 탭과 같아요. 예시: `src/content/picks/brume.md`

## 순서
1. **저작권 확인 먼저**
   - 원문 본문을 복사해 붙이지 않는다. `original`에는 원문이 스스로 공개한 **한 줄 설명**(GitHub 저장소 설명, og:description)만 그대로 넣는다.
   - 요약은 원문을 읽고 **직접 쓴 한국어 문장**으로 쓴다. 남의 큐레이션 문장(다른 사이트 요약)을 옮기지 않는다.
   - GitHub이면 LICENSE를 확인해 `license`에 적는다. 라이선스가 없으면 링크·요약 소개만 하고 본문·코드는 옮기지 않는다.
2. **원문 읽기**
   - GitHub: `GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1 <url> <스크래치패드>/<이름>` 후 README·LICENSE를 읽는다(같은 세션 프록시로 공개 저장소 읽기 가능).
   - 웹 글: 도메인이 막혀 있으면 사용자에게 환경 설정의 Allowed domains 추가를 부탁하거나, 사용자가 붙여 넣은 내용만 쓴다.
   - 별·포크 수 같은 숫자는 확인할 수 있을 때만 넣고 `asOf`에 날짜를 적는다. 추측해서 쓰지 않는다.
3. **파일 쓰기** (frontmatter는 `src/content.config.ts`의 `picks` 스키마)
   - `title`: 무엇인지 한눈에 보이는 한국어 제목 (예: "컨테이너 없이 AI 에이전트를 가두는 Anthropic의 샌드박스, srt")
   - `kind`: github | news | blog | paper | video, `tags`: 2~4개
   - 본문(큐레이터 요약): **원문(README·기사) 순서와 예시를 따라 쓰지 않는다.** 우리 식 3단 구성으로 직접 쓴다. 말투는 해요체.
     1. `한 줄로 말하면 "…"예요.` 로 시작해 비유 한 줄 + 무엇인지 2~3문장 (굵게는 따옴표 안쪽 단어에만: `"…**울타리**"예요`)
     2. `DBA 눈으로 보면 …` + 불릿 2~3개: 원문 예시 대신 Oracle·DB 운영 상황으로 직접 만든 쓰임새 (`- **상황**: 설명`)
     3. `써 보기 전에 알아둘 것도 있어요.` 설치·사용 한 줄, 한계·주의점, 라이선스
     - 예시: `src/content/picks/anatomy.md`
   - `comment`(💬 한마디): 왜 볼 만한지 1~2문장. 본문 불릿과 같은 예시를 되풀이하지 않는다.
   - 뉴스·블로그는 `card.site`를 넣는다. `card.image`(og:image)는 이미지가 실제로 열리는지 확인될 때만 넣는다(확인 못 하면 빈 상자가 생기니 생략). 뉴스 og:image 사진은 언론사·제3자 저작물이라 핫링크만 하고 저장하지 않는다.
4. **확인 후 배포**
   - `npm run build` 후 `/picks/`와 상세 페이지 스크린샷을 사용자에게 보여 주고 확인받는다.
   - 확인되면 작업 브랜치에 커밋 → PR → CI 통과 후 merge → main 배포 확인.
