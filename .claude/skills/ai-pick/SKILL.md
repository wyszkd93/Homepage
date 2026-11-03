---
name: ai-pick
description: 사용자가 링크(GitHub 저장소, AI 뉴스, 블로그, 논문)를 주며 "AI 픽에 올려줘/정리해줘"라고 할 때, 사이트의 AI 픽(/picks/) 항목을 만든다.
---

# AI 픽 올리기

링크 하나를 `src/content/picks/<slug>.md` 하나로 만든다. 예시: `src/content/picks/anthropic-sandbox-runtime.md`.

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
   - 본문(큐레이터 요약): 3단락, 무엇인지 → 핵심 기능 → 쓰는 법·주의점. 말투는 사이트 기본 해요체.
   - `comment`(💬 한마디): 왜 볼 만한지 1~2문장, 가능하면 DBA·운영자 관점 한 줄.
   - 뉴스·블로그는 `card.image`(og:image), `card.site`를 넣는다.
4. **확인 후 배포**
   - `npm run build` 후 `/picks/`와 상세 페이지 스크린샷을 사용자에게 보여 주고 확인받는다.
   - 확인되면 작업 브랜치에 커밋 → PR → CI 통과 후 merge → main 배포 확인.
